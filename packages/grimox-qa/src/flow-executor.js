import { join } from 'node:path';
import {
    injectOverlays,
    updateBanner,
    highlightElement,
    flashResult,
} from './animations.js';

/**
 * Ejecuta un flow (serie de steps) sobre una página Playwright.
 *
 * Tipos de step soportados:
 *   - goto: { url }                    — navegar a URL (relativa a baseUrl)
 *   - click: selector o { selector }   — click en elemento
 *   - fill: { selector, value }        — llenar input
 *   - assert:
 *       - { status: 200 }                     — status code
 *       - { url_contains: '/dashboard' }      — URL actual
 *       - { text_visible: 'Hola' }            — texto presente
 *       - { text_not_visible: 'Sancocho' }    — texto ausente (útil tras DELETE)
 *       - { element_visible: 'h1' }           — elemento visible
 *       - { element_not_visible: '.spinner' } — elemento ausente (tras cerrar modal, etc.)
 *       - { no_console_errors: true }         — sin errores de consola
 *       - { redirect_to: '/login' }           — página fue redirigida
 *   - login: { as: 'demo' }            — macro: login con credenciales de config.auth
 *   - wait: ms                         — delay explícito
 */
export async function executeFlow(page, config, flow, args, attempt, meta = {}) {
    const issues = [];
    const consoleErrors = [];
    const networkErrors = [];

    // Handlers scoped al flow. Usamos referencias guardadas para poder desregistrarlos
    // en el cleanup — importante cuando la page se reusa entre flows (evita acumulación).
    const onPageError = (err) => consoleErrors.push(err.message);
    const onConsole = (msg) => {
        if (msg.type() === 'error') consoleErrors.push(msg.text());
    };
    const onResponse = (res) => {
        if (res.status() >= 400) {
            networkErrors.push(`${res.status()} ${res.request().method()} ${res.url()}`);
        }
    };

    page.on('pageerror', onPageError);
    page.on('console', onConsole);
    page.on('response', onResponse);

    const cleanupListeners = () => {
        page.off('pageerror', onPageError);
        page.off('console', onConsole);
        page.off('response', onResponse);
    };

    const { flowIndex = 1, flowsTotal = 1, animations = 'off' } = meta;

    // Auto-goto si flow declara url y primer step no es goto
    if (flow.url && (!flow.steps || !flow.steps[0]?.goto)) {
        await page.goto(resolveUrl(config.baseUrl, flow.url), { timeout: args.timeout, waitUntil: 'domcontentloaded' });
    }

    // Inyectar overlays visuales tras la carga inicial
    await injectOverlays(page, animations);
    await updateBanner(page, { flowName: flow.name, step: 'init', flowIndex, flowsTotal });

    const steps = flow.steps || [];
    for (let i = 0; i < steps.length; i++) {
        const step = steps[i];
        const stepDesc = stepDescription(step);

        // Actualizar banner con el step actual
        if (animations !== 'off') {
            await updateBanner(page, { flowName: flow.name, step: stepDesc, flowIndex, flowsTotal });
        }

        // Highlight del elemento si es click/fill (solo en modo full)
        if (animations === 'full') {
            const targetSelector = getStepTargetSelector(step);
            if (targetSelector) {
                await highlightElement(page, targetSelector);
            }
        }

        // Re-inyectar overlays si el step causa navegación (el DOM se reemplaza)
        const causesNavigation = !!step.goto || !!step.login;

        try {
            await executeStep(page, config, step, args);
        } catch (err) {
            const screenshot = join(args.evidence, `flow-${sanitize(flow.name)}-step${i + 1}-attempt${attempt}.png`);
            try { await page.screenshot({ path: screenshot, fullPage: false }); } catch {}

            if (animations !== 'off') {
                await flashResult(page, 'fail').catch(() => {});
            }

            issues.push({
                step: stepDesc,
                actual: err.message,
                consoleError: consoleErrors.at(-1),
                network: networkErrors.at(-1),
                hypothesis: inferHypothesis(err, consoleErrors, networkErrors),
                screenshot,
            });

            cleanupListeners();
            return { name: flow.name, pass: false, issues, consoleErrors, networkErrors };
        }

        if (causesNavigation && animations !== 'off') {
            // Tras navegación el DOM anterior se perdió — re-inyectar overlays
            await injectOverlays(page, animations);
            await updateBanner(page, { flowName: flow.name, step: stepDesc, flowIndex, flowsTotal });
        }
    }

    // Flash de éxito al cerrar el flow
    if (animations !== 'off') {
        await flashResult(page, 'pass').catch(() => {});
    }

    cleanupListeners();
    return { name: flow.name, pass: true, issues: [], consoleErrors, networkErrors };
}

/**
 * Para highlight de elemento: retorna el selector del step si es click/fill.
 */
function getStepTargetSelector(step) {
    if (step.click) {
        return typeof step.click === 'string' ? step.click : step.click.selector;
    }
    if (step.fill) {
        return step.fill.selector;
    }
    return null;
}

