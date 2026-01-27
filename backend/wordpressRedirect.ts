import { Hono } from 'hono';
import wordpressPosts from './wordpressPosts.json';

// make Typescript happy
type WordpressPosts = typeof wordpressPosts;
type PostKey = keyof WordpressPosts | undefined;

const app = new Hono();

// Redirect old WordPress link structure
// => https://etheriamagazine.com/2024/08/08/escapada-con-amigas-a-lisboa-y-ericeira-portugal-surf
app.get(
  '/:year{[0-9]{4}}/:month{[0-9]{2}}/:day{[0-9]{2}}/:slug{.+\/?}',
  async (c) => {
    let slug = c.req.param('slug');
    slug += slug.endsWith('/') ? '' : '/'; // add trailing slash for Hugo pretty urls
    return c.redirect(`/articulos/${slug}`, 301);
  },
);

// Redirect non-canonical WordPress links
// => https://etheriamagazine.com/?p=67617
app.get('/', async (c, next) => {
  const p = c.req.query('p') as PostKey;

  if (p && p in wordpressPosts) {
    let slug = wordpressPosts[p].slug;
    slug += slug.endsWith('/') ? '' : '/'; // add trailing slash for Hugo pretty urls
    return c.redirect(`/articulos/${slug}`, 301);
  }
  return await next();
});

// Redirect author route to autoras
app.get('/author/:slug{.+\/?}', async (c) => {
  let slug = c.req.param('slug');
  slug += slug.endsWith('/') ? '' : '/';
  return c.redirect(`/autoras/${slug}`, 301);
});

export default app;
