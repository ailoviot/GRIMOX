import { Hono } from 'hono';
import { serve } from '@hono/node-server';

const app = new Hono();

app.get('/', (c) => {
    return c.json({ message: 'Welcome to your API' });
});

app.get('/api/health', (c) => {
    return c.json({ status: 'ok' });
});

console.log('Server running on http://localhost:3000');

serve({
    fetch: app.fetch,
    port: 3000,
});
