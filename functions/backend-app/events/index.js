export async function onRequest (context) {
    return new Response(new Date().toISOString());
}