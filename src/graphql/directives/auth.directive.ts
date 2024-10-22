import { Context } from "@context/type";
import { getDirective, MapperKind, mapSchema } from "@graphql-tools/utils";
import { UserRoleModel } from "@users/models/user.model";
import { defaultFieldResolver, GraphQLError, GraphQLSchema } from "graphql";

export const AuthDirective = () => {
  const directiveName = 'auth';
  return {
    authDirectiveTransformer(schema: GraphQLSchema) {
      return mapSchema(schema, {
        [MapperKind.OBJECT_FIELD]: (fieldConfig, _fieldName, _typeName) => {
          const directive = getDirective(schema, fieldConfig, directiveName)?.[0];

          if (directive) {
            const { resolve = defaultFieldResolver } = fieldConfig;
            fieldConfig.resolve = async function (parent, args, context: Context, info) {
              const user = context.user;
              if (!user) {
                throw new GraphQLError('User is not authenticated');
              }

              const roles: UserRoleModel[] | null = directive.roles;
              const hasPermission = roles ? roles?.includes(user.role) : true

              if (!hasPermission) {
                throw new GraphQLError('Not authorized');
              }

              return resolve(parent, args, context, info);
            }
          }

          return fieldConfig
        }
      })
    }
  }
}