import { Hono } from 'hono';
import { serveStatic } from 'hono/bun';

import { CACHEABLE_MIME_TYPES } from './consts';

import flyDevRedirect from './flyDevRedirect';
import wordpressRedirect from './wordpressRedirect';
import newsletter from './newsletter';
import plausibleProxy from './plausible';


// Allow ctrl+c to shut down container
process.on('SIGINT', () => {
  process.exit();
});

const port = parseInt(process.env['PORT'] || '') || 3000;

const app = new Hono();

// Redirect fly.dev domain to canonical domain
app.use(flyDevRedirect);

// Redirect old url wordpress urls and make Google happy
app.route('/', wordpressRedirect);

// Serve hugo site
app.use(
  '/*',
  serveStatic({
    root: './public',

    // Add cache policy for resources
    onFound: (path, c) => {
      let file = Bun.file(path);
      let mimeType = file.type.split(';')[0]; // exclude ...;charset=utf-8

      if (CACHEABLE_MIME_TYPES.includes(mimeType)) {
        // one year
        c.header('Cache-Control', `public, immutable, max-age=31536000`);
      }
    },
  }),
);

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
