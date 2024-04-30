import { ValidationError } from "./errors";

export async function errorResponse(err, { status = 500 } = {}) {
  const { name, message, cause, issues, response } = err;
  console.log(err);

  const body = {
    type: "https://github.com/etheriamagazine/etheriamagazine.com/blob/main/README.md",
    title: name,
    status: status,
    detail: message + (cause ? `: ${cause.message}` : ""),
    issues: issues || (cause ? [cause.message] : undefined),
    response: response ? await response.json() : null,
  };
  const blob = new Blob([JSON.stringify(body, null, 2)], {
    type: "application/json",
  });
  return new Response(blob, { status: status });
}

export async function success(data, {status = 201} = {}) {
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });
    return new Response(blob, { status });
}

export async function readRequestData(request) {
  const contentType = request.headers.get("Content-Type");

  if (contentType == "application/json") {
    try {
      const data = await request.json();
      return data;
    } catch (err) {
      throw new ValidationError("Error parsing JSON data", { cause: err });
    }
  } else {
    const formData = await request.formData();
    return Object.fromEntries(formData);
  }
}
