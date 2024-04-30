import { ValidationError } from "./errors";

import {
  object,
  email,
  parse,
  string,
  union,
  literal,
  transform,
  never,
} from "valibot";
export const NewsletterFormSchema = object({
  email_address: string("The value is required", [email("Should be an email")]),
  accepts_privacy_policy: transform(
    union([literal("true"), literal(true)]),
    (input) => true
  ),
});

function wrappedParse(schema, input, config) {
  try {
    return parse(schema, input, config);
  } catch (err) {
    const issues = err.issues.map(
      ({ path: [{ key }], message }) => ({ field: key, message })
    );

    throw new ValidationError("Error validating input data as schema", {cause: err, issues });
  }
}



export {wrappedParse as parse};
