import { createMailchimpClient } from "../mailchimp";
import { makeEnvReader } from "../config";
import { NewsletterFormSchema, parse } from "../schemas";
import { ResponseError, ValidationError } from "../errors";
import { readRequestData, errorResponse, success } from "../http";

// https://developers.cloudflare.com/pages/how-to/refactor-a-worker-to-pages-functions/
export async function onRequestPost({ request, env }) {
  try {
    const input = parse(NewsletterFormSchema, await readRequestData(request));

    const readEnv = makeEnvReader(env);

    const api = createMailchimpClient({
      dc: readEnv("ETHERIA_MAILCHIMP_DC"),
      api_key: readEnv("ETHERIA_MAILCHIMP_APIKEY"),
    });

    const list_id = readEnv("ETHERIA_MAILCHIMP_DEFAULT_LIST_ID");

    const result =
      await api.lists.setListMember(list_id, {
        email_address: input.email_address,
        status: "subscribed",
        status_if_new: "subscribed",
      });

    const { email_address, status, unique_email_id } = result;
    const { name: list_name, subscribe_url_long } = await api.lists.getList(list_id);

    function getUnsubscribeUrl() {
      return (
        subscribe_url_long.replace("subscribe", "unsubscribe") +
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
    if (err instanceof SyntaxError || err instanceof ValidationError) {
      return await errorResponse(err, { status: 400 });
    } else {
      return await errorResponse(err);
    }
  }
}
