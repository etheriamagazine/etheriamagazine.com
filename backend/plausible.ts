import { Hono } from 'hono';
import { getConnInfo } from 'hono/bun';

const app = new Hono();

/*
  Middelware to remove Content-Enconding header. As fetch() api decodes the
  content automatically and responses are proxied back downstream, remove the
  content encoding header and let the hosting platform like Cloudflare, Fly.io and
  others re-encode as they see fit.

  See https://github.com/sveltejs/kit/issues/12197
*/
app.use(async (c, next) => {
  await next();
  c.header('Content-Encoding', undefined);
});

/*
  proxy Plausible's tracking script
*/
app.get('/js/:script', (c) => {
  const script = c.req.param('script');
  return fetch(`https://plausible.io/js/${script}`);
});

/*
  proxy requests to event api
*/
app.post('/api/event', async (c) => {
  // See https://plausible.io/docs/events-api#request-headers
  // for required headers to send
  let headers: Record<string, string> = {
    'User-Agent': c.req.header('User-Agent') ?? '',
    'Content-Type': 'application/json',
  };

  // retrieve remote address from hosting HTTP headers or bun's getConnInfo helper
  const remoteAddress =
    c.req.header('Fly-Client-IP') ||
    c.req.header('CF-Connecting-IP') ||
    getConnInfo(c).remote.address;

  if (remoteAddress) {
    headers = { ...headers, 'X-Forwarded-For': remoteAddress };
  }

  const req = new Request('https://plausible.io/api/event', {
    method: 'post',
    headers: headers,
    body: await c.req.text(),
  });

  return fetch(req);
});

export default app;
