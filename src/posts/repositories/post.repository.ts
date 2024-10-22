import { ConnectionModel } from "@core/connection/connection.model";
import { FeedPostInput } from "@generated/types";
import { PostDBDatasource } from "@posts/datasources/post.db.datasource";
import {
  CreatePostInputModel,
  PostModel,
  PostsInputModel,
  ReplyPostInputModel,
  FeedPostInputModel,
  UpdatePostInputModel,
} from "@posts/models/post.model";

export class PostRepository {
  async create(data: CreatePostInputModel): Promise<PostModel> {
    const postDBDatasource = new PostDBDatasource();
    const post = await postDBDatasource.create(data);
    return post;
  }

  async get(id: string): Promise<PostModel> {
    const postDBDatasource = new PostDBDatasource();
    const post = await postDBDatasource.get(id);
    return post!;
  }

  async list(data: PostsInputModel): Promise<ConnectionModel<PostModel>> {
    const postDBDatasource = new PostDBDatasource();
    const posts = await postDBDatasource.list(data);

    return posts;
  }

  async listByAuthorId(authorId: string): Promise<PostModel[]> {
    const postDBDatasource = new PostDBDatasource();
    const posts = await postDBDatasource.listByAuthorId(authorId);

    return posts;
  }

  async update(id: string, data: UpdatePostInputModel): Promise<PostModel> {
    const postDBDatasource = new PostDBDatasource();
    const post = await postDBDatasource.update(id, data);

    return post;
  }

  async feed(data: FeedPostInputModel): Promise<ConnectionModel<PostModel>> {
    const postDBDatasource = new PostDBDatasource();
    const posts = await postDBDatasource.feed(data);
    return posts;
  }

  async reply(data: ReplyPostInputModel): Promise<PostModel> {
    const postDBDatasource = new PostDBDatasource();
    const reply = await postDBDatasource.reply(data);

    return reply;
  }

  async listReplies(postId: string): Promise<PostModel[]> {
    const postDBDatasource = new PostDBDatasource();
    const replies = await postDBDatasource.listReplies(postId);
    return replies;
  }

  async countReplies(postId: string): Promise<number> {
    const postDBDatasource = new PostDBDatasource();
    const count = await postDBDatasource.countReplies(postId);
    return count;
  }

  async like(userId: string, postId: string) {
    const postDBDatasource = new PostDBDatasource();
    const like = await postDBDatasource.like(userId, postId);
    return like;
  }
  async unlike(userId: string, postId: string) {
    const postDBDatasource = new PostDBDatasource();
    const like = await postDBDatasource.unlike(userId, postId);
    return like;
  }
  async countLikes(postId: string): Promise<number> {
    const postDBDatasource = new PostDBDatasource();
    const count = await postDBDatasource.countLikes(postId);

    return count;
  }

  async likedByCurrentUser(userId: string, postId: string): Promise<boolean> {
    const postDBDatasource = new PostDBDatasource();
    return await postDBDatasource.byCurrentUser(userId, postId);
  }
}
