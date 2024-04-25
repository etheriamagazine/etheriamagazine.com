const createMailchimpClient = ({ dc, apiKey }) => {
  const baseUrl = `https://${dc}.api.mailchimp.com/3.0/`;

  function sendRequest(path, data) {
    const auth = encodeBase64(`user:${apiKey}`);

    const defaultHeaders = {
      Authorization: `Basic ${auth}`,
      Accept: "application/json",
    };

    const headers = data
      ? { ...defaultHeaders, "Content-Type": "application/json" }
      : defaultHeaders;

    return fetch(`${baseUrl}/${path}`, {
      method: data? 'PUT': 'GET',
      headers: headers,
      body: data ? JSON.stringify(data) : null,
    });
  }

  return {
    ping() {
      return sendRequest("ping");
    },
    lists: {
      get() {
        return sendRequest("lists");
      },
      async addListMember(list_id, data = { status: "unsubscribed" }) {
        console.log(`enviando ${data}`);

        const subscriber_hash = await md5(data.email_address);
        data = {...data, subscriber_hash };

        return sendRequest(`lists/${list_id}/members/${subscriber_hash}`, data);
      },
    },
  };
};

// From https://developer.mozilla.org/en-US/docs/Glossary/Base64#the_unicode_problem.
function encodeBase64(string) {
  const bytes = new TextEncoder().encode(string);
  const binString = String.fromCodePoint(...bytes);
  return btoa(binString);
}

async function md5(string) {
  const bytes = new TextEncoder().encode(string);
  const hashBuffer = await crypto.subtle.digest('MD5', bytes); 
  const hashArray = Array.from(new Uint8Array(hashBuffer)) // convert buffer to byte array
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('') // convert bytes to hex string
  return hashHex;
}

export default createMailchimpClient;
