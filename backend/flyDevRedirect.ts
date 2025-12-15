import { createMiddleware } from 'hono/factory'

// redirect if user a
export default createMiddleware(async (c, next) => {

  const reqUrl = new URL(c.req.url);

  if(reqUrl.host.endsWith("fly.dev")) {

    const redirectLocation = new URL(c.req.url);
    redirectLocation.host = "etheriamagazine.com";
    redirectLocation.port = "";
    redirectLocation.protocol = "https:";

    return c.redirect(redirectLocation.href, 301)
  }
  await next()
})
