import { Hono } from 'hono';
import { serveStatic } from 'hono/bun';
import { basicAuth } from 'hono/basic-auth';

import { plausibleProxy } from './plausible';
import newsletter from './newsletter';

// Allow ctrl+c to shut down container
process.on('SIGINT', () => {
  process.exit();
});

const port = parseInt(process.env['PORT'] || '') || 3000;

const app = new Hono();

// dev auth
app.use(
  '/*',
  basicAuth({
    username: 'pruebas',
    password: 'magazine',
  })
)

// Redirect old WordPress post links
app.get(
  '/:year{[0-9]{4}}/:month{[0-9]{2}}/:day{[0-9]{2}}/:slug{.+\/?}',
  async (c) => {
    let slug = c.req.param('slug');

    // Note: Hugo uses pretty urls that end in a trailing slash,
    // so we always add it if not present.
    slug += slug.endsWith("/") ? "" : "/";

    return c.redirect(`/articulos/${slug}`, 301);
  },
);

// Serve hugo site
app.use('/*', serveStatic({ root: './public' }));

// Setup proxy for plausible.io
app.route('/proxyjs', plausibleProxy);

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
