import { createMailchimpClient } from "../mailchimp";
import { envReader } from "../config";
import { NewsletterFormSchema, parse } from "../schemas";
import { ResponseError, ValidationError } from "../errors";
import { readRequestData, errorResponse, success } from "../http";

// https://developers.cloudflare.com/pages/how-to/refactor-a-worker-to-pages-functions/
export async function onRequestPost({ request, env }) {
  try {
    const input = parse(NewsletterFormSchema, await readRequestData(request));

    const envVar = envReader(env);

    const api = createMailchimpClient({
      dc: envVar("ETHERIA_MAILCHIMP_DC"),
      api_key: envVar("ETHERIA_MAILCHIMP_APIKEY"),
    });

    const list_id = envVar("ETHERIA_MAILCHIMP_DEFAULT_LIST_ID");

    const { email_address, status, unique_email_id } =
      await api.lists.setListMember(list_id, {
        email_address: input.email_address,
        status_if_new: "subscribed",
      });

    const { subscribe_url_long } = await api.lists.getList(list_id);

    function getUnsubscribeUrl() {
      return (
        subscribe_url_long.replace("subscribe", "unsubscribe") +
        `&e=${unique_email_id}`
      );
    }

    return success({
      email_address,
      status,
      unsubscribe_url: getUnsubscribeUrl(),
    });
  } catch (err) {
    if (err instanceof SyntaxError || err instanceof ValidationError) {
      return await errorResponse(err, { status: 400 });
    } else {
      return await errorResponse(err);
    }
  }
}
