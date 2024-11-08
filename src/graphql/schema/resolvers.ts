import {
  transformOrderByGraphQLToModel,
  transformOrToOR,
} from "@core/filters/utils";

import { Resolvers } from "@generated/types";
import { FeedPostOrderInputModel } from "@posts/models/post.model";
import { PostService } from "@posts/services/post.service";
import { UserService } from "@users/services/user.service";
import { createPubSub } from "graphql-yoga";
import { NotificationService } from "@notifications/services/notification.service";
import {
  CreateNotificationModel,
  isPostReplyNotification,
  NotificationModel,
  NotificationTypeModel,
} from "@notifications/models/notifications.model";
import { parseResolveInfo } from "graphql-parse-resolve-info";
import { ConversationsService } from "@conversations/services/conversations.service";
import {
  ConversationModel,
  ConversationTypeModel,
} from "@conversations/models/conversations.model";
import { sleep } from "utils/sleep.util";

export type PubSubChannels = {
  [eventName: `notification-${string}`]: [PubSubNotificationArgs];
  [eventName: `user-${string}-conversation`]: [PubSubConversationArgs];
};

type PubSubNotificationArgs = {
  data: CreateNotificationModel;
};
type PubSubConversationArgs = {
  data: {
    conversationId: string;
  };
};
const pubSub = createPubSub<PubSubChannels>();

