import {
    injectStudioOverlays,
    updateStudioStatus,
    showStudioToast,
    pulseAmbient,
    flashResult,
} from '../animations.js';

const STANDBY_HTML = `<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8">
<title>Grimox Dev Studio · Standby</title>
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  html, body { overflow-x: hidden; }
  body {
    min-height: 100vh;
    background: linear-gradient(135deg, #0f0820 0%, #1a0a2e 50%, #0f0820 100%);
    color: #e7e3ff;
    font-family: system-ui, -apple-system, 'Segoe UI', sans-serif;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 40px 20px;
    padding-top: 80px;
  }
  .hero {
    max-width: 700px;
    text-align: center;
    animation: fadeIn 0.8s ease-out;
  }
  .logo {
    font-size: 80px;
    margin-bottom: 20px;
    animation: float 3s ease-in-out infinite;
  }
  h1 {
    font-size: 48px;
    font-weight: 800;
    letter-spacing: -0.02em;
    margin-bottom: 16px;
    background: linear-gradient(90deg, #06b6d4, #a855f7, #ec4899);
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent;
  }
  p.sub {
    font-size: 18px;
    color: #a99ac8;
    margin-bottom: 40px;
    line-height: 1.6;
  }
  .card {
    background: rgba(255,255,255,0.04);
    border: 1px solid rgba(168, 85, 247, 0.3);
    border-radius: 16px;
    padding: 32px;
    backdrop-filter: blur(10px);
    margin-bottom: 20px;
  }
  .hint {
    font-family: 'SF Mono', Menlo, Consolas, monospace;
    background: rgba(6, 182, 212, 0.15);
    color: #67e8f9;
    padding: 12px 20px;
    border-radius: 8px;
    display: inline-block;
    margin-top: 8px;
    font-size: 15px;
  }
  .dots {
    display: inline-flex;
    gap: 4px;
    margin-top: 24px;
  }
  .dots span {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: #a855f7;
    animation: pulse 1.4s ease-in-out infinite;
  }
  .dots span:nth-child(2) { animation-delay: 0.2s; }
  .dots span:nth-child(3) { animation-delay: 0.4s; }
  @keyframes float {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-10px); }
  }
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }
  @keyframes pulse {
    0%, 100% { opacity: 0.3; transform: scale(0.8); }
    50% { opacity: 1; transform: scale(1.2); }
  }
</style>
</head>
<body>
<div class="hero">
  <div class="logo">🧪</div>
  <h1>Grimox Dev Studio</h1>
  <p class="sub">El daemon está vivo. Esperando a que arranques el dev server…</p>
  <div class="card">
    <p style="color:#c9c0e0">Cuando ejecutes:</p>
    <div class="hint">npm run dev</div>
    <p style="margin-top:20px;color:#a99ac8;font-size:14px">
      Navegaré automáticamente a tu app con animaciones en tiempo real
    </p>
    <div class="dots"><span></span><span></span><span></span></div>
  </div>
</div>
</body>
</html>`;

/**
 * Administra un browser Chromium visible persistente durante la vida del daemon.
 * Se encarga de:
 *   - Lanzar con CDP port para que otros procesos (grimox-qa postbuild) puedan
 *     conectarse al mismo browser
 *   - Navegar a la URL cuando el port poller detecta dev server
 *   - Inyectar overlays y reaccionar a eventos del file watcher
 *   - Cerrar limpio al apagar el daemon
 */
export class BrowserManager {
    constructor() {
        this.browser = null;
        this.page = null;
        this.cdpPort = null;
        this.baseUrl = null;
        this.takenOver = false; // true cuando grimox-qa postbuild está ejecutando
    }

    /**
     * Lanza browser apuntando a baseUrl + inyecta overlays.
     * Idempotente: si ya hay uno, solo navega.
     */
    async ensure(baseUrl) {
        const { chromium } = await import('playwright');

        if (this.browser && !this._isClosed()) {
            if (baseUrl && baseUrl !== this.baseUrl && this.page && !this.takenOver) {
                await this.navigate(baseUrl);
            }
            return;
        }

        this.cdpPort = 9222 + Math.floor(Math.random() * 1000);
        this.browser = await chromium.launch({
            headless: false,
            args: [
                `--remote-debugging-port=${this.cdpPort}`,
                '--disable-blink-features=AutomationControlled',
                '--no-default-browser-check',
                '--start-maximized',
            ],
        });

        const context = await this.browser.newContext({
            viewport: null,
            ignoreHTTPSErrors: true,
        });

        this.page = await context.newPage();
        this.baseUrl = baseUrl;

        try {
            await this.page.goto(baseUrl, { waitUntil: 'domcontentloaded', timeout: 15000 });
        } catch {}

        await injectStudioOverlays(this.page, { route: '/', status: 'listo' });
        this._registerPageHandlers();
    }

    /**
     * Registra los handlers que hacen el browser "persistentemente Grimox Studio":
     *   - Re-inyecta overlays tras cada navegación (previene "degradación" cuando el
     *     usuario/LLM navega, o tras client-side navigation del framework).
     *   - Captura errores de runtime y los muestra como toast en el propio browser.
     * Llamar una vez por page. Idempotente gracias a `_handlersRegistered`.
     */
    _registerPageHandlers() {
        if (!this.page || this._handlersRegistered) return;
        this._handlersRegistered = true;

        this.page.on('framenavigated', async (frame) => {
            if (frame !== this.page.mainFrame()) return;
            if (this.takenOver) return;
            try {
                const url = new URL(frame.url());
                // Inject es idempotente (skip si ya existe). Tras navegar desde
                // standby (/standby) a la app real, el banner ya existe pero con
                // el route viejo — updateStudioStatus lo refresca.
                await injectStudioOverlays(this.page, { route: url.pathname, status: 'listo' });
                await updateStudioStatus(this.page, { route: url.pathname, status: 'listo', mode: null });
            } catch {}
        });

        this.page.on('pageerror', async (err) => {
            if (this.takenOver) return;
            await updateStudioStatus(this.page, { status: 'error', mode: 'error' }).catch(() => {});
            await showStudioToast(this.page, {
                text: 'Error en runtime',
                path: err.message.slice(0, 80),
                type: 'error',
                durationMs: 4000,
            }).catch(() => {});
        });
    }

    /**
     * Abre browser en modo STANDBY — página local con overlays activos, sin esperar
     * dev server. Útil para:
     *   - Test mínimo: confirmar que el mecanismo de browser + overlays funciona
     *   - UX: el usuario ve el browser inmediatamente al arrancar el daemon,
     *     aunque todavía no haya dev server
     */
    async openStandby() {
        const { chromium } = await import('playwright');

        if (this.browser && !this._isClosed()) return;

        this.cdpPort = 9222 + Math.floor(Math.random() * 1000);
        this.browser = await chromium.launch({
            headless: false,
            args: [
                `--remote-debugging-port=${this.cdpPort}`,
                '--disable-blink-features=AutomationControlled',
                '--no-default-browser-check',
                '--start-maximized',
            ],
        });

        // viewport: null → la página ocupa el 100% de la ventana, incluso maximizada.
        const context = await this.browser.newContext({
            viewport: null,
            ignoreHTTPSErrors: true,
        });

        this.page = await context.newPage();
        this.baseUrl = null;

        await this.page.setContent(STANDBY_HTML);
        await injectStudioOverlays(this.page, { route: '/standby', status: 'esperando dev server' });

        this._registerPageHandlers();
    }

    _isClosed() {
        try {
            return !this.browser || !this.browser.isConnected();
        } catch {
            return true;
        }
    }

    async navigate(url) {
        if (!this.page || this.takenOver) return;
        try {
            await this.page.goto(url, { waitUntil: 'domcontentloaded', timeout: 10000 });
        } catch {}
    }

    /**
     * Reacción a eventos del file watcher: muestra toast + auto-navigate si aplica.
     */
    async onFileEvents(events, { baseUrl } = {}) {
        if (!this.page || this.takenOver || this._isClosed()) return;

        // Toast con el primer cambio
        const main = events.find((e) => e.type === 'change') || events[0];
        if (main) {
            await showStudioToast(this.page, {
                text: main.type === 'add' ? 'Archivo nuevo' : main.type === 'unlink' ? 'Archivo eliminado' : 'Archivo modificado',
                path: main.path,
                type: main.type === 'add' ? 'success' : 'info',
                durationMs: 2500,
            }).catch(() => {});
            await pulseAmbient(this.page).catch(() => {});
        }

        await updateStudioStatus(this.page, { status: 'compiling', mode: 'activity' }).catch(() => {});

        // Auto-navigate si algún archivo mapea a una ruta concreta y NO estamos ya ahí
        const target = events.find((e) => e.route && e.type !== 'unlink');
        if (target && baseUrl) {
            const current = (() => {
                try { return new URL(this.page.url()).pathname; } catch { return null; }
            })();
            if (target.route !== current) {
                try {
                    await this.page.waitForTimeout(600); // pequeño respiro para HMR
                    await this.navigate(`${baseUrl}${target.route}`);
                } catch {}
            }
        }

        // Tras el cambio, restaurar status a listo + flash verde sutil
        await this.page.waitForTimeout(800).catch(() => {});
        await flashResult(this.page, 'pass').catch(() => {});
        await updateStudioStatus(this.page, { status: 'listo', mode: null }).catch(() => {});
    }

    getCdpInfo() {
        if (!this.browser || this._isClosed()) return null;
        // Retornamos el endpoint HTTP del CDP (Chrome DevTools Protocol).
        // Playwright's `browser.wsEndpoint()` solo funciona con launchServer(),
        // no con launch(). Para connectOverCDP, pasamos la URL HTTP y Playwright
        // resuelve internamente el WS endpoint correcto.
        return {
            port: this.cdpPort,
            endpoint: `http://localhost:${this.cdpPort}`,
            baseUrl: this.baseUrl,
        };
    }

    /**
     * Marca takeover: grimox-qa postbuild va a tomar control.
     * El daemon deja de inyectar overlays para no interferir con los flows QA.
     */
    setTakenOver(value) {
        this.takenOver = value;
    }

    async close() {
        if (this.browser) {
            try { await this.browser.close(); } catch {}
            this.browser = null;
            this.page = null;
        }
    }
}
