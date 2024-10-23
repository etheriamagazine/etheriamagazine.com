import { Hono } from 'hono';
import { serveStatic } from 'hono/bun';
import newsletter from './newsletter';

/*
  allow ctrl+c to shut down container
*/
process.on('SIGINT', () => {
  process.exit();
});

const port = parseInt(process.env['PORT'] || '') || 3000;

const app = new Hono();

/*
  Serve hugo static site
*/
app.use('/*', serveStatic({ root: './public' }));

/*
  Plausible analytics proxying

  Example:
    eu-compliance/js/script.js -> plausible.io/js/script.js
*/
app.use('/eu-compliance/*', async (c) => {
  const path = c.req.path.replace('/eu-compliance', '');
  const url = new URL(path, 'http://plausible.io').toString();

  const resp = await fetch(url);

  // modify headers
  const headers = new Headers(resp.headers);
  headers.delete('content-encoding');
  headers.delete('content-length');

  return new Response(resp.body, {
    headers: headers,
  });
});

/* Backend functions */
app.route('/newsletter', newsletter);

/*
  Not found handler
  Returns 404.html custom error page
*/
app.notFound(async (c) => {
  const customNotFound = Bun.file('./public/404.html');
  return c.html(await customNotFound.text(), 404);
});

console.log(`Listening on http://localhost:${port}`);
console.log('Press Ctrl+C to stop');

export default {
  port,
  fetch: app.fetch,
};
