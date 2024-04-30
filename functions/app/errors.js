export class ValidationError extends Error {
  constructor(message, { cause, issues }) {
    super(message, { cause });
    this.name = "ValidationError";
    this.issues = issues;
  }
}


export class ResponseError extends Error {
    constructor(message, response) {
      super(message);
      this.name = "Response API Error"
      this.response = response;
    }
  }
export class NetworkError extends Error {
  constructor(message, { cause }) {
    super(message, { cause })
    this.name = "NetworkError";
  }
}
