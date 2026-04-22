/**
 * Inyección de overlays visuales en la página durante el QA.
 *
 * Los overlays son CSS + DOM inyectados dinámicamente por Playwright. Viven
 * solo durante el test — la app real no los ve nunca. Se usan en modo
 * `--animations=full` para dar feedback visual al usuario orquestador.
 *
 * Niveles:
 *   full    → banner + highlight + progress bar + flash (default en desktop local)
 *   minimal → solo banner superior (menos intrusivo)
 *   off     → sin overlays (modo CI o user override)
 */

const STYLES = `
#grimox-qa-banner {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 2147483647;
    padding: 10px 16px;
    background: linear-gradient(90deg, #6366f1, #a855f7, #ec4899, #6366f1);
    background-size: 300% 100%;
    animation: grimox-qa-shimmer 3s linear infinite;
    color: white;
    font: 500 13px/1.4 system-ui, -apple-system, 'Segoe UI', sans-serif;
    text-shadow: 0 1px 2px rgba(0,0,0,0.3);
    box-shadow: 0 4px 16px rgba(0,0,0,0.2);
    pointer-events: none;
    transition: transform 0.3s ease-out;
    display: flex;
    align-items: center;
    gap: 12px;
}

#grimox-qa-banner.hide {
    transform: translateY(-100%);
}

#grimox-qa-banner .gx-icon {
    font-size: 16px;
    filter: drop-shadow(0 1px 2px rgba(0,0,0,0.3));
}

#grimox-qa-banner .gx-title {
    font-weight: 700;
    font-size: 14px;
}

#grimox-qa-banner .gx-sep {
    opacity: 0.6;
}

#grimox-qa-banner .gx-step {
    opacity: 0.95;
    font-family: 'SF Mono', Menlo, Consolas, monospace;
    font-size: 12px;
    background: rgba(255,255,255,0.2);
    padding: 3px 8px;
    border-radius: 6px;
}

#grimox-qa-progress {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 2147483647;
    height: 4px;
    background: rgba(99, 102, 241, 0.15);
    pointer-events: none;
}

#grimox-qa-progress .gx-bar {
    height: 100%;
    background: linear-gradient(90deg, #6366f1, #ec4899);
    transition: width 0.4s ease-out;
    box-shadow: 0 -1px 8px rgba(99, 102, 241, 0.4);
}

.grimox-qa-highlight {
    outline: 3px solid #06b6d4 !important;
    outline-offset: 2px !important;
    box-shadow: 0 0 0 6px rgba(6, 182, 212, 0.25), 0 0 20px rgba(6, 182, 212, 0.5) !important;
    animation: grimox-qa-pulse 0.8s ease-out 2 !important;
    border-radius: 4px !important;
    transition: all 0.15s ease-out !important;
}

#grimox-qa-flash {
    position: fixed;
    inset: 0;
    z-index: 2147483646;
    display: flex;
    align-items: center;
    justify-content: center;
    pointer-events: none;
    opacity: 0;
    transition: opacity 0.25s ease-out;
}

#grimox-qa-flash.pass {
    background: radial-gradient(circle, rgba(34, 197, 94, 0.25), rgba(34, 197, 94, 0));
    opacity: 1;
}

#grimox-qa-flash.fail {
    background: radial-gradient(circle, rgba(239, 68, 68, 0.3), rgba(239, 68, 68, 0));
    opacity: 1;
}

#grimox-qa-flash .gx-flash-icon {
    font-size: 120px;
    font-weight: 900;
    text-shadow: 0 4px 20px rgba(0,0,0,0.3);
    animation: grimox-qa-pop 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
}

#grimox-qa-flash.pass .gx-flash-icon {
    color: #22c55e;
}

#grimox-qa-flash.fail .gx-flash-icon {
    color: #ef4444;
}

@keyframes grimox-qa-shimmer {
    0% { background-position: 0% 50%; }
    100% { background-position: 300% 50%; }
}

@keyframes grimox-qa-pulse {
    0%, 100% { transform: scale(1); opacity: 1; }
    50% { transform: scale(1.02); opacity: 0.8; }
}

@keyframes grimox-qa-pop {
    0% { transform: scale(0.3); opacity: 0; }
    60% { transform: scale(1.1); opacity: 1; }
    100% { transform: scale(1); opacity: 1; }
}
`;

/**
 * Inyecta los estilos y el DOM de overlays en la página.
 * Llamar una vez por página antes del primer step.
 */
