import { join } from 'node:path';
import { writeFileSafe } from '../utils/fs-helpers.js';

/**
 * Inyecta configuración de UI/UX (Tailwind, component library)
 * Nota: La instalación real de dependencias ocurre con el template.
 * Este injector genera los archivos de configuración.
 */
export async function inject(projectPath, config) {
    const stackEntry = config.isDecoupled
        ? config.frontend?.stackEntry
        : config.stackEntry;

    if (!stackEntry?.autoUI) return;

    // Tailwind CSS v4 config (si el stack usa Tailwind)
    if (stackEntry.autoUI.includes('Tailwind')) {
        await injectTailwindConfig(projectPath, config);
    }
}

async function injectTailwindConfig(projectPath, config) {
    // Tailwind v4 usa CSS-first config
    const cssContent = `@import "tailwindcss";

/* ============================================
   Design System Base - Grimox CLI
   ============================================ */

@theme {
    /* Brand Colors */
    --color-brand-50: #f0f4ff;
    --color-brand-100: #dbe4ff;
    --color-brand-200: #bac8ff;
    --color-brand-300: #91a7ff;
    --color-brand-400: #748ffc;
    --color-brand-500: #5c7cfa;
    --color-brand-600: #4c6ef5;
    --color-brand-700: #4263eb;
    --color-brand-800: #3b5bdb;
    --color-brand-900: #364fc7;

    /* Neutral */
    --color-neutral-50: #f8f9fa;
    --color-neutral-100: #f1f3f5;
    --color-neutral-200: #e9ecef;
    --color-neutral-300: #dee2e6;
    --color-neutral-400: #ced4da;
    --color-neutral-500: #adb5bd;
    --color-neutral-600: #868e96;
    --color-neutral-700: #495057;
    --color-neutral-800: #343a40;
    --color-neutral-900: #212529;

    /* Fonts */
    --font-sans: 'Inter', system-ui, -apple-system, sans-serif;
    --font-mono: 'JetBrains Mono', 'Fira Code', monospace;

    /* Border Radius */
    --radius-sm: 0.375rem;
    --radius-md: 0.5rem;
    --radius-lg: 0.75rem;
    --radius-xl: 1rem;
}

/* Dark Mode */
@media (prefers-color-scheme: dark) {
    :root {
        color-scheme: dark;
    }
}
`;

    await writeFileSafe(join(projectPath, 'src', 'styles', 'globals.css'), cssContent);
}
