import { Hono } from 'hono';
import { getConnInfo } from 'hono/bun';

const app = new Hono();

app.use(async (c, next) => {
  await next();

  // as we are proxying responses from fetch() remove content-enconding header
  // as fetch will always automatically decode the responses.
  // See https://github.com/sveltejs/kit/issues/12197
  c.header('Content-Encoding', undefined);
});

// proxy script
app.get('/js/:script', (c) => {
  const script = c.req.param('script');
  return fetch(`https://plausible.io/js/${script}`);
});

// proxy event api
app.post('/api/event', async (c) => {
  const remoteAddress =
    c.req.header('Fly-Client-IP') ||
    c.req.header('CF-Connecting-IP') ||
    getConnInfo(c).remote.address;

  let headers: Record<string, string> = {
    'User-Agent': c.req.header('User-Agent') ?? '',
    'Content-Type': 'application/json',
  };

  if (remoteAddress) {
    headers = { ...headers, 'X-Forwarded-For': remoteAddress };
  }

  console.log(`[plausible event]: ${JSON.stringify(headers)}`);

  const req = new Request('https://plausible.io/api/event', {
    method: 'post',
    headers: headers,
    body: await c.req.text(),
  });

  return await fetch(req);
});

export { app as reverseProxyToPlausible };