export async function injectOverlays(page, level) {
    if (level === 'off') return;

    await page.addStyleTag({ content: STYLES }).catch(() => {});

    await page.evaluate(() => {
        if (document.getElementById('grimox-qa-banner')) return;

        const banner = document.createElement('div');
        banner.id = 'grimox-qa-banner';
        banner.innerHTML = `
            <span class="gx-icon">🧪</span>
            <span class="gx-title">grimox-qa</span>
            <span class="gx-sep">·</span>
            <span class="gx-flow">Preparando…</span>
            <span class="gx-sep">·</span>
            <span class="gx-step">init</span>
        `;
        document.body.appendChild(banner);

        const progress = document.createElement('div');
        progress.id = 'grimox-qa-progress';
        progress.innerHTML = '<div class="gx-bar" style="width: 0%"></div>';
        document.body.appendChild(progress);

        const flash = document.createElement('div');
        flash.id = 'grimox-qa-flash';
        flash.innerHTML = '<span class="gx-flash-icon"></span>';
        document.body.appendChild(flash);
    }).catch(() => {});
}

/**
 * Actualiza el banner con flow actual + step + progreso general.
 */
export async function updateBanner(page, { flowName, step, flowIndex, flowsTotal }) {
    await page.evaluate(
        ({ flowName, step, flowIndex, flowsTotal }) => {
            const flowEl = document.querySelector('#grimox-qa-banner .gx-flow');
            const stepEl = document.querySelector('#grimox-qa-banner .gx-step');
            if (flowEl) flowEl.textContent = `Flow ${flowIndex}/${flowsTotal} — ${flowName}`;
            if (stepEl) stepEl.textContent = step;

            const bar = document.querySelector('#grimox-qa-progress .gx-bar');
            if (bar) {
                const pct = Math.round(((flowIndex - 1) / flowsTotal) * 100);
                bar.style.width = `${pct}%`;
            }
        },
        { flowName, step, flowIndex, flowsTotal }
    ).catch(() => {});
}

/**
 * Resalta visualmente un elemento antes de click/fill.
 * Agrega una clase temporal con outline + glow pulsing.
 */
export async function highlightElement(page, selector, durationMs = 600) {
    await page.evaluate(
        ({ selector, durationMs }) => {
            try {
                const el = document.querySelector(selector);
                if (!el) return;
                el.classList.add('grimox-qa-highlight');
                setTimeout(() => {
                    el.classList.remove('grimox-qa-highlight');
                }, durationMs);
            } catch {}
        },
        { selector, durationMs }
    ).catch(() => {});

    // Espera breve para que el usuario vea el resaltado antes del click real
    await page.waitForTimeout(Math.min(durationMs, 500));
}

/**
 * Flash final al terminar un flow: verde si pass, rojo si fail.
 */
export async function flashResult(page, status) {
    await page.evaluate(
        (status) => {
            const flash = document.getElementById('grimox-qa-flash');
            if (!flash) return;
            const icon = flash.querySelector('.gx-flash-icon');
            if (icon) icon.textContent = status === 'pass' ? '✓' : '✗';
            flash.className = status;
            setTimeout(() => { flash.className = ''; }, 800);
        },
        status
    ).catch(() => {});

    await page.waitForTimeout(900);
}

/**
 * Completa la progress bar al 100% al terminar todos los flows.
 */
export async function completeProgress(page) {
    await page.evaluate(() => {
        const bar = document.querySelector('#grimox-qa-progress .gx-bar');
        if (bar) bar.style.width = '100%';
    }).catch(() => {});
}

// ══════════════════════════════════════════════════════════════════════════
// DEV STUDIO — overlays permanentes (modo dev interactivo, siempre vivo)
// ══════════════════════════════════════════════════════════════════════════

