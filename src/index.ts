import { Hono } from 'hono';
import { serveStatic } from 'hono/bun';
import newsletter from './newsletter';

const port = parseInt(process.env['PORT'] || '') || 3000;

const app = new Hono();

app.use('/*', serveStatic({ root: './public' }));

app.route('/newsletter', newsletter);

export default {
    port,
    fetch: app.fetch,
};
