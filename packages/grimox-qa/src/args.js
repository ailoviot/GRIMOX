/**
 * Parser simple de argumentos CLI para grimox-qa.
 * No usa commander para mantener deps mínimas.
 */
export function parseArgs(argv) {
    const args = {
        url: null,
        plan: '.grimox/qa-plan.yml',
        headed: null, // null = auto-detectar
        retries: 2,
        timeout: 10000,
        autoClose: true,
        autoDiscover: null, // null = usar plan; true/false fuerza
        evidence: '.grimox/qa-evidence',
        animations: null, // full | minimal | off (null = auto: full en headed, off en headless)
        dynamic: false, // si true: intenta reusar browser del daemon via CDP
        autoServer: false, // si true: arranca production server temporal si baseUrl no responde
        autoServerPort: 3100, // puerto del production server temporal
        autoServerCmd: null, // comando para arrancar (ej: "npm run start"); null = auto-detect
        reset: false,
        help: false,
        version: false,
    };

    for (let i = 0; i < argv.length; i++) {
        const raw = argv[i];
        // Soporta --flag=valor además de --flag valor
        let a = raw;
        let inlineValue = null;
        const eqIdx = raw.indexOf('=');
        if (raw.startsWith('--') && eqIdx > 2) {
            a = raw.slice(0, eqIdx);
            inlineValue = raw.slice(eqIdx + 1);
        }
        const next = () => (inlineValue !== null ? inlineValue : argv[++i]);

        switch (a) {
            case '--url': args.url = next(); break;
            case '--plan': args.plan = next(); break;
            case '--headed': args.headed = true; break;
            case '--headless': args.headed = false; break;
            case '--retries': args.retries = Number(next()); break;
            case '--timeout': args.timeout = Number(next()); break;
            case '--no-auto-close': args.autoClose = false; break;
            case '--auto-discover': args.autoDiscover = true; break;
            case '--no-auto-discover': args.autoDiscover = false; break;
            case '--evidence': args.evidence = next(); break;
            case '--animations': {
                const v = next();
                if (!['full', 'minimal', 'off'].includes(v)) {
                    console.error(`--animations debe ser full|minimal|off (recibido: ${v})`);
                    process.exit(1);
                }
                args.animations = v;
                break;
            }
            case '--dynamic': args.dynamic = true; break;
            case '--auto-server': args.autoServer = true; break;
            case '--auto-server-port': args.autoServerPort = Number(next()); break;
            case '--auto-server-cmd': args.autoServerCmd = next(); break;
            case '--reset': args.reset = true; break;
            case '--help':
            case '-h': args.help = true; break;
            case '--version':
            case '-v': args.version = true; break;
            default:
                if (a.startsWith('--')) {
                    console.error(`Opción desconocida: ${a} (usa --help)`);
                    process.exit(1);
                }
        }
    }

    return args;
}
