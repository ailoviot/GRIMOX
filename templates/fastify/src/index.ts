import Fastify from 'fastify';
import { exampleRoutes } from './routes/example.js';

const app = Fastify({ logger: true });

app.get('/', async () => {
    return { message: 'Welcome to your API' };
});

app.get('/health', async () => {
    return { status: 'ok' };
});

app.register(exampleRoutes, { prefix: '/api' });

const start = async () => {
    try {
        await app.listen({ port: 3000, host: '0.0.0.0' });
    } catch (err) {
        app.log.error(err);
        process.exit(1);
    }
};

start();
