/**
 * Banner shown after `npm install` in Grimox projects.
 *
 * This message is seen by the LLM (and human) in the npm output. It acts as
 * an ultra-visible reminder of the project's rule #1: to start development,
 * use `npm run dev` and NEVER `npx next dev` or any other command that
 * bypasses Dev Studio.
 *
 * English-only by design: this banner is shown to any user on any machine
 * regardless of language preference, so it stays in English for universal
 * comprehension.
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
${MAGENTA}${BOLD}║${RESET}  ${CYAN}${BOLD}🧪 GRIMOX DEV STUDIO — INSTALLED${RESET}                              ${MAGENTA}${BOLD}║${RESET}
${MAGENTA}${BOLD}╠══════════════════════════════════════════════════════════════════╣${RESET}
${MAGENTA}${BOLD}║${RESET}                                                                  ${MAGENTA}${BOLD}║${RESET}
${MAGENTA}${BOLD}║${RESET}  ${GREEN}To START development:${RESET}      ${BOLD}npm run dev${RESET}                        ${MAGENTA}${BOLD}║${RESET}
${MAGENTA}${BOLD}║${RESET}  ${GREEN}With custom port:${RESET}          ${BOLD}npm run dev -- -p 3100${RESET}             ${MAGENTA}${BOLD}║${RESET}
${MAGENTA}${BOLD}║${RESET}                                                                  ${MAGENTA}${BOLD}║${RESET}
${MAGENTA}${BOLD}║${RESET}  ${YELLOW}⚠  NEVER use npx next dev, next dev, or vite directly${RESET}         ${MAGENTA}${BOLD}║${RESET}
${MAGENTA}${BOLD}║${RESET}  ${YELLOW}⚠  For a custom port: npm run dev -- -p XXXX${RESET}                  ${MAGENTA}${BOLD}║${RESET}
${MAGENTA}${BOLD}║${RESET}  ${YELLOW}⚠  ONLY npm run dev opens the visible browser${RESET}                ${MAGENTA}${BOLD}║${RESET}
${MAGENTA}${BOLD}║${RESET}                                                                  ${MAGENTA}${BOLD}║${RESET}
${MAGENTA}${BOLD}║${RESET}  ${DIM}When you run npm run dev:${RESET}                                     ${MAGENTA}${BOLD}║${RESET}
${MAGENTA}${BOLD}║${RESET}  ${DIM}  • framework dev server starts${RESET}                                ${MAGENTA}${BOLD}║${RESET}
${MAGENTA}${BOLD}║${RESET}  ${DIM}  • Chromium opens automatically (visible)${RESET}                     ${MAGENTA}${BOLD}║${RESET}
${MAGENTA}${BOLD}║${RESET}  ${DIM}  • animated overlays + file watcher activate${RESET}                  ${MAGENTA}${BOLD}║${RESET}
${MAGENTA}${BOLD}║${RESET}  ${DIM}  • you see everything in real time${RESET}                            ${MAGENTA}${BOLD}║${RESET}
${MAGENTA}${BOLD}║${RESET}                                                                  ${MAGENTA}${BOLD}║${RESET}
${MAGENTA}${BOLD}╚══════════════════════════════════════════════════════════════════╝${RESET}
`;