const STUDIO_STYLES = `
#grimox-studio-banner {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 2147483647;
    padding: 8px 14px;
    background: linear-gradient(90deg, #6366f1, #a855f7, #ec4899, #06b6d4, #6366f1);
    background-size: 400% 100%;
    animation: gx-studio-shimmer 8s linear infinite;
    color: white;
    font: 500 12px/1.3 system-ui, -apple-system, 'Segoe UI', sans-serif;
    text-shadow: 0 1px 2px rgba(0,0,0,0.4);
    box-shadow: 0 2px 14px rgba(0,0,0,0.3);
    pointer-events: none;
    display: flex;
    align-items: center;
    gap: 10px;
    border-bottom: 1px solid rgba(255,255,255,0.2);
}

#grimox-studio-banner .gx-live {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    font-weight: 700;
    letter-spacing: 0.1em;
    font-size: 11px;
}

#grimox-studio-banner .gx-live::before {
    content: '';
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: #22c55e;
    box-shadow: 0 0 8px #22c55e;
    animation: gx-studio-heartbeat 1.8s ease-in-out infinite;
}

#grimox-studio-banner.activity .gx-live::before {
    background: #fbbf24;
    box-shadow: 0 0 10px #fbbf24;
    animation-duration: 0.5s;
}

#grimox-studio-banner.error .gx-live::before {
    background: #ef4444;
    box-shadow: 0 0 12px #ef4444;
    animation-duration: 0.4s;
}

#grimox-studio-banner .gx-sep {
    opacity: 0.5;
}

#grimox-studio-banner .gx-brand {
    font-weight: 800;
    letter-spacing: 0.02em;
}

#grimox-studio-banner .gx-route {
    font-family: 'SF Mono', Menlo, Consolas, monospace;
    font-size: 11px;
    background: rgba(0,0,0,0.25);
    padding: 2px 8px;
    border-radius: 4px;
    opacity: 0.95;
}

#grimox-studio-banner .gx-status {
    margin-left: auto;
    font-size: 11px;
    opacity: 0.85;
    display: flex;
    align-items: center;
    gap: 4px;
}

#grimox-studio-banner .gx-dots::after {
    content: '';
    display: inline-block;
    width: 10px;
    text-align: left;
    animation: gx-studio-dots 1.4s steps(4, end) infinite;
}

#grimox-studio-toast {
    position: fixed;
    top: 40px;
    right: 16px;
    z-index: 2147483646;
    padding: 10px 14px;
    background: rgba(0, 0, 0, 0.85);
    backdrop-filter: blur(8px);
    color: white;
    font: 500 12px system-ui, -apple-system, sans-serif;
    border-left: 3px solid #06b6d4;
    border-radius: 6px;
    box-shadow: 0 4px 20px rgba(0,0,0,0.4);
    pointer-events: none;
    visibility: hidden;
    opacity: 0;
    transform: translateX(20px);
    transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.2s ease, visibility 0s linear 0.25s;
    min-width: 240px;
    max-width: 300px;
}

#grimox-studio-toast.show {
    visibility: visible;
    opacity: 1;
    transform: translateX(0);
    transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.2s ease, visibility 0s linear 0s;
}

#grimox-studio-toast.success { border-left-color: #22c55e; }
#grimox-studio-toast.warn { border-left-color: #fbbf24; }
#grimox-studio-toast.error { border-left-color: #ef4444; }

#grimox-studio-toast .gx-toast-icon {
    display: inline-block;
    margin-right: 6px;
}

#grimox-studio-toast .gx-toast-path {
    font-family: 'SF Mono', Menlo, Consolas, monospace;
    font-size: 11px;
    opacity: 0.8;
    margin-top: 2px;
}

#grimox-studio-scanline {
    position: fixed;
    left: 0;
    right: 0;
    height: 2px;
    background: linear-gradient(90deg, transparent, rgba(6, 182, 212, 0.6), transparent);
    z-index: 2147483645;
    pointer-events: none;
    top: 30px;
    animation: gx-studio-scan 4s linear infinite;
    opacity: 0.5;
}

#grimox-studio-ambient-pulse {
    position: fixed;
    inset: 0;
    pointer-events: none;
    z-index: 2147483644;
    background: radial-gradient(ellipse at top, rgba(99, 102, 241, 0.08), transparent 60%);
    opacity: 0;
    transition: opacity 0.3s ease;
}

#grimox-studio-ambient-pulse.active {
    opacity: 1;
    animation: gx-studio-pulse 0.6s ease-out;
}

@keyframes gx-studio-shimmer {
    0% { background-position: 0% 50%; }
    100% { background-position: 400% 50%; }
}

@keyframes gx-studio-heartbeat {
    0%, 100% { transform: scale(1); opacity: 1; }
    50% { transform: scale(1.4); opacity: 0.7; }
}

@keyframes gx-studio-dots {
    0%, 20% { content: ''; }
    40% { content: '.'; }
    60% { content: '..'; }
    80%, 100% { content: '...'; }
}

@keyframes gx-studio-scan {
    0% { top: 30px; opacity: 0; }
    10% { opacity: 0.5; }
    90% { opacity: 0.5; }
    100% { top: 100vh; opacity: 0; }
}

@keyframes gx-studio-pulse {
    0% { opacity: 0; }
    50% { opacity: 1; }
    100% { opacity: 0; }
}
`;

