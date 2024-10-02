import { Hono } from 'hono';
import { serveStatic } from 'hono/bun';
import newsletter from './newsletter';


// allow ctrl+c to shut down container
process.on("SIGINT", () => {
  process.exit();
});

const port = parseInt(process.env['PORT'] || '') || 3000;

const app = new Hono();
app.use('/*', serveStatic({ root: './public' }));
app.route('/newsletter', newsletter);

console.log(`Listening on http://localhost:${port}`);
console.log('Press Ctrl+C to stop');

export default {
    port,
    fetch: app.fetch,
};
