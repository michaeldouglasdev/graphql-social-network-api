import dotenv from "dotenv";
import { createSchema, createYoga } from "graphql-yoga";
import fs from "fs";
import path from "path";
import { createServer } from "http";
import { useHive } from "@graphql-hive/yoga";
import { useServer } from "graphql-ws/lib/use/ws";
import { resolvers } from "@schema/resolvers";
import { JwtService } from "@core/services/jwt.service";
import { transformSchema } from "@schema/transformers";
import { Environment } from "@core/environment";
import { UserModel } from "@users/models/user.model";
import { WebSocketServer } from "ws";
import { ExecutionArgs } from "graphql";
import { EnvelopArmor } from "@escape.tech/graphql-armor";
import { useDeferStream } from "@graphql-yoga/plugin-defer-stream";
import {
  useResponseCache,
  cacheControlDirective,
} from "@graphql-yoga/plugin-response-cache";
import {
  defaultBuildResponseCacheKey,
  useResponseCache as useResponseCacheEnvelop,
} from "@envelop/response-cache";
import { useGraphQlJit } from "@envelop/graphql-jit";

import { usePersistedQuery } from "persisted-query-plugin";
import { useGraphQLSSE } from "@graphql-yoga/plugin-graphql-sse";

dotenv.config();

const pathFile = path.join(__dirname, "/graphql/schema/schema.graphql");
const typeDefs = fs.readFileSync(pathFile, { encoding: "utf-8" });

async function bootstrap() {
  const schema = createSchema({
    typeDefs,
    resolvers,
  });

  const transformedSchema = transformSchema(schema);

  const armor = new EnvelopArmor({
    maxDepth: {
      n: 12,
    },
  });
  const protection = armor.protect();

  const yoga = createYoga({
    schema: transformedSchema,
    maskedErrors: Environment.isProduction(),
    graphiql: {
      subscriptionsProtocol: "WS",
    },
    context: (ctx) => {
      let isSubscription: boolean = false;
      let authorization: string | null = null;
      isSubscription = ctx.params.query?.startsWith("subscription") || false;

      if (isSubscription) {
        const headers = ctx?.params?.extensions?.headers;
        if (!headers) {
          const isSSE = ctx.request.url.includes("/graphql/stream");
          if (isSSE) {
            authorization = ctx.request.headers.get("Authorization");
          } else {
            // @ts-ignore
            authorization = ctx.connectionParams.Authorization;
          }
        } else {
          authorization = headers.Authorization;
        }
      } else {
        authorization = ctx.request.headers.get("Authorization");
      }
      let user: UserModel | null = null;
      if (authorization) {
        user = JwtService.decode(authorization);
      }

      return {
        user: user,
      };
    },

    plugins: [
      useHive({
        enabled: true,
        token: Environment.get("HIVE_SECRET"),
        usage: true,
      }),
      useDeferStream(),
      //usePersistedQuery(),
      //useGraphQLSSE(),

      //useGraphQlJit(),
      /*useResponseCacheEnvelop({
        session(request: any) {
          return request.user.id;
        },
        scopePerSchemaCoordinate: {
          "Query.me": "PRIVATE",
        },
      }),*/
      /*useResponseCache({
        session: (context) => {
          // @ts-ignore
          return context.user.id;
        },
      }),*/
      ...protection.plugins,
    ],
  });

  const httpServer = createServer(yoga);
  const wsServer = new WebSocketServer({
    server: httpServer,
    path: yoga.graphqlEndpoint,
  });

  useServer(
    {
      execute: (args: any) => args.rootValue.execute(args),
      subscribe: (args: any) => args.rootValue.subscribe(args),
      onSubscribe: async (ctx, msg) => {
        const { schema, execute, parse, subscribe, validate, contextFactory } =
          yoga.getEnveloped({
            ...ctx,
            request: ctx.extra.request,
            socket: ctx.extra.socket,
            params: msg.payload,
          });

        const args: ExecutionArgs = {
          schema,
          operationName: msg.payload.operationName,
          document: parse(msg.payload.query),
          variableValues: msg.payload.variables,
          contextValue: await contextFactory(),
          rootValue: {
            execute,
            subscribe,
          },
        };

        const errors = validate(args.schema, args.document);

        if (errors.length) {
          return errors;
        }
        return args;
      },
    },
    wsServer
  );

  httpServer.listen(4000, () => {
    console.info(`GraphQL server running on http://localhost:4000/graphql`);
  });
}

bootstrap();
