import { relative } from 'node:path';
import { mapFileToRoute } from '../dev-studio-utils.js';

/**
 * Observa cambios en src/, app/, pages/, etc. Debounce para batch writes.
 * Cuando detecta un cambio que mapea a una ruta, notifica al browser manager
 * para que pueda reaccionar visualmente (toast, auto-navigate, pulse).
 */
export class FileWatcher {
    constructor({ chokidar, cwd, onChange, debounceMs = 500 } = {}) {
        this.chokidar = chokidar;
        this.cwd = cwd;
        this.onChange = onChange;
        this.debounceMs = debounceMs;
        this.watcher = null;
        this.debounceTimer = null;
        this.pending = [];
    }

    start() {
        if (this.watcher) return;

        const paths = ['src', 'app', 'pages', 'components', 'lib', 'styles', 'composables'];
        const toWatch = paths.map((p) => `${this.cwd}/${p}`);

        this.watcher = this.chokidar.watch(toWatch, {
            ignored: /(^|[\/\\])(node_modules|\.next|\.nuxt|\.output|\.svelte-kit|dist|build|\.git|\.grimox|\.vendor)[\/\\]/,
            ignoreInitial: true,
            persistent: true,
            awaitWriteFinish: {
                stabilityThreshold: 200,
                pollInterval: 100,
            },
        });

        this.watcher.on('change', (p) => this._enqueue('change', p));
        this.watcher.on('add', (p) => this._enqueue('add', p));
        this.watcher.on('unlink', (p) => this._enqueue('unlink', p));
    }

    _enqueue(type, fullPath) {
        const rel = relative(this.cwd, fullPath).replace(/\\/g, '/');
        this.pending.push({ type, path: rel, route: mapFileToRoute(rel) });

        clearTimeout(this.debounceTimer);
        this.debounceTimer = setTimeout(() => this._flush(), this.debounceMs);
    }

    async _flush() {
        if (this.pending.length === 0) return;
        const events = this.pending.splice(0);

        if (this.onChange) {
            try { await this.onChange(events); } catch {}
        }
    }

    async stop() {
        clearTimeout(this.debounceTimer);
        if (this.watcher) {
            try { await this.watcher.close(); } catch {}
        }
        this.watcher = null;
    }
}
