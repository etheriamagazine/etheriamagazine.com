export async function onRequestGet({ request, env }) {
  const vars = Object.fromEntries(
    ["ETHERIA_MAILCHIMP_DC", "ETHERIA_MAILCHIMP_APIKEY"]
      .filter((key) => key in env)
      .map((key) => [key, env[key]])
  );

  return new Response(JSON.stringify(vars));
}