export const resolvers: Resolvers = {
  Query: {
    user: async (_parent, args) => {
      const userService = new UserService();
      const user = await userService.get(args.id);

      return user;
    },
    users: async (_parent, args, _context, info) => {
      const userService = new UserService();

      const where = transformOrToOR(args.data.where);
      const users = await userService.list({
        connection: args.data.connection,
        where,
      });

      ///const select = new PrismaSelect(info).value;
      /* const users = await prisma.user.findMany({
        ...select
      }) as UserModel[]*/

      return users;
    },
    posts: async (_parent, args) => {
      const postService = new PostService();
      const posts = await postService.list(args.data);

      return posts;
    },
    feed: async (_parent, args) => {
      const postService = new PostService();
      const order =
        args.data.order &&
        transformOrderByGraphQLToModel<FeedPostOrderInputModel>(
          args.data.order
        );

      const connection = await postService.feed({
        where: args.data.where,
        order,
        connection: args.data.connection,
      });

      return connection;
    },
    me: async (_parent, _args, context) => {
      const userService = new UserService();
      const user = await userService.get(context.user.id);
      return user;
    },
    notifications: async (_parent, args, context) => {
      const notification = new NotificationService();
      const notifications = await notification.listByUserId(
        context.user.id,
        args.data
      );
      return notifications;
    },
    post: async (_parent, args) => {
      const postService = new PostService();
      const post = await postService.get(args.id);

      return post;
    },
    replies: async (_parent, args) => {
      const postService = new PostService();
      const order =
        args.data.order &&
        transformOrderByGraphQLToModel<FeedPostOrderInputModel>(
          args.data.order
        );

      const connection = await postService.feed({
        where: args.data.where,
        order,
        connection: args.data.connection,
      });

      return connection;
    },
    conversations: async (_parent, args, context) => {
      const conversationsService = new ConversationsService();
      const conversations = await conversationsService.list(
        context.user.id,
        args.data
      );

      return conversations;
    },
    messages: async (_parent, args) => {
      const { connection, where, order } = args.data;
      const conversationService = new ConversationsService();
      const messages = await conversationService.listMessages({
        connection,
        where,
        order: transformOrderByGraphQLToModel(order),
      });
      return messages;
    },
  },
  Mutation: {
    createUser: async (_parent, args) => {
      const userService = new UserService();
      const user = userService.create(args.data);

      return user;
    },
    login: (_parent, args) => {
      const userService = new UserService();
      const login = userService.login(args.data);

      return login;
    },
    uploadAvatar: async (_parent, args, context) => {
      const userService = new UserService();
      const results = await userService.uploadAvatar(
        context.user.id,
        args.file
      );
      return results;
    },
    createPost: async (_parent, args, context) => {
      const postService = new PostService();
      const post = await postService.create({
        authorId: context.user.id,
        content: args.data.content,
      });

      return post;
    },
    updatePost: async (_parent, args) => {
      const postService = new PostService();
      const post = await postService.update(args.id, args.data);

      return post;
    },
    replyPost: async (_parent, args, context) => {
      const { content, postId } = args.data;
      const postService = new PostService();
      const reply = await postService.reply({
        content,
        postId,
        authorId: context.user.id,
      });

      if (reply.parentPostId) {
        const parentPost = await postService.get(reply.parentPostId);

        const createNotification: CreateNotificationModel = {
          type: NotificationTypeModel.REPLY_POST_NOTIFICATION,
          fromUserId: context.user.id,
          postId: reply.parentPostId,
          toUserId: parentPost.authorId,
        };
        pubSub.publish(`notification-${parentPost.authorId}`, {
          data: createNotification,
        });
      }

      return reply;
    },
    likePost: async (_parent, args, context) => {
      await new Promise<void>((res) => setTimeout(() => res(), 3000));
      const postService = new PostService();
      await postService.like(context.user.id, args.id);

      return true;
    },
    unlikePost: async (_parent, args, context) => {
      await new Promise<void>((res) => setTimeout(() => res(), 3000));

      const postService = new PostService();
      await postService.unlike(context.user.id, args.id);

      return true;
    },
    followUser: async (_parent, args, context) => {
      const userService = new UserService();
      const success = await userService.follow(context.user.id, args.id);
      return success;
    },
    unfollowUser: async (_parent, args, context) => {
      const userService = new UserService();
      const success = await userService.unfollow(context.user.id, args.id);
      return success;
    },
    createConversationDirect: async (_parent, args, context) => {
      const conversationService = new ConversationsService();
      const { receiverId } = args.data;
      const conversation = await conversationService.createConversationDirect({
        receiverId,
        senderId: context.user.id,
      });

      return conversation;
    },
    createConversation: async (_parent, args, context) => {
      const conversationService = new ConversationsService();

      if (args.data.direct) {
        const { receiverId } = args.data.direct;
        const conversation = await conversationService.createConversationDirect(
          {
            receiverId,
            senderId: context.user.id,
          }
        );

        return conversation;
      }
    },
    sendMessage: async (_parent, args, context) => {
      const { conversationId, message } = args.data;
      const conversationService = new ConversationsService();
      const messageModel = await conversationService.sendMessage({
        conversationId,
        message,
        senderId: context.user.id,
      });

      messageModel.participantsIds?.map((id) => {
        if (id !== context.user.id) {
          pubSub.publish(`user-${id}-conversation`, {
            data: {
              conversationId,
            },
          });
        }
      });

      return messageModel;
    },
  },

  Subscription: {
    notificationSubscribe: {
      subscribe: async function* (_parent, _args, context, info) {
        for await (const payload of pubSub.subscribe(
          `notification-${context.user.id}`
        )) {
          const { type, fromUserId, toUserId, postId } = payload.data;

          const notificationService = new NotificationService();
          const notificationModel = await notificationService.create({
            type: type,
            fromUserId: fromUserId,
            toUserId: toUserId,
            postId: postId,
          });

          const notification: NotificationModel = {
            type: notificationModel.type,
            id: notificationModel.id,
            createdAt: notificationModel.createdAt,
            fromUserId: notificationModel.fromUserId,
            toUserId: notificationModel.toUserId,
            ...(isPostReplyNotification(notificationModel) && {
              postId: notificationModel.postId,
            }),
          };

          yield { notificationSubscribe: notification };
        }
      },
    },

    conversationSubscribe: {
      subscribe: async function* (parent, args, context, info) {
        for await (const payload of pubSub.subscribe(
          `user-${context.user.id}-conversation`
        )) {
          const { conversationId } = payload.data;
          const conversationsService = new ConversationsService();
          const conversation = await conversationsService.get(conversationId);
          yield { conversationSubscribe: conversation };
        }
      },
    },
  },
  User: {
    posts: async (parent, args) => {
      const postService = new PostService();
      const order =
        args.data.order &&
        transformOrderByGraphQLToModel<FeedPostOrderInputModel>(
          args.data.order
        );

      const connection = await postService.feed({
        where: {
          ...args.data.where,
          authorId: {
            equals: parent.id,
          },
        },
        order,
        connection: args.data.connection,
      });

      return connection;
    },
    followers: async (parent, args, context, info) => {
      const userService = new UserService();

      const parsedInfo = parseResolveInfo(info);

      const isEdgeRequested =
        // @ts-ignore
        !!parsedInfo.fieldsByTypeName.FollowConnection?.edges;
      const followers =
        isEdgeRequested && args.data
          ? await userService.followers(parent.id, args.data)
          : undefined;

      const isCountRequested =
        // @ts-ignore
        !!parsedInfo.fieldsByTypeName.FollowConnection?.count;
      const isByCurrentUserRequested =
        // @ts-ignore
        !!parsedInfo.fieldsByTypeName.FollowConnection?.byCurrentUser;

      const count = isCountRequested
        ? await userService.countFollowers(parent.id)
        : 0;
      const byCurrentUser = isByCurrentUserRequested
        ? await userService.followerByCurrentUser(parent.id, context.user.id)
        : false;
      return {
        edges: followers ? followers.edges : [],
        pageInfo: followers
          ? followers.pageInfo
          : { hasNextPage: false, hasPreviousPage: false },
        count,
        byCurrentUser,
      };
    },
    following: async (parent, args, context, info) => {
      const userService = new UserService();

      const parsedInfo = parseResolveInfo(info);

      const isEdgeRequested =
        // @ts-ignore
        !!parsedInfo.fieldsByTypeName.FollowConnection?.edges;

      const following =
        isEdgeRequested && args.data
          ? await userService.following(parent.id, args.data)
          : undefined;

      const isCountRequested =
        // @ts-ignore
        !!parsedInfo.fieldsByTypeName.FollowConnection?.count;

      const isByCurrentUserRequested =
        // @ts-ignore
        !!parsedInfo.fieldsByTypeName.FollowConnection?.byCurrentUser;

      const count = isCountRequested
        ? await userService.countFollowing(parent.id)
        : 0;
      const byCurrentUser = isByCurrentUserRequested
        ? await userService.followerByCurrentUser(parent.id, context.user.id)
        : false;

      return {
        edges: following ? following.edges : [],
        pageInfo: following
          ? following.pageInfo
          : { hasNextPage: false, hasPreviousPage: false },
        count,
        byCurrentUser,
      };
    },
  },
  Post: {
    author: async (parent) => {
      const userService = new UserService();
      const author = await userService.get(parent.authorId);

      return author;
    },
    replies: async (parent, args) => {
      const postService = new PostService();
      let count = await postService.countReplies(parent.id);
      if (!args?.data?.connection) {
        return {
          edges: [],
          count,
          pageInfo: {
            hasNextPage: false,
            hasPreviousPage: false,
          },
        };
      }

      const order =
        args.data.order &&
        transformOrderByGraphQLToModel<FeedPostOrderInputModel>(
          args.data.order
        );

      const replies = await postService.feed({
        where: {
          ...args.data.where,
          parentPostId: {
            equals: parent.id,
          },
        },
        connection: args.data.connection,
        order,
      });

      // TODO COUNT duplicated
      return {
        ...replies,
        count,
      };
    },
    likes: async (parent, args, context) => {
      const postService = new PostService();
      let count = await postService.countLikes(parent.id);
      let byCurrentUser = await postService.likedByCurrentUser(
        context.user.id,
        parent.id
      );
      return {
        edges: [],
        count,
        pageInfo: {
          hasNextPage: false,
          hasPreviousPage: false,
        },
        byCurrentUser,
      };

      /*if (!args?.data?.connection) {
        return {
          edges: [],
          count,
          pageInfo: {
            hasNextPage: false,
            hasPreviousPage: false,
          },
        };
      }

      const order =
        args.data.order &&
        transformOrderByGraphQLToModel<FeedPostOrderInputModel>(
          args.data.order
        );

      const replies = await postService.feed({
        where: {
          ...args.data.where,
          parentPostId: {
            equals: parent.id,
          },
        },
        connection: args.data.connection,
        order,
      });

      // TODO COUNT duplicated
      return {
        ...replies,
        count,
      };*/
    },
    parent: async (parent) => {
      if (parent.parentPostId) {
        const postService = new PostService();
        const post = await postService.get(parent.parentPostId);
        return post;
      }
      return undefined;
    },
  },
  Notification: {
    __resolveType: (parent) => {
      if (parent.type === NotificationTypeModel.REPLY_POST_NOTIFICATION) {
        return "ReplyPostNotification";
      } else {
        return "FollowUserNotification";
      }
    },
  },
  ReplyPostNotification: {
    fromUser: async (parent) => {
      const userService = new UserService();

      const user = await userService.get(parent.fromUserId);
      return user;
    },
    post: async (parent) => {
      const postService = new PostService();

      const post = await postService.get(parent.postId);
      return post;
    },
  },
  Conversation: {
    __resolveType: (parent) => {
      if (parent.type === ConversationTypeModel.DIRECT) {
        return "ConversationDirect";
      }
      return "ConversationGroup";
    },
  },
  ConversationDirect: {
    messages: async (parent, args) => {
      const { where, connection, order } = args.data;
      const conversationService = new ConversationsService();
      const messages = await conversationService.listConversationMessages(
        parent.id,
        {
          connection,
          where,
          order: transformOrderByGraphQLToModel(order),
        }
      );
      return messages;
    },
  },
};