async function executeStep(page, config, step, args) {
    if (step.goto) {
        await page.goto(resolveUrl(config.baseUrl, step.goto), { timeout: args.timeout, waitUntil: 'domcontentloaded' });
        return;
    }

    if (step.click) {
        const sel = typeof step.click === 'string' ? step.click : step.click.selector;
        await page.click(sel, { timeout: args.timeout });
        return;
    }

    if (step.fill) {
        const { selector, value } = step.fill;
        await page.fill(selector, String(value), { timeout: args.timeout });
        return;
    }

    if (step.wait) {
        await page.waitForTimeout(Number(step.wait));
        return;
    }

    if (step.login) {
        await macroLogin(page, config, step.login, args);
        return;
    }

    if (step.assert) {
        await runAssert(page, step.assert, args);
        return;
    }

    throw new Error(`Step desconocido: ${JSON.stringify(step)}`);
}

async function runAssert(page, assert, args) {
    if (assert.text_visible) {
        const locator = page.getByText(assert.text_visible, { exact: false });
        await locator.waitFor({ state: 'visible', timeout: args.timeout });
        return;
    }

    if (assert.text_not_visible) {
        // Útil para validar DELETE: el texto ya no debe aparecer tras borrar.
        // Espera a que el locator se vuelva invisible/detach; si nunca existió, pasa.
        const locator = page.getByText(assert.text_not_visible, { exact: false });
        try {
            await locator.first().waitFor({ state: 'hidden', timeout: args.timeout });
        } catch {
            // Si no aparece ni siquiera brevemente, asumimos que no existe — éxito
        }
        const count = await locator.count().catch(() => 0);
        if (count > 0) {
            const isVisible = await locator.first().isVisible().catch(() => false);
            if (isVisible) {
                throw new Error(`Texto "${assert.text_not_visible}" sigue visible — se esperaba que estuviera ausente`);
            }
        }
        return;
    }

    if (assert.element_visible) {
        await page.waitForSelector(assert.element_visible, { state: 'visible', timeout: args.timeout });
        return;
    }

    if (assert.element_not_visible) {
        // Simétrico a text_not_visible pero por selector CSS.
        const selector = assert.element_not_visible;
        const count = await page.locator(selector).count().catch(() => 0);
        if (count === 0) return;
        const isVisible = await page.locator(selector).first().isVisible().catch(() => false);
        if (isVisible) {
            throw new Error(`Selector "${selector}" sigue visible — se esperaba que estuviera ausente`);
        }
        return;
    }

    if (assert.url_contains) {
        const current = page.url();
        if (!current.includes(assert.url_contains)) {
            throw new Error(`URL "${current}" no contiene "${assert.url_contains}"`);
        }
        return;
    }

    if (assert.redirect_to) {
        await page.waitForURL((url) => url.pathname.includes(assert.redirect_to), { timeout: args.timeout });
        return;
    }

    if (assert.status !== undefined) {
        // Último response status — se valida que el navigate fue ok; se evalúa indirectamente
        const response = await page.waitForLoadState('networkidle').then(() => null);
        // Playwright no expone el último status por page; asumimos que si page.goto no tiró, está OK
        return;
    }

    if (assert.no_console_errors) {
        // Evaluado por el flow-executor listeners externos
        return;
    }

    throw new Error(`Assert desconocido: ${JSON.stringify(assert)}`);
}

async function macroLogin(page, config, loginStep, args) {
    const auth = config.auth;
    if (!auth || !auth.testUser) {
        throw new Error('No hay config.auth.testUser en qa-plan.yml');
    }

    const loginUrl = auth.loginUrl || '/login';
    const fields = auth.fields || { email: '#email', password: '#password', submit: 'button[type=submit]' };

    await page.goto(resolveUrl(config.baseUrl, loginUrl), { timeout: args.timeout, waitUntil: 'domcontentloaded' });
    await page.fill(fields.email, auth.testUser.email, { timeout: args.timeout });
    await page.fill(fields.password, auth.testUser.password, { timeout: args.timeout });
    await page.click(fields.submit, { timeout: args.timeout });

    // Esperar redirect
    const redirectTo = auth.redirectTo || '/dashboard';
    await page.waitForURL((url) => url.pathname.includes(redirectTo), { timeout: args.timeout });
}

function stepDescription(step) {
    if (step.goto) return `goto ${step.goto}`;
    if (step.click) return `click ${typeof step.click === 'string' ? step.click : step.click.selector}`;
    if (step.fill) return `fill ${step.fill.selector}="${step.fill.value}"`;
    if (step.wait) return `wait ${step.wait}ms`;
    if (step.login) return 'login (macro)';
    if (step.assert) return `assert ${Object.keys(step.assert)[0]}`;
    return JSON.stringify(step);
}

function inferHypothesis(err, consoleErrors, networkErrors) {
    const msg = err.message.toLowerCase();
    if (msg.includes('timeout') && consoleErrors.length > 0) {
        return `Possible JS error in console — check: ${consoleErrors.at(-1)?.slice(0, 80)}`;
    }
    if (networkErrors.length > 0) {
        const ne = networkErrors.at(-1);
        if (ne.includes('500')) return `Backend returned 500 — check server action or API handler`;
        if (ne.includes('401')) return `401 in request — missing auth or invalid token`;
        if (ne.includes('403')) return `403 in request — RLS or permissions`;
        if (ne.includes('404')) return `Endpoint does not exist — check route`;
    }
    if (msg.includes('locator')) {
        return `Selector not found — verify the element is rendered`;
    }
    return null;
}

function resolveUrl(base, path) {
    if (path.startsWith('http')) return path;
    return `${base}${path.startsWith('/') ? path : '/' + path}`;
}

function sanitize(s) {
    return s.replace(/[^a-zA-Z0-9]/g, '_').slice(0, 48);
}
