/**
 * Frameworks y enfoques de estilos CSS disponibles.
 * Se muestran al usuario en creación y migración (cuando aplica).
 */
export const styles = [
    {
        id: 'tailwind',
        name: 'Tailwind CSS v4',
        description: 'Utility-first CSS framework — el más popular para desarrollo moderno',
        packages: {
            node: 'tailwindcss',
            python: null,
        },
    },
    {
        id: 'bootstrap',
        name: 'Bootstrap 5',
        description: 'Framework CSS con componentes prediseñados — amplia documentación',
        packages: {
            node: 'bootstrap',
        },
    },
    {
        id: 'material',
        name: 'Material UI / Material Design',
        description: 'Sistema de diseño de Google — ideal para apps empresariales',
        packages: {
            node: '@mui/material', // React
            angular: '@angular/material',
        },
    },
    {
        id: 'bulma',
        name: 'Bulma',
        description: 'Framework CSS moderno basado en Flexbox — sin JavaScript',
        packages: {
            node: 'bulma',
        },
    },
    {
        id: 'sass',
        name: 'Sass / SCSS puro',
        description: 'Preprocesador CSS — ideal para estilos corporativos personalizados',
        packages: {
            node: 'sass',
        },
    },
    {
        id: 'css-pure',
        name: 'CSS puro (custom / corporativo)',
        description: 'Sin framework — CSS vanilla para estilos 100% propios o corporativos',
        packages: {},
    },
    {
        id: 'styled-components',
        name: 'Styled Components (CSS-in-JS)',
        description: 'Estilos dentro de los componentes — solo para React/JS',
        packages: {
            node: 'styled-components',
        },
    },
];

/**
 * Filtra estilos compatibles con un stack
 * @param {string} categoryId
 * @returns {object[]}
 */
export function getCompatibleStyles(categoryId) {
    // IoT, CLI, Data/IA no necesitan estilos CSS
    const noStyleCategories = ['iot-embedded', 'cli-tools', 'data-ai'];
    if (noStyleCategories.includes(categoryId)) return [];

    // Documentación — solo algunos
    if (categoryId === 'documentation') {
        return styles.filter((s) => ['tailwind', 'css-pure', 'sass'].includes(s.id));
    }

    // Mobile — solo algunos
    if (categoryId === 'mobile') {
        return styles.filter((s) => ['tailwind', 'css-pure', 'material'].includes(s.id));
    }

    // Web y Desktop — todos
    return styles;
}

/**
 * Busca un estilo por ID
 */
export function findStyleById(styleId) {
    return styles.find((s) => s.id === styleId) || null;
}
