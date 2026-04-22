/**
 * Banner mostrado tras `npm install` en proyectos Grimox.
 *
 * Este mensaje lo ve el LLM (y el humano) en el output de npm. Sirve como
 * recordatorio ultra-visible de la regla #1 del proyecto: para arrancar
 * desarrollo, usar `npm run dev` y NUNCA `npx next dev` u otro comando que
 * salte el Dev Studio.
 */

const RESET = '\x1b[0m';
const BOLD = '\x1b[1m';
const DIM = '\x1b[2m';
const CYAN = '\x1b[36m';
const MAGENTA = '\x1b[35m';
const YELLOW = '\x1b[33m';
const GREEN = '\x1b[32m';

export default `
${MAGENTA}${BOLD}╔══════════════════════════════════════════════════════════════════╗${RESET}
${MAGENTA}${BOLD}║${RESET}  ${CYAN}${BOLD}🧪 GRIMOX DEV STUDIO — INSTALADO${RESET}                              ${MAGENTA}${BOLD}║${RESET}
${MAGENTA}${BOLD}╠══════════════════════════════════════════════════════════════════╣${RESET}
${MAGENTA}${BOLD}║${RESET}                                                                  ${MAGENTA}${BOLD}║${RESET}
${MAGENTA}${BOLD}║${RESET}  ${GREEN}Para ARRANCAR desarrollo:${RESET}  ${BOLD}npm run dev${RESET}                        ${MAGENTA}${BOLD}║${RESET}
${MAGENTA}${BOLD}║${RESET}  ${GREEN}Con puerto custom:${RESET}         ${BOLD}npm run dev -- -p 3100${RESET}             ${MAGENTA}${BOLD}║${RESET}
${MAGENTA}${BOLD}║${RESET}                                                                  ${MAGENTA}${BOLD}║${RESET}
${MAGENTA}${BOLD}║${RESET}  ${YELLOW}⚠  NUNCA uses npx next dev, next dev, vite directamente${RESET}       ${MAGENTA}${BOLD}║${RESET}
${MAGENTA}${BOLD}║${RESET}  ${YELLOW}⚠  Para puerto custom: npm run dev -- -p XXXX${RESET}                 ${MAGENTA}${BOLD}║${RESET}
${MAGENTA}${BOLD}║${RESET}  ${YELLOW}⚠  SOLO npm run dev abre el browser visible${RESET}                   ${MAGENTA}${BOLD}║${RESET}
${MAGENTA}${BOLD}║${RESET}                                                                  ${MAGENTA}${BOLD}║${RESET}
${MAGENTA}${BOLD}║${RESET}  ${DIM}Cuando arranques npm run dev:${RESET}                                 ${MAGENTA}${BOLD}║${RESET}
${MAGENTA}${BOLD}║${RESET}  ${DIM}  • dev server del framework inicia${RESET}                            ${MAGENTA}${BOLD}║${RESET}
${MAGENTA}${BOLD}║${RESET}  ${DIM}  • Chromium se abre automáticamente (visible)${RESET}                 ${MAGENTA}${BOLD}║${RESET}
${MAGENTA}${BOLD}║${RESET}  ${DIM}  • overlays animados + file watcher se activan${RESET}                ${MAGENTA}${BOLD}║${RESET}
${MAGENTA}${BOLD}║${RESET}  ${DIM}  • el usuario ve todo en tiempo real${RESET}                          ${MAGENTA}${BOLD}║${RESET}
${MAGENTA}${BOLD}║${RESET}                                                                  ${MAGENTA}${BOLD}║${RESET}
${MAGENTA}${BOLD}╚══════════════════════════════════════════════════════════════════╝${RESET}
`;
