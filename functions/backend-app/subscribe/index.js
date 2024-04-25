// https://developers.cloudflare.com/pages/how-to/refactor-a-worker-to-pages-functions/

export async function onRequestPost (context) {
    console.log(`[LOGGING FROM /hello]: Request came from ${context.request.url}`);
    const contentType = context.request.headers.get("Content-Type");
    console.log(`Content-Type: ${contentType}`);

    if(contentType == 'application/json') {
        const body = await context.request.json();
        // const {email, message} = JSON.parse(body);
        // const message = `${new Date().toISOString()}: email: ${email}, acepta: ${gives_consent}`;
        console.log(body);
    } else {
        console.log(`zacas`)
        const formData = await context.request.formData();
        console.log(formData);
        const {email, gives_consent} = Object.fromEntries(formData);
        // const {email, message} = JSON.parse(body);
        // const message = `${new Date().toISOString()}: email: ${email}, acepta: ${gives_consent}`;
        const message = `${new Date().toISOString()}: email: ${email}, acepta: ${gives_consent}`;
        console.log(message);
    }
    return new Response("OK");
}