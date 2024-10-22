import { GraphQLSchema } from "graphql";
import { AuthDirective } from "graphql/directives/auth.directive";
import { DateDirective } from "graphql/directives/date.directive";
import { ValidateDirective } from "graphql/directives/validate.directive";

export function transformSchema(schema: GraphQLSchema) {
  const { authDirectiveTransformer } = AuthDirective();
  const { dateDirectiveTransformer } = DateDirective();
  const { validateDirectiveTransformer } = ValidateDirective();

  const directives = [
    authDirectiveTransformer,
    dateDirectiveTransformer,
    validateDirectiveTransformer,
  ];

  return directives.reduce(
    (accSchema, transformer) => transformer(accSchema),
    schema
  );
}
