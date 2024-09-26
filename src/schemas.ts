import * as v from 'valibot';
import { ValidationError, type ValidationErrorIssue} from './errors';
        
export const NewsletterFormSchema = v.object({
    email_address: v.pipe(
        v.string('The value is required'),
        v.email('Should be an email')
    ),
    accepts_privacy_policy: v.pipe(
        v.union([v.literal('true'), v.literal(true)]),
        v.transform((input) => true)
    ),
});

function safeParse<
    const TSchema extends v.BaseSchema<unknown, unknown, v.BaseIssue<unknown>>
>(schema: TSchema, input: unknown, config?: v.Config<v.InferIssue<TSchema>>) {
    try {
        return v.parse(schema, input, config);
    } catch (err) {
        const error = err as v.ValiError<TSchema>;

        const issues = error.issues.map((issue) => {
            if(issue.path !== undefined) {
                return {
                    field: String(issue.path[0].key),
                    message: issue.message
                }
            }

            return {
                field: "",
                message: issue.message,
            };
        }) as [ValidationErrorIssue, ...ValidationErrorIssue[]];

        throw new ValidationError('Error validating input data as schema', {
            cause: err,
            issues: issues,
        });
    }
}

export { safeParse as parse };