/**
 * Inyecta los overlays persistentes del Dev Studio.
 * Llamar cada vez que el browser navega a una nueva página.
 */
export async function injectStudioOverlays(page, { route = '/', status = 'ready' } = {}) {
    await page.addStyleTag({ content: STUDIO_STYLES }).catch(() => {});

    await page.evaluate(
        ({ route, status }) => {
            if (document.getElementById('grimox-studio-banner')) return;

            const banner = document.createElement('div');
            banner.id = 'grimox-studio-banner';
            banner.innerHTML = `
                <span class="gx-live">LIVE</span>
                <span class="gx-sep">·</span>
                <span class="gx-brand">🧪 Grimox Dev Studio</span>
                <span class="gx-sep">·</span>
                <span class="gx-route">${route}</span>
                <span class="gx-status"><span class="gx-status-text">${status}</span><span class="gx-dots"></span></span>
            `;
            document.body.appendChild(banner);

            const toast = document.createElement('div');
            toast.id = 'grimox-studio-toast';
            toast.innerHTML = `
                <span class="gx-toast-icon"></span>
                <span class="gx-toast-text"></span>
                <div class="gx-toast-path"></div>
            `;
            document.body.appendChild(toast);

            const scan = document.createElement('div');
            scan.id = 'grimox-studio-scanline';
            document.body.appendChild(scan);

            const pulse = document.createElement('div');
            pulse.id = 'grimox-studio-ambient-pulse';
            document.body.appendChild(pulse);
        },
        { route, status }
    ).catch(() => {});
}

/**
 * Actualiza el banner con la ruta actual + estado.
 */
export async function updateStudioStatus(page, { route, status, mode }) {
    await page.evaluate(
        ({ route, status, mode }) => {
            const banner = document.getElementById('grimox-studio-banner');
            if (!banner) return;

            if (route !== undefined) {
                const routeEl = banner.querySelector('.gx-route');
                if (routeEl) routeEl.textContent = route;
            }

            if (status !== undefined) {
                const statusEl = banner.querySelector('.gx-status-text');
                if (statusEl) statusEl.textContent = status;
            }

            banner.classList.remove('activity', 'error');
            if (mode === 'activity') banner.classList.add('activity');
            if (mode === 'error') banner.classList.add('error');
        },
        { route, status, mode }
    ).catch(() => {});
}

/**
 * Muestra un toast temporal (aparece desde la derecha, se desvanece).
 * Tipo: 'info' | 'success' | 'warn' | 'error'
 */
export async function showStudioToast(page, { text, path, type = 'info', icon, durationMs = 2800 }) {
    await page.evaluate(
        ({ text, path, type, icon, durationMs }) => {
            const toast = document.getElementById('grimox-studio-toast');
            if (!toast) return;

            const defaultIcons = { info: '📝', success: '✓', warn: '⚠', error: '✗' };
            const useIcon = icon || defaultIcons[type] || '📝';

            toast.className = type;
            const iconEl = toast.querySelector('.gx-toast-icon');
            const textEl = toast.querySelector('.gx-toast-text');
            const pathEl = toast.querySelector('.gx-toast-path');
            if (iconEl) iconEl.textContent = useIcon;
            if (textEl) textEl.textContent = text || '';
            if (pathEl) pathEl.textContent = path || '';

            requestAnimationFrame(() => {
                toast.classList.add('show');
            });

            clearTimeout(toast.__gxTimer);
            toast.__gxTimer = setTimeout(() => {
                toast.classList.remove('show');
            }, durationMs);
        },
        { text, path, type, icon, durationMs }
    ).catch(() => {});
}

/**
 * Dispara el pulso ambient radial (para "notificar" un evento sin ser intrusivo).
 */
export async function pulseAmbient(page) {
    await page.evaluate(() => {
        const el = document.getElementById('grimox-studio-ambient-pulse');
        if (!el) return;
        el.classList.remove('active');
        void el.offsetWidth; // restart animation
        el.classList.add('active');
    }).catch(() => {});
}
