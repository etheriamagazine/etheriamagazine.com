import { NetworkError, ResponseError } from '../errors';
import type { GetListResponse, SetListMemberRequest, SetListMemberResponse } from './types';
type Method = 'GET' | 'POST' | 'PUT';


const createMailchimpClient = (dc: string, api_key: string) => {
  const baseUrl = `https://${dc}.api.mailchimp.com/3.0`;

  async function sendRequest(path: string, method: Method, data: any) {
    const auth = encodeBase64(`user:${api_key}`);

    const defaultHeaders = {
      Authorization: `Basic ${auth}`,
      Accept: 'application/json',
    };

    const hasQueryString = () => method === 'GET' && data;
    const hasBody = () => ['POST', 'PUT'].includes(method) && data;

    const url = hasQueryString()
      ? `${baseUrl}/${path}?${new URLSearchParams(data).toString()}`
      : `${baseUrl}/${path}`;

    const headers = hasBody()
      ? { ...defaultHeaders, 'Content-Type': 'application/json' }
      : defaultHeaders;

    try {
      const res = await fetch(url, {
        method: method,
        headers: headers,
        body: hasBody() ? JSON.stringify(data) : null,
      });
      if (!res.ok) {
        throw new ResponseError(
          'Received an error response from Mailchimp',
          { response: res }
        );
      }
      return await res.json();
    } catch (err) {
      // console.log(err);
      throw new NetworkError(
        `Could not establish a network connection to Mailchimp on endpoint '${baseUrl}'. Please check configuration or network.`,
        { cause: err }
      );
    }
  }

  const get = (path: string, data?: any) => sendRequest(path, 'GET', data);
  const post = (path: string, data?: any) => sendRequest(path, 'POST', data);
  const put = (path: string, data?: any) => sendRequest(path, 'PUT', data);

  return {
    ping() {
      return get('ping');
    },
    lists: {
      // https://mailchimp.com/developer/marketing/api/lists/get-lists-info/
      async getAllLists(params: any) {
        return get('lists', params);
      },

      async getList(list_id: string) : Promise<GetListResponse> {
        return get(`lists/${list_id}`) as Promise<GetListResponse>;
      },

      // https://mailchimp.com/developer/marketing/api/list-members/add-member-to-list/
      async addListMember(list_id: string, data = { status: 'unsubscribed' }) {
        return post(`lists/${list_id}/members`, data);
      },

      // https://mailchimp.com/developer/marketing/api/list-members/add-or-update-list-member/
      async setListMember(list_id: string, data: SetListMemberRequest) : Promise<SetListMemberResponse> {
        const hasher = new Bun.CryptoHasher("md5");
        hasher.update(data.email_address);
        const subscriber_hash = hasher.digest("hex");

        return put(`lists/${list_id}/members/${subscriber_hash}`, data) as Promise<SetListMemberResponse>;
      },
    },
  };
};

// From https://developer.mozilla.org/en-US/docs/Glossary/Base64#the_unicode_problem.
function encodeBase64(string: string) {
  const bytes = new TextEncoder().encode(string);
  const binString = String.fromCodePoint(...bytes);
  return btoa(binString);
}

export { createMailchimpClient };
