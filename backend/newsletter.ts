import { createMailchimpClient } from './mailchimp/mailchimp';
import { NewsletterFormSchema, parse } from './schemas';
import { ValidationError } from './errors';
import { readRequestData, errorResponse, success } from './http';

import { Hono } from 'hono';
import { env } from 'hono/adapter';
import { getConnInfo } from 'hono/bun';

const app = new Hono();

app.post('/', async (c) => {
  try {
    // read posted data
    const input = parse(NewsletterFormSchema, await readRequestData(c.req));

    // read config from env
    const config = env<{
      MAILCHIMP_DC: string;
      MAILCHIMP_APIKEY: string;
      MAILCHIMP_LIST_ID: string;
    }>(c);

    // create client
    const mailchimp = createMailchimpClient(
      config.MAILCHIMP_DC,
      config.MAILCHIMP_APIKEY,
    );

    // get users remote ip
    const {
      remote: { address: remote_ip_address },
    } = getConnInfo(c);

    // try to subscribe
    const { email_address, status, unique_email_id } =
      await mailchimp.lists.setListMember(config.MAILCHIMP_LIST_ID, {
        email_address: input.email_address,
        status: 'subscribed',
        status_if_new: 'subscribed',
        ip_signup: remote_ip_address,
      });

    // try to get unsubscribe url
    const unsubscribe_url = await getUnsubscribeUrl(unique_email_id);

    return success({
      email_address,
      status,
      unsubscribe_url,
    });

    async function getUnsubscribeUrl(unique_email_id: string) {
      // get the subscribe url
      const { subscribe_url_long } = await mailchimp.lists.getList(
        config.MAILCHIMP_LIST_ID,
      );

      // rewrite to make an unsubscribe url
      return (
        subscribe_url_long.replace('subscribe', 'unsubscribe') +
        `&e=${unique_email_id}`
      );
    }
  } catch (err) {
    console.log(err);

    let error = err as Error;

    if (error instanceof SyntaxError || error instanceof ValidationError) {
      return await errorResponse(error, { status: 400 });
    }

    return await errorResponse(error);
  }
});

export default app;
