import { NetworkError, ResponseError } from "./errors";

const create = ({ dc, api_key }) => {
  const baseUrl = `https://${dc}.api.mailchimp.com/3.0`;

  async function sendRequest(path, method, data) {
    const auth = encodeBase64(`user:${api_key}`);

    const defaultHeaders = {
      Authorization: `Basic ${auth}`,
      Accept: "application/json",
    };

    const hasQueryString = () => method === "GET" && data;
    const hasBody = () => ["POST", "PUT"].includes(method) && data;

    const url = hasQueryString()
      ? `${baseUrl}/${path}?${new URLSearchParams(data).toString()}`
      : `${baseUrl}/${path}`;

    const headers = hasBody()
      ? { ...defaultHeaders, "Content-Type": "application/json" }
      : defaultHeaders;

    try {
      const response = await fetch(url, {
        method: method,
        headers: headers,
        body: hasBody() ? JSON.stringify(data) : null,
      });
      if (!response.ok) {
        throw new ResponseError("Received an error response from Mailchimp", response);
      }
      return await response.json();
    } catch (err) {
      if (err instanceof TypeError) {
        throw new NetworkError(
          `Could not establish a network connection to Mailchimp on endpoint '${baseUrl}'. Please check configuration or network`,
          { cause: err }
        );
      } else {
        throw err;
      }
    }
  }

  const get = (path, data) => sendRequest(path, "GET", data);
  const post = (path, data) => sendRequest(path, "POST", data);
  const put = (path, data) => sendRequest(path, "PUT", data);

  return {
    ping() {
      return get("ping");
    },
    lists: {
      // https://mailchimp.com/developer/marketing/api/lists/get-lists-info/
      getAllLists(params) {
        return get("lists", params);
      },

      getList(list_id) {
        return get(`lists/${list_id}`);
      },

      // https://mailchimp.com/developer/marketing/api/list-members/add-member-to-list/
      addListMember(list_id, data = { status: "unsubscribed" }) {
        return post(`lists/${list_id}/members`, data);
      },

      // https://mailchimp.com/developer/marketing/api/list-members/add-or-update-list-member/
      async setListMember(list_id, data = { status: "unsubscribed" }) {
        const subscriber_hash = await md5(data.email_address);
        data = { ...data, x: subscriber_hash };

        return put(`lists/${list_id}/members/${subscriber_hash}`, data);
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
  const hashBuffer = await crypto.subtle.digest("MD5", bytes);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
  return hashHex;
}

export {
  create as createMailchimpClient,
};
