export async function onRequestGet(context) {
  const objec_key = context.params.key.join("/");

  const obj = await context.env.ETHERIA_IMAGES.get(objec_key);
  if (obj === null) {
    return new Response("Not found", { status: 404 });
  }

  const headers = new Headers();
  obj.writeHttpMetadata(headers);
  headers.set('etag', obj.httpEtag);

  return new Response(obj.body, {
    headers,
  });

}
