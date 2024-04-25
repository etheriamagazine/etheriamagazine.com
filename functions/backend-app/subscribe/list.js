import createMailchimpClient from "./mailchimp";

export async function onRequestGet({request, env}) {
  const mailchimp = createMailchimpClient({
    dc: env.ETHMAG_MAILCHIMP_DC,
    apiKey: env.ETHMAG_MAILCHIMP_APIKEY,
  });

  console.log(env.ETHMAG_MAILCHIMP_APIKEY);
  
  const list_id = "5027939f51";
  const response = await mailchimp.lists.addListMember("5027939f51", {
    email_address: "germanftorres@gmail.com",
    status: "subscribed",
  });

  console.log(response.status);

  return response;
}
