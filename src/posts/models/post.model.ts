import {
  DateTimeFilterInputModel,
  OrderByModel,
  StringFilterInputModel,
} from "@core/filters/filters.model";
import { ConnectionInputModel } from "@core/connection/connection.model";
import { PostConnection } from "@generated/types";

export interface PostModel {
  id: string;
  content: string;
  createdAt: Date;
  authorId: string;
  parentPostId?: string | null;
}

export interface CreatePostInputModel {
  content: string;
  authorId: string;
}

export interface UpdatePostInputModel {
  content: string;
}

export interface ReplyPostInputModel {
  content: string;
  postId: string;
  authorId: string;
}

export interface FeedPostInputModel {
  where?: FeedPostWhereInputModel;
  order?: FeedPostOrderInputModel;
  connection: ConnectionInputModel;
}

export interface FeedPostWhereInputModel {
  authorId?: StringFilterInputModel;
  content?: StringFilterInputModel;
  postId?: StringFilterInputModel;
  parentPostId?: StringFilterInputModel;
  createdAt?: DateTimeFilterInputModel;
}

export interface FeedPostOrderInputModel {
  content?: OrderByModel;
  createdAt?: OrderByModel;
}

export interface PostsInputModel {
  connection: ConnectionInputModel;
}

export interface FeedModel {
  args: FeedPostInputModel;
}
