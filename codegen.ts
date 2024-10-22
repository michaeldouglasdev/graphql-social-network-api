import { CodegenConfig } from "@graphql-codegen/cli";

const codegen: CodegenConfig = {
  schema: "./src/graphql/schema/schema.graphql",
  generates: {
    "./src/graphql/__generated__/types.ts": {
      config: {
        contextType: "@context/type#Context",
        namingConvention: {
          enumValues: "upper-case#upperCase",
        },
        mappers: {
          Login: "@users/models/login.model#LoginModel",
          User: "@users/models/user.model#UserModel",
          UserRole: "@users/models/user.model#UserRoleModel",
          Post: "@posts/models/post.model#PostModel",
          CreatePostInput: "@posts/models/post.model#CreatePostInputModel",
          UpdatePostInput: "@posts/models/post.model#UpdatePostInputModel",
          LoginInput: "@users/models/user.model#LoginInputModel",
          StringFilterInput:
            "@core/filters/filters.model#StringFilterInputModel",
          DateTimeFilterInput:
            "@core/filters/filters.model#DateTimeFilterInputModel",
          ReplyPostInput: "@posts/models/post.model#ReplyPostInputModel",
          Notification:
            "@notifications/models/notifications.model#BaseNotificationModel",
          ReplyPostNotification:
            "@notifications/models/notifications.model#ReplyPostNotificationModel",
          NotificationsInput:
            "@notifications/models/notifications.model#NotificationsInputModel",
          FollowUserInput: "@users/models/users.model#FollowUserInputModel",
          //OrderBy: '@posts/models/post.model#OrderByModel'
        },

        enumValues: {
          UserRole: "@users/models/user.model#UserRoleModel",
          //OrderBy: '@posts/models/post.model#OrderByModel',
        },
        maybeValue: "T | undefined",
        customResolveTypes: {
          Query: {
            feed: "@posts/models/post.model#FeedModel",
          },
        },
      },
      plugins: ["typescript", "typescript-resolvers"],
    },
  },
};

export default codegen;
