import { createMailchimp } from './mailchimp/mailchimp';
import { NewsletterFormSchema, parse } from './schemas';
import { ValidationError } from './errors';
import { readRequestData, errorResponse, success } from './http';
// import { env, getRuntimeKey } from 'hono/adapter';

// // https://developers.cloudflare.com/pages/how-to/refactor-a-worker-to-pages-functions/
// export async function onRequestPost({ request, env }) {

// }

// newsletter.ts
import { Hono } from 'hono';
import { env } from 'hono/adapter';

const app = new Hono();

app.post('/', async (c) =>  {
    try {
        const input = parse(NewsletterFormSchema, await readRequestData(c.req));
        let { MAILCHIMP_DC, MAILCHIMP_APIKEY, MAILCHIMP_DEFAULT_LIST_ID } =
            env<{
                MAILCHIMP_DC: string;
                MAILCHIMP_APIKEY: string;
                MAILCHIMP_DEFAULT_LIST_ID: string;
            }>(c);
            console.log({ MAILCHIMP_DC, MAILCHIMP_APIKEY, MAILCHIMP_DEFAULT_LIST_ID } );

        const mailchimp = createMailchimp(MAILCHIMP_DC, MAILCHIMP_APIKEY);

        const list_id = MAILCHIMP_DEFAULT_LIST_ID;
        const result = await mailchimp.lists.setListMember(list_id, {
            email_address: input.email_address,
            status: 'subscribed',
            status_if_new: 'subscribed',
        });

        const { email_address, status, unique_email_id } = result;
        const { name: list_name, subscribe_url_long } =
            await mailchimp.lists.getList(list_id);

        function getUnsubscribeUrl() {
            return (
                subscribe_url_long.replace('subscribe', 'unsubscribe') +
                `&e=${unique_email_id}`
            );
        }

        return success({
            email_address,
            status,
            list_id,
            list_name,
            unsubscribe_url: getUnsubscribeUrl(),
        });
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
