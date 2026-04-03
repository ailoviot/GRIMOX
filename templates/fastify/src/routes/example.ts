import { FastifyInstance } from 'fastify';

export async function exampleRoutes(app: FastifyInstance) {
    app.get('/example', async () => {
        return { data: 'This is an example endpoint' };
    });
}
