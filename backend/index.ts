import { Hono } from 'hono';
import { serveStatic } from 'hono/bun';
import { reverseProxyToPlausible } from './plausible';
import newsletter from './newsletter';

// allow ctrl+c to shut down container
process.on('SIGINT', () => {
  process.exit();
});

const port = parseInt(process.env['PORT'] || '') || 3000;

const app = new Hono();

// Serve hugo site
app.use('/*', serveStatic({ root: './public' }));

// Setup proxy for plausible.io
app.route('/eu-compliance', reverseProxyToPlausible);

// Backend functions
app.route('/newsletter', newsletter);

// Return hugo's 404.html on not found
app.notFound(async (c) => {
  const errorPage = Bun.file('./public/404.html');
  return c.html(await errorPage.text(), 404);
});

console.log(`Listening on http://localhost:${port}`);
console.log('Press Ctrl+C to stop');

export default {
  port,
  fetch: app.fetch,
};
