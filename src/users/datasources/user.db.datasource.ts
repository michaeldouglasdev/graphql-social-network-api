import { ConnectionModel } from "@core/connection/connection.model";
import { prisma } from "@core/services/prisma.service";
import {
  CreateUserInputModel,
  LoginInputModel,
  UserFollowInputModel,
  UsersInputModel,
} from "@users/models/user.model";
import { FollowerDB, FollowingDB } from "./model/user.db.model";

export class UserDBDatasource {
  async create(data: CreateUserInputModel) {
    const { email, name, username } = data;

    const user = await prisma.user.create({
      data: {
        email,
        name,
        username,
      },
    });

    return user;
  }

  async get(id: string) {
    const user = await prisma.user.findUnique({
      where: {
        id,
      },
    });

    return user;
  }

  async login(data: LoginInputModel) {
    const { username, password } = data;

    const user = await prisma.user.findUnique({
      where: {
        username,
        password,
      },
    });

    return user;
  }

  async list(data: UsersInputModel) {
    const { connection, where } = data;
    const { before, after, first, last } = connection;
    const cursor = before || after;
    const take = first || last || 0;
    const direction = first ? "next" : "previous";

    const nodes = await prisma.user.findMany({
      take: direction === "next" ? take + 1 : -take - 1,
      where,
      cursor: cursor ? { id: cursor } : undefined,
    });

    const hasExtraNode = nodes.length > take;

    if (hasExtraNode) {
      if (first) {
        nodes.pop();
      } else if (last) {
        nodes.shift();
      }
    }

    const startCursor = !!nodes.length ? nodes[0].id : undefined;
    const endCursor = !!nodes.length ? nodes[nodes.length - 1].id : undefined;

    return {
      edges: nodes.map((post) => ({
        cursor: post.id,
        node: post,
      })),
      pageInfo: {
        hasNextPage: first != null ? hasExtraNode : before != null,
        hasPreviousPage: first != null ? after != null : hasExtraNode,
        startCursor,
        endCursor,
      },
      count: 0,
    };
  }

  async follow(fromUserId: string, toUserId: string): Promise<boolean> {
    const follow = await prisma.follow.create({
      data: {
        followerId: fromUserId,
        followingId: toUserId,
      },
    });

    return !!follow;
  }

  async unfollow(fromUserId: string, toUserId: string): Promise<boolean> {
    const unfollow = await prisma.follow.deleteMany({
      where: {
        followerId: fromUserId,
        followingId: toUserId,
      },
    });

    return !!unfollow;
  }

  async followers(
    id: string,
    data: UserFollowInputModel
  ): Promise<ConnectionModel<FollowerDB>> {
    const { connection } = data;
    const { first, last, after, before } = connection;
    const cursor = after || before;
    const take = first || last || 0;
    const direction = first ? "next" : "previous";

    const followers =
      ((await prisma.user
        .findUnique({
          where: {
            id,
          },
        })
        .following({
          cursor: cursor ? { id: cursor } : undefined,
          take: direction === "next" ? take + 1 : -take - 1,
          skip: after || before ? 1 : 0,
          select: {
            id: true,
            follower: {
              select: {
                id: true,
                name: true,
                username: true,
                role: true,
                email: true,
              },
            },
          },
        })) as FollowerDB[]) || [];

    const hasExtraNode = followers.length > take;

    if (hasExtraNode) {
      if (first) {
        followers.pop();
      } else if (last) {
        followers.shift();
      }
    }

    const startCursor = !!followers.length ? followers[0].id : undefined;
    const endCursor = !!followers.length
      ? followers[followers.length - 1].id
      : undefined;

    return {
      edges: followers.map((following) => ({
        cursor: following.id,
        node: following,
      })),
      pageInfo: {
        hasNextPage: first != null ? hasExtraNode : before != null,
        hasPreviousPage: first != null ? after != null : hasExtraNode,
        startCursor,
        endCursor,
      },
      count: 0,
    };
  }

  async following(
    id: string,
    data: UserFollowInputModel
  ): Promise<ConnectionModel<FollowingDB>> {
    const { connection } = data;
    const { first, last, after, before } = connection;
    const cursor = after || before;
    const take = first || last || 0;
    const direction = first ? "next" : "previous";

    const following =
      (await prisma.user
        .findUnique({
          where: {
            id,
          },
        })
        .followers({
          cursor: cursor ? { id: cursor } : undefined,
          take: direction === "next" ? take + 1 : -take - 1,
          skip: after || before ? 1 : 0,
          select: {
            id: true,
            following: {
              select: {
                id: true,
                name: true,
                username: true,
                role: true,
                email: true,
              },
            },
          },
        })) || ([] as FollowingDB[]);

    const hasExtraNode = following.length > take;

    if (hasExtraNode) {
      if (first) {
        following.pop();
      } else if (last) {
        following.shift();
      }
    }

    const startCursor = !!following.length ? following[0].id : undefined;
    const endCursor = !!following.length
      ? following[following.length - 1].id
      : undefined;

    return {
      edges: following.map((following) => ({
        cursor: following.id,
        node: following,
      })),
      pageInfo: {
        hasNextPage: first != null ? hasExtraNode : before != null,
        hasPreviousPage: first != null ? after != null : hasExtraNode,
        startCursor,
        endCursor,
      },
      count: 0,
    };
  }

  async countFollowers(id: string): Promise<number> {
    const count = await prisma.follow.count({
      where: {
        followingId: id,
      },
    });

    return count;
  }

  async countFollowing(id: string): Promise<number> {
    const count = await prisma.follow.count({
      where: {
        followerId: id,
      },
    });

    return count;
  }

  async followerByCurrentUser(
    id: string,
    currentUserId: string
  ): Promise<boolean> {
    const follow = await prisma.follow.findFirst({
      where: {
        followerId: currentUserId,
        followingId: id,
      },
    });

    return !!follow;
  }

  async followingByCurrentUser(
    id: string,
    currentUserId: string
  ): Promise<boolean> {
    const follow = await prisma.follow.findFirst({
      where: {
        followerId: id,
        followingId: currentUserId,
      },
    });

    return !!follow;
  }

  async uploadAvatar(id: string, path: string): Promise<boolean> {
    const result = await prisma.user.update({
      where: {
        id,
      },
      data: {
        avatar: path,
      },
      select: {
        id: true,
      },
    });

    return !!result;
  }
}
