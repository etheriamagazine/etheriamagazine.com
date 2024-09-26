import type { HonoRequest } from "hono";
import { ValidationError, ResponseError } from "./errors";

export interface ErrorResponse {
    type: string,
    title: string,
    status: number,
    detail?: string,
    issues?: [ValidationIssue, ...ValidationIssue[]],
    response?: Response

}

export interface ValidationIssue {
    field?: string,
    message?: string
}

export async function errorResponse(err: Error, { status = 500 } = {}) {
  const { name, message, cause } = err;
   
 
  let body: ErrorResponse = {
    type: "https://github.com/etheriamagazine/etheriamagazine.com/blob/main/README.md",
    title: name,
    status: status,
    detail: message + (cause ? ` ⮡${cause.toString()}` : ""),
  };

  if(err instanceof ValidationError) {
    body = {...body, issues: err.issues}
  }

  if(err instanceof ResponseError) {
    body = {...body, response: err.response}
  }

  const blob = new Blob([JSON.stringify(body, null, 2)], {
    type: "application/json",
  });
  return new Response(blob, { status: status });
}   

export async function success(data: unknown, {status = 200} = {}) {
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });
    return new Response(blob, { status });
}

export async function readRequestData(request: HonoRequest) {
  const contentType = request.header("Content-Type");

  if (contentType == "application/json") {
    try {
      const data = await request.json();
      return data;
    } catch (err) {
      let error = err as Error;
      throw new ValidationError("Error parsing JSON data", { cause: err, issues: [{field: "body", message: error.message}] });
    }
  } else {
    const formData = await request.formData();
    return Object.fromEntries(formData);
  }
}
