
export interface ValidationErrorIssue {
    field?: string,
    message?: string
}

export interface ValidationErrorOptions extends ErrorOptions {
    issues: [ValidationErrorIssue, ...ValidationErrorIssue[]];
}

export interface ResponseErrorOptions extends ErrorOptions {
    response: Response;
}

export class ValidationError extends Error {
    issues: [ValidationErrorIssue, ...ValidationErrorIssue[]];

    constructor(message: string, options: ValidationErrorOptions) {
        super(message, options);
        this.name = 'ValidationError';
        this.issues = options.issues;
    }
}

export class ResponseError extends Error {
    response: Response;
    constructor(message: string, options: ResponseErrorOptions) {
        super(message, options);
        this.name = 'ResponseError';
        this.response = options?.response;
    }
}

export class NetworkError extends Error {
    constructor(message: string, options?: ErrorOptions) {
        super(message, options);
        this.name = 'NetworkError';
    }
}

export class ConfigError extends Error {
    name: "ConfigError"
    constructor(message: string) {
        super(message);
        this.name = 'ConfigError';
    }
}
