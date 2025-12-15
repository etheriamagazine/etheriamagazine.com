import { Hono } from 'hono';

const app = new Hono();

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

// Redirect author
app.get(
  '/author/:slug{.+\/?}',
  async (c) => {
    let slug = c.req.param('slug');

    // Note: Hugo uses pretty urls that end in a trailing slash,
    // so we always add it if not present.
    slug += slug.endsWith("/") ? "" : "/";

    return c.redirect(`/autoras/${slug}`, 301);
  },
);

export default app;
