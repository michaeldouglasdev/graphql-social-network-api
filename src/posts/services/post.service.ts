import { ConnectionModel } from "@core/connection/connection.model";
import {
  CreatePostInputModel,
  PostModel,
  PostsInputModel,
  ReplyPostInputModel,
  FeedPostInputModel,
  UpdatePostInputModel,
} from "@posts/models/post.model";
import { PostRepository } from "@posts/repositories/post.repository";

export class PostService {
  async list(data: PostsInputModel): Promise<ConnectionModel<PostModel>> {
    const postRepository = new PostRepository();
    const posts = await postRepository.list(data);
    return posts;
  }

  async listByAuthorId(authorId: string) {
    const postRepository = new PostRepository();
    const posts = await postRepository.listByAuthorId(authorId);

    return posts;
  }
  async get(id: string): Promise<PostModel> {
    const postRepository = new PostRepository();
    const post = await postRepository.get(id);
    return post;
  }

  async create(data: CreatePostInputModel): Promise<PostModel> {
    const postRepository = new PostRepository();
    const post = await postRepository.create(data);

    return post;
  }

  async update(id: string, data: UpdatePostInputModel): Promise<PostModel> {
    const postRepository = new PostRepository();
    const post = await postRepository.update(id, data);

    return post;
  }

  async feed(data: FeedPostInputModel): Promise<ConnectionModel<PostModel>> {
    const postRepository = new PostRepository();
    const posts = await postRepository.feed(data);
    return posts;
  }

  async reply(data: ReplyPostInputModel): Promise<PostModel> {
    const postRepository = new PostRepository();
    const reply = await postRepository.reply(data);

    return reply;
  }

  async listReplies(postId: string): Promise<PostModel[]> {
    const postRepository = new PostRepository();
    const replies = await postRepository.listReplies(postId);

    return replies;
  }

  async countReplies(postId: string): Promise<number> {
    const postRepository = new PostRepository();
    const count = await postRepository.countReplies(postId);
    return count;
  }

  async countLikes(postId: string): Promise<number> {
    const postRepository = new PostRepository();
    const count = await postRepository.countLikes(postId);

    return count;
  }

  async like(userId: string, postId: string) {
    const postRepository = new PostRepository();
    const like = await postRepository.like(userId, postId);

    return like;
  }

  async likedByCurrentUser(userId: string, postId: string) {
    const postRepository = new PostRepository();
    return await postRepository.likedByCurrentUser(userId, postId);
  }

  async unlike(userId: string, postId: string) {
    const postRepository = new PostRepository();
    const like = await postRepository.unlike(userId, postId);

    return like;
  }
}
