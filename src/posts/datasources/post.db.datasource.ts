import { ConnectionModel } from "@core/connection/connection.model";
import { prisma } from "@core/services/prisma.service";
import {
  CreatePostInputModel,
  PostModel,
  PostsInputModel,
  ReplyPostInputModel,
  FeedPostInputModel,
  UpdatePostInputModel,
} from "@posts/models/post.model";
import DataLoader from "dataloader";

const listByAuthorIdDataLoader = new DataLoader(
  async (authorIds: readonly string[]) => {
    const posts = await prisma.post.findMany({
      where: {
        authorId: {
          in: [...authorIds],
        },
      },
    });

    // Create a map to store posts by authorId
    const postMap: Record<string, PostModel[]> = {};

    // Group posts by authorId
    posts.forEach((post) => {
      if (!postMap[post.authorId]) {
        postMap[post.authorId] = [];
      }
      postMap[post.authorId].push(post);
    });

    // Return posts in the same order as the authorIds input
    return authorIds.map((authorId) => postMap[authorId] || []);
  }
);

export class PostDBDatasource {
  async create(data: CreatePostInputModel) {
    const { authorId, content } = data;
    const post = await prisma.post.create({
      data: {
        content,
        authorId,
      },
    });

    return post;
  }

  async get(id: string) {
    const post = await prisma.post.findUnique({
      where: {
        id,
      },
    });

    return post;
  }

  async list(data: PostsInputModel): Promise<ConnectionModel<PostModel>> {
    const { first, after, before, last } = data.connection;
    const cursor = after || before;
    const take = first || last || 0;
    const direction = first ? "next" : "previous";

    const [posts, totalCount] = await prisma.$transaction([
      prisma.post.findMany({
        cursor: cursor ? { id: cursor } : undefined,
        take: direction === "next" ? take + 1 : -take - 1,
        skip: after || before ? 1 : 0,
      }),
      prisma.post.count(),
    ]);

    const hasExtraNode = posts.length > take;

    if (hasExtraNode) {
      if (first) {
        posts.pop();
      } else if (last) {
        posts.shift();
      }
    }

    const startCursor = posts ? posts[0].id : undefined;
    const endCursor = posts ? posts[posts.length - 1].id : undefined;

    return {
      edges: posts.map((post) => ({
        cursor: post.id,
        node: post,
      })),
      pageInfo: {
        hasNextPage: first != null ? hasExtraNode : before != null,
        hasPreviousPage: first != null ? after != null : hasExtraNode,
        startCursor,
        endCursor,
      },
      count: totalCount,
    };
  }

  async listByAuthorId(authorId: string) {
    /*const posts = await prisma.post.findMany({
      where: {
        authorId
      }
    })*/

    const posts =
      (await prisma.user
        .findUnique({
          where: {
            id: authorId,
          },
        })
        .posts()) || [];

    //const posts = await listByAuthorIdDataLoader.load(authorId)

    return posts;
  }
  async update(id: string, data: UpdatePostInputModel) {
    const post = await prisma.post.update({
      data,
      where: {
        id,
      },
    });

    return post;
  }

  async feed(data: FeedPostInputModel): Promise<ConnectionModel<PostModel>> {
    const { where, order, connection } = data;
    const { first, last, after, before } = connection;
    const cursor = after || before;
    const take = first || last || 0;
    const direction = first ? "next" : "previous";

    /*const [posts, postsCount] = await prisma.$transaction([
      prisma.post.findMany({
        where,
        orderBy: order,
        cursor: cursor ? { id: cursor } : undefined,
        take: direction === "next" ? take + 1 : -take - 1,
        skip: after || before ? 1 : 0,
        select: {
          id: true,
          content: true,
          authorId: true,
          parentPostId: true,
          createdAt: true,
          _count: {
            select: {
              replies: true,
            },
          },
        },
      }),
      prisma.post.count({
        where,
      }),
    ]);*/

    const posts = await prisma.post.findMany({
      where,
      orderBy: order,
      cursor: cursor ? { id: cursor } : undefined,
      take: direction === "next" ? take + 1 : -take - 1,
      skip: after || before ? 1 : 0,
    });

    const hasExtraNode = posts.length > take;

    if (hasExtraNode) {
      if (first) {
        posts.pop();
      } else if (last) {
        posts.shift();
      }
    }

    const startCursor = !!posts.length ? posts[0].id : undefined;
    const endCursor = !!posts.length ? posts[posts.length - 1].id : undefined;

    return {
      edges: posts.map((post) => ({
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

  async reply(data: ReplyPostInputModel): Promise<PostModel> {
    const { authorId, content, postId } = data;
    const post = await prisma.post.create({
      data: {
        content,
        authorId,
        parentPostId: postId,
      },
      include: {
        parentPost: {
          select: {
            authorId: true,
          },
        },
      },
    });

    return post;
  }

  async listReplies(postId: string): Promise<PostModel[]> {
    const replies = await prisma.post
      .findUnique({
        where: {
          id: postId,
        },
      })
      .replies();

    return replies || [];
  }

  async countReplies(postId: string): Promise<number> {
    const count = await prisma.post.findUnique({
      where: {
        id: postId,
      },
      select: {
        _count: {
          select: {
            replies: true,
          },
        },
      },
    });

    return count?._count.replies || 0;
  }

  async like(userId: string, postId: string) {
    const like = await prisma.like.create({
      data: {
        userId,
        postId,
      },
    });

    return like;
  }
  async unlike(userId: string, postId: string) {
    const like = await prisma.like.deleteMany({
      where: {
        postId,
        userId,
      },
    });

    return like;
  }
  async countLikes(postId: string): Promise<number> {
    const count = await prisma.post.findUnique({
      where: {
        id: postId,
      },
      select: {
        _count: {
          select: {
            likes: true,
          },
        },
      },
    });

    return count?._count.likes || 0;
  }

  async byCurrentUser(userId: string, postId: string): Promise<boolean> {
    const data = await prisma.like.findFirst({
      where: {
        userId,
        postId,
      },
    });

    return !!data;
  }
}
