import { UserRoleModel as UserRole } from '@users/models/user.model';
import { GraphQLResolveInfo, GraphQLScalarType, GraphQLScalarTypeConfig } from 'graphql';
import { LoginModel } from '@users/models/login.model';
import { UserModel, UserRoleModel, LoginInputModel } from '@users/models/user.model';
import { PostModel, CreatePostInputModel, UpdatePostInputModel, ReplyPostInputModel } from '@posts/models/post.model';
import { StringFilterInputModel, DateTimeFilterInputModel } from '@core/filters/filters.model';
import { BaseNotificationModel, ReplyPostNotificationModel, NotificationsInputModel } from '@notifications/models/notifications.model';
import { Context } from '@context/type';
export type Maybe<T> = T | undefined;
export type InputMaybe<T> = T | undefined;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
export type RequireFields<T, K extends keyof T> = Omit<T, K> & { [P in K]-?: NonNullable<T[P]> };
export type EnumResolverSignature<T, AllowedValues = any> = { [key in keyof T]?: AllowedValues };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  File: { input: any; output: any; }
};

export enum CacheControlScope {
  PRIVATE = 'PRIVATE',
  PUBLIC = 'PUBLIC'
}

export type ConnectionInput = {
  after?: InputMaybe<Scalars['ID']['input']>;
  before?: InputMaybe<Scalars['ID']['input']>;
  first: Scalars['Int']['input'];
  last?: InputMaybe<Scalars['Int']['input']>;
};

export type CreatePostInput = {
  content: Scalars['String']['input'];
};

export type CreateUserInput = {
  email: Scalars['String']['input'];
  name: Scalars['String']['input'];
  password: Scalars['String']['input'];
  username: Scalars['String']['input'];
};

export enum DateFormat {
  FULL = 'FULL',
  LONG = 'LONG',
  MEDIUM = 'MEDIUM',
  SHORT = 'SHORT'
}

export type DateTimeFilterInput = {
  equals?: InputMaybe<Scalars['String']['input']>;
  gt?: InputMaybe<Scalars['String']['input']>;
  gte?: InputMaybe<Scalars['String']['input']>;
  in?: InputMaybe<Array<Scalars['String']['input']>>;
  lt?: InputMaybe<Scalars['String']['input']>;
  lte?: InputMaybe<Scalars['String']['input']>;
  not?: InputMaybe<Scalars['String']['input']>;
  notIn?: InputMaybe<Array<Scalars['String']['input']>>;
};

export type FeedPostInput = {
  connection: ConnectionInput;
  order?: InputMaybe<FeedPostOrderInput>;
  where?: InputMaybe<FeedPostWhereInput>;
};

export type FeedPostOrderInput = {
  content?: InputMaybe<OrderBy>;
  createdAt?: InputMaybe<OrderBy>;
};

export type FeedPostWhereInput = {
  authorId?: InputMaybe<StringFilterInput>;
  content?: InputMaybe<StringFilterInput>;
  createdAt?: InputMaybe<DateTimeFilterInput>;
  parentPostId?: InputMaybe<StringFilterInput>;
  postId?: InputMaybe<StringFilterInput>;
};

export type Follow = {
  __typename?: 'Follow';
  id: Scalars['ID']['output'];
  user: User;
};

export type FollowConnection = {
  __typename?: 'FollowConnection';
  byCurrentUser: Scalars['Boolean']['output'];
  count: Scalars['Int']['output'];
  edges: Array<FollowEdge>;
  pageInfo: PageInfo;
};

export type FollowEdge = {
  __typename?: 'FollowEdge';
  cursor: Scalars['ID']['output'];
  node: Follow;
};

export type FollowUserNotification = Notification & {
  __typename?: 'FollowUserNotification';
  createdAt: Scalars['String']['output'];
  fromUser: User;
  id: Scalars['ID']['output'];
};

export type Like = {
  __typename?: 'Like';
  createdAt: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  post: Post;
  user: User;
};

export type LikeConnection = {
  __typename?: 'LikeConnection';
  byCurrentUser: Scalars['Boolean']['output'];
  count: Scalars['Int']['output'];
  edges: Array<LikeEdge>;
  pageInfo: PageInfo;
};

export type LikeEdge = {
  __typename?: 'LikeEdge';
  cursor: Scalars['ID']['output'];
  node?: Maybe<Like>;
};

export type LikesInput = {
  connection: ConnectionInput;
  order?: InputMaybe<LikesOrderInput>;
  where?: InputMaybe<LikesWhereInput>;
};

export type LikesOrderInput = {
  createdAt?: InputMaybe<OrderBy>;
};

export type LikesWhereInput = {
  createdAt?: InputMaybe<DateTimeFilterInput>;
};

export type Login = {
  __typename?: 'Login';
  accessToken: Scalars['String']['output'];
  expirationTime: Scalars['String']['output'];
  user: User;
};

export type LoginInput = {
  password: Scalars['String']['input'];
  username: Scalars['String']['input'];
};

export type Mutation = {
  __typename?: 'Mutation';
  createPost: Post;
  createUser: User;
  followUser: Scalars['Boolean']['output'];
  likePost: Scalars['Boolean']['output'];
  login: Login;
  replyPost: Post;
  unfollowUser: Scalars['Boolean']['output'];
  unlikePost?: Maybe<Scalars['Boolean']['output']>;
  updatePost?: Maybe<Post>;
  updateUser: User;
  uploadAvatar: Scalars['String']['output'];
};


export type MutationCreatePostArgs = {
  data: CreatePostInput;
};


export type MutationCreateUserArgs = {
  data: CreateUserInput;
};


export type MutationFollowUserArgs = {
  id: Scalars['ID']['input'];
};


export type MutationLikePostArgs = {
  id: Scalars['ID']['input'];
};


export type MutationLoginArgs = {
  data: LoginInput;
};


export type MutationReplyPostArgs = {
  data: ReplyPostInput;
};


export type MutationUnfollowUserArgs = {
  id: Scalars['ID']['input'];
};


export type MutationUnlikePostArgs = {
  id: Scalars['ID']['input'];
};


export type MutationUpdatePostArgs = {
  data: UpdatePostInput;
  id: Scalars['ID']['input'];
};


export type MutationUpdateUserArgs = {
  data?: InputMaybe<UpdateUserInput>;
};


export type MutationUploadAvatarArgs = {
  file: Scalars['File']['input'];
};

export type Notification = {
  createdAt: Scalars['String']['output'];
  fromUser: User;
  id: Scalars['ID']['output'];
};

export type NotificationConnection = {
  __typename?: 'NotificationConnection';
  count: Scalars['Int']['output'];
  edges: Array<NotificationEdge>;
  pageInfo: PageInfo;
};

export type NotificationEdge = {
  __typename?: 'NotificationEdge';
  cursor: Scalars['ID']['output'];
  node: Notification;
};

export type NotificationsInput = {
  connection: ConnectionInput;
};

export enum OrderBy {
  ASC = 'ASC',
  DESC = 'DESC'
}

export type PageInfo = {
  __typename?: 'PageInfo';
  endCursor?: Maybe<Scalars['ID']['output']>;
  hasNextPage: Scalars['Boolean']['output'];
  hasPreviousPage: Scalars['Boolean']['output'];
  startCursor?: Maybe<Scalars['ID']['output']>;
};

export type Post = {
  __typename?: 'Post';
  author: User;
  content: Scalars['String']['output'];
  createdAt: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  likes: LikeConnection;
  parent?: Maybe<Post>;
  replies: PostConnection;
};


export type PostLikesArgs = {
  data?: InputMaybe<LikesInput>;
};


export type PostRepliesArgs = {
  data?: InputMaybe<FeedPostInput>;
};

export type PostConnection = {
  __typename?: 'PostConnection';
  count: Scalars['Int']['output'];
  edges: Array<PostEdge>;
  pageInfo: PageInfo;
};

export type PostEdge = {
  __typename?: 'PostEdge';
  cursor: Scalars['ID']['output'];
  node: Post;
};

export type PostsInput = {
  connection: ConnectionInput;
};

export type PrivateMessage = {
  __typename?: 'PrivateMessage';
  id: Scalars['ID']['output'];
  items: Array<PrivateMessageItem>;
};

export type PrivateMessageItem = {
  __typename?: 'PrivateMessageItem';
  author: User;
  content: Scalars['String']['output'];
  createdAt: Scalars['String']['output'];
  id: Scalars['ID']['output'];
};

export type Query = {
  __typename?: 'Query';
  feed: PostConnection;
  me: User;
  notifications: NotificationConnection;
  post: Post;
  posts: PostConnection;
  replies: PostConnection;
  user: User;
  users: Array<User>;
};


export type QueryFeedArgs = {
  data: FeedPostInput;
};


export type QueryNotificationsArgs = {
  data: NotificationsInput;
};


export type QueryPostArgs = {
  id: Scalars['ID']['input'];
};


export type QueryPostsArgs = {
  data: PostsInput;
};


export type QueryRepliesArgs = {
  data: FeedPostInput;
};


export type QueryUserArgs = {
  id: Scalars['ID']['input'];
};

export type RepliesInput = {
  connection: ConnectionInput;
  order?: InputMaybe<RepliesOrderInput>;
};

export type RepliesOrderInput = {
  content?: InputMaybe<OrderBy>;
  createdAt?: InputMaybe<OrderBy>;
};

export type ReplyPostInput = {
  content: Scalars['String']['input'];
  /** Parent Post ID */
  postId: Scalars['ID']['input'];
};

export type ReplyPostNotification = Notification & {
  __typename?: 'ReplyPostNotification';
  createdAt: Scalars['String']['output'];
  fromUser: User;
  id: Scalars['ID']['output'];
  post: Post;
};

export type StringFilterInput = {
  contains?: InputMaybe<Scalars['String']['input']>;
  endsWith?: InputMaybe<Scalars['String']['input']>;
  equals?: InputMaybe<Scalars['String']['input']>;
  in?: InputMaybe<Array<Scalars['String']['input']>>;
  not?: InputMaybe<Scalars['String']['input']>;
  notIn?: InputMaybe<Array<Scalars['String']['input']>>;
  startsWith?: InputMaybe<Scalars['String']['input']>;
};

export type Subscription = {
  __typename?: 'Subscription';
  notificationSubscribe: Notification;
};

export enum TimeFormat {
  FULL = 'FULL',
  LONG = 'LONG',
  MEDIUM = 'MEDIUM',
  SHORT = 'SHORT'
}

export type UpdatePostInput = {
  content: Scalars['String']['input'];
};

export type UpdateUserInput = {
  email?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  username?: InputMaybe<Scalars['String']['input']>;
};

export type User = {
  __typename?: 'User';
  avatar: Scalars['String']['output'];
  createdAt?: Maybe<Scalars['String']['output']>;
  email: Scalars['String']['output'];
  followers: FollowConnection;
  following: FollowConnection;
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  posts: PostConnection;
  role: UserRole;
  username: Scalars['String']['output'];
};


export type UserFollowersArgs = {
  data?: InputMaybe<UserFollowInput>;
};


export type UserFollowingArgs = {
  data?: InputMaybe<UserFollowInput>;
};


export type UserPostsArgs = {
  data: FeedPostInput;
};

export type UserFollowInput = {
  connection: ConnectionInput;
};

export { UserRole };



export type ResolverTypeWrapper<T> = Promise<T> | T;


export type ResolverWithResolve<TResult, TParent, TContext, TArgs> = {
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};
export type Resolver<TResult, TParent = {}, TContext = {}, TArgs = {}> = ResolverFn<TResult, TParent, TContext, TArgs> | ResolverWithResolve<TResult, TParent, TContext, TArgs>;

export type ResolverFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => Promise<TResult> | TResult;

export type SubscriptionSubscribeFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => AsyncIterable<TResult> | Promise<AsyncIterable<TResult>>;

export type SubscriptionResolveFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

export interface SubscriptionSubscriberObject<TResult, TKey extends string, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<{ [key in TKey]: TResult }, TParent, TContext, TArgs>;
  resolve?: SubscriptionResolveFn<TResult, { [key in TKey]: TResult }, TContext, TArgs>;
}

export interface SubscriptionResolverObject<TResult, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<any, TParent, TContext, TArgs>;
  resolve: SubscriptionResolveFn<TResult, any, TContext, TArgs>;
}

export type SubscriptionObject<TResult, TKey extends string, TParent, TContext, TArgs> =
  | SubscriptionSubscriberObject<TResult, TKey, TParent, TContext, TArgs>
  | SubscriptionResolverObject<TResult, TParent, TContext, TArgs>;

export type SubscriptionResolver<TResult, TKey extends string, TParent = {}, TContext = {}, TArgs = {}> =
  | ((...args: any[]) => SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>)
  | SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>;

export type TypeResolveFn<TTypes, TParent = {}, TContext = {}> = (
  parent: TParent,
  context: TContext,
  info: GraphQLResolveInfo
) => Maybe<TTypes> | Promise<Maybe<TTypes>>;

export type IsTypeOfResolverFn<T = {}, TContext = {}> = (obj: T, context: TContext, info: GraphQLResolveInfo) => boolean | Promise<boolean>;

export type NextResolverFn<T> = () => Promise<T>;

export type DirectiveResolverFn<TResult = {}, TParent = {}, TContext = {}, TArgs = {}> = (
  next: NextResolverFn<TResult>,
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;



/** Mapping between all available schema types and the resolvers types */
export type ResolversTypes = {
  Boolean: ResolverTypeWrapper<Scalars['Boolean']['output']>;
  CacheControlScope: CacheControlScope;
  ConnectionInput: ConnectionInput;
  CreatePostInput: ResolverTypeWrapper<CreatePostInputModel>;
  CreateUserInput: CreateUserInput;
  DateFormat: DateFormat;
  DateTimeFilterInput: ResolverTypeWrapper<DateTimeFilterInputModel>;
  FeedPostInput: FeedPostInput;
  FeedPostOrderInput: FeedPostOrderInput;
  FeedPostWhereInput: FeedPostWhereInput;
  File: ResolverTypeWrapper<Scalars['File']['output']>;
  Follow: ResolverTypeWrapper<Omit<Follow, 'user'> & { user: ResolversTypes['User'] }>;
  FollowConnection: ResolverTypeWrapper<Omit<FollowConnection, 'edges'> & { edges: Array<ResolversTypes['FollowEdge']> }>;
  FollowEdge: ResolverTypeWrapper<Omit<FollowEdge, 'node'> & { node: ResolversTypes['Follow'] }>;
  FollowUserNotification: ResolverTypeWrapper<Omit<FollowUserNotification, 'fromUser'> & { fromUser: ResolversTypes['User'] }>;
  ID: ResolverTypeWrapper<Scalars['ID']['output']>;
  Int: ResolverTypeWrapper<Scalars['Int']['output']>;
  Like: ResolverTypeWrapper<Omit<Like, 'post' | 'user'> & { post: ResolversTypes['Post'], user: ResolversTypes['User'] }>;
  LikeConnection: ResolverTypeWrapper<Omit<LikeConnection, 'edges'> & { edges: Array<ResolversTypes['LikeEdge']> }>;
  LikeEdge: ResolverTypeWrapper<Omit<LikeEdge, 'node'> & { node?: Maybe<ResolversTypes['Like']> }>;
  LikesInput: LikesInput;
  LikesOrderInput: LikesOrderInput;
  LikesWhereInput: LikesWhereInput;
  Login: ResolverTypeWrapper<LoginModel>;
  LoginInput: ResolverTypeWrapper<LoginInputModel>;
  Mutation: ResolverTypeWrapper<{}>;
  Notification: ResolverTypeWrapper<BaseNotificationModel>;
  NotificationConnection: ResolverTypeWrapper<Omit<NotificationConnection, 'edges'> & { edges: Array<ResolversTypes['NotificationEdge']> }>;
  NotificationEdge: ResolverTypeWrapper<Omit<NotificationEdge, 'node'> & { node: ResolversTypes['Notification'] }>;
  NotificationsInput: ResolverTypeWrapper<NotificationsInputModel>;
  OrderBy: OrderBy;
  PageInfo: ResolverTypeWrapper<PageInfo>;
  Post: ResolverTypeWrapper<PostModel>;
  PostConnection: ResolverTypeWrapper<Omit<PostConnection, 'edges'> & { edges: Array<ResolversTypes['PostEdge']> }>;
  PostEdge: ResolverTypeWrapper<Omit<PostEdge, 'node'> & { node: ResolversTypes['Post'] }>;
  PostsInput: PostsInput;
  PrivateMessage: ResolverTypeWrapper<Omit<PrivateMessage, 'items'> & { items: Array<ResolversTypes['PrivateMessageItem']> }>;
  PrivateMessageItem: ResolverTypeWrapper<Omit<PrivateMessageItem, 'author'> & { author: ResolversTypes['User'] }>;
  Query: ResolverTypeWrapper<{}>;
  RepliesInput: RepliesInput;
  RepliesOrderInput: RepliesOrderInput;
  ReplyPostInput: ResolverTypeWrapper<ReplyPostInputModel>;
  ReplyPostNotification: ResolverTypeWrapper<ReplyPostNotificationModel>;
  String: ResolverTypeWrapper<Scalars['String']['output']>;
  StringFilterInput: ResolverTypeWrapper<StringFilterInputModel>;
  Subscription: ResolverTypeWrapper<{}>;
  TimeFormat: TimeFormat;
  UpdatePostInput: ResolverTypeWrapper<UpdatePostInputModel>;
  UpdateUserInput: UpdateUserInput;
  User: ResolverTypeWrapper<UserModel>;
  UserFollowInput: UserFollowInput;
  UserRole: ResolverTypeWrapper<UserRoleModel>;
};

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = {
  Boolean: Scalars['Boolean']['output'];
  ConnectionInput: ConnectionInput;
  CreatePostInput: CreatePostInputModel;
  CreateUserInput: CreateUserInput;
  DateTimeFilterInput: DateTimeFilterInputModel;
  FeedPostInput: FeedPostInput;
  FeedPostOrderInput: FeedPostOrderInput;
  FeedPostWhereInput: FeedPostWhereInput;
  File: Scalars['File']['output'];
  Follow: Omit<Follow, 'user'> & { user: ResolversParentTypes['User'] };
  FollowConnection: Omit<FollowConnection, 'edges'> & { edges: Array<ResolversParentTypes['FollowEdge']> };
  FollowEdge: Omit<FollowEdge, 'node'> & { node: ResolversParentTypes['Follow'] };
  FollowUserNotification: Omit<FollowUserNotification, 'fromUser'> & { fromUser: ResolversParentTypes['User'] };
  ID: Scalars['ID']['output'];
  Int: Scalars['Int']['output'];
  Like: Omit<Like, 'post' | 'user'> & { post: ResolversParentTypes['Post'], user: ResolversParentTypes['User'] };
  LikeConnection: Omit<LikeConnection, 'edges'> & { edges: Array<ResolversParentTypes['LikeEdge']> };
  LikeEdge: Omit<LikeEdge, 'node'> & { node?: Maybe<ResolversParentTypes['Like']> };
  LikesInput: LikesInput;
  LikesOrderInput: LikesOrderInput;
  LikesWhereInput: LikesWhereInput;
  Login: LoginModel;
  LoginInput: LoginInputModel;
  Mutation: {};
  Notification: BaseNotificationModel;
  NotificationConnection: Omit<NotificationConnection, 'edges'> & { edges: Array<ResolversParentTypes['NotificationEdge']> };
  NotificationEdge: Omit<NotificationEdge, 'node'> & { node: ResolversParentTypes['Notification'] };
  NotificationsInput: NotificationsInputModel;
  PageInfo: PageInfo;
  Post: PostModel;
  PostConnection: Omit<PostConnection, 'edges'> & { edges: Array<ResolversParentTypes['PostEdge']> };
  PostEdge: Omit<PostEdge, 'node'> & { node: ResolversParentTypes['Post'] };
  PostsInput: PostsInput;
  PrivateMessage: Omit<PrivateMessage, 'items'> & { items: Array<ResolversParentTypes['PrivateMessageItem']> };
  PrivateMessageItem: Omit<PrivateMessageItem, 'author'> & { author: ResolversParentTypes['User'] };
  Query: {};
  RepliesInput: RepliesInput;
  RepliesOrderInput: RepliesOrderInput;
  ReplyPostInput: ReplyPostInputModel;
  ReplyPostNotification: ReplyPostNotificationModel;
  String: Scalars['String']['output'];
  StringFilterInput: StringFilterInputModel;
  Subscription: {};
  UpdatePostInput: UpdatePostInputModel;
  UpdateUserInput: UpdateUserInput;
  User: UserModel;
  UserFollowInput: UserFollowInput;
};

export type AuthDirectiveArgs = {
  roles?: Maybe<Array<UserRole>>;
};

export type AuthDirectiveResolver<Result, Parent, ContextType = Context, Args = AuthDirectiveArgs> = DirectiveResolverFn<Result, Parent, ContextType, Args>;

export type CacheControlDirectiveArgs = {
  maxAge?: Maybe<Scalars['Int']['input']>;
  scope?: Maybe<CacheControlScope>;
};

export type CacheControlDirectiveResolver<Result, Parent, ContextType = Context, Args = CacheControlDirectiveArgs> = DirectiveResolverFn<Result, Parent, ContextType, Args>;

export type DateDirectiveArgs = {
  dateFormat?: Maybe<DateFormat>;
  timeFormat?: Maybe<TimeFormat>;
};

export type DateDirectiveResolver<Result, Parent, ContextType = Context, Args = DateDirectiveArgs> = DirectiveResolverFn<Result, Parent, ContextType, Args>;

export type ValidateDirectiveArgs = {
  isEmail?: Maybe<Scalars['Boolean']['input']>;
  max?: Maybe<Scalars['Int']['input']>;
  maxLength?: Maybe<Scalars['Int']['input']>;
  min?: Maybe<Scalars['Int']['input']>;
  minLength?: Maybe<Scalars['Int']['input']>;
};

export type ValidateDirectiveResolver<Result, Parent, ContextType = Context, Args = ValidateDirectiveArgs> = DirectiveResolverFn<Result, Parent, ContextType, Args>;

export interface FileScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['File'], any> {
  name: 'File';
}

export type FollowResolvers<ContextType = Context, ParentType extends ResolversParentTypes['Follow'] = ResolversParentTypes['Follow']> = {
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  user?: Resolver<ResolversTypes['User'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type FollowConnectionResolvers<ContextType = Context, ParentType extends ResolversParentTypes['FollowConnection'] = ResolversParentTypes['FollowConnection']> = {
  byCurrentUser?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  count?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  edges?: Resolver<Array<ResolversTypes['FollowEdge']>, ParentType, ContextType>;
  pageInfo?: Resolver<ResolversTypes['PageInfo'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type FollowEdgeResolvers<ContextType = Context, ParentType extends ResolversParentTypes['FollowEdge'] = ResolversParentTypes['FollowEdge']> = {
  cursor?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  node?: Resolver<ResolversTypes['Follow'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type FollowUserNotificationResolvers<ContextType = Context, ParentType extends ResolversParentTypes['FollowUserNotification'] = ResolversParentTypes['FollowUserNotification']> = {
  createdAt?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  fromUser?: Resolver<ResolversTypes['User'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type LikeResolvers<ContextType = Context, ParentType extends ResolversParentTypes['Like'] = ResolversParentTypes['Like']> = {
  createdAt?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  post?: Resolver<ResolversTypes['Post'], ParentType, ContextType>;
  user?: Resolver<ResolversTypes['User'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type LikeConnectionResolvers<ContextType = Context, ParentType extends ResolversParentTypes['LikeConnection'] = ResolversParentTypes['LikeConnection']> = {
  byCurrentUser?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  count?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  edges?: Resolver<Array<ResolversTypes['LikeEdge']>, ParentType, ContextType>;
  pageInfo?: Resolver<ResolversTypes['PageInfo'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type LikeEdgeResolvers<ContextType = Context, ParentType extends ResolversParentTypes['LikeEdge'] = ResolversParentTypes['LikeEdge']> = {
  cursor?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  node?: Resolver<Maybe<ResolversTypes['Like']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type LoginResolvers<ContextType = Context, ParentType extends ResolversParentTypes['Login'] = ResolversParentTypes['Login']> = {
  accessToken?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  expirationTime?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  user?: Resolver<ResolversTypes['User'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type MutationResolvers<ContextType = Context, ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']> = {
  createPost?: Resolver<ResolversTypes['Post'], ParentType, ContextType, RequireFields<MutationCreatePostArgs, 'data'>>;
  createUser?: Resolver<ResolversTypes['User'], ParentType, ContextType, RequireFields<MutationCreateUserArgs, 'data'>>;
  followUser?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<MutationFollowUserArgs, 'id'>>;
  likePost?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<MutationLikePostArgs, 'id'>>;
  login?: Resolver<ResolversTypes['Login'], ParentType, ContextType, RequireFields<MutationLoginArgs, 'data'>>;
  replyPost?: Resolver<ResolversTypes['Post'], ParentType, ContextType, RequireFields<MutationReplyPostArgs, 'data'>>;
  unfollowUser?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<MutationUnfollowUserArgs, 'id'>>;
  unlikePost?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType, RequireFields<MutationUnlikePostArgs, 'id'>>;
  updatePost?: Resolver<Maybe<ResolversTypes['Post']>, ParentType, ContextType, RequireFields<MutationUpdatePostArgs, 'data' | 'id'>>;
  updateUser?: Resolver<ResolversTypes['User'], ParentType, ContextType, Partial<MutationUpdateUserArgs>>;
  uploadAvatar?: Resolver<ResolversTypes['String'], ParentType, ContextType, RequireFields<MutationUploadAvatarArgs, 'file'>>;
};

export type NotificationResolvers<ContextType = Context, ParentType extends ResolversParentTypes['Notification'] = ResolversParentTypes['Notification']> = {
  __resolveType: TypeResolveFn<'FollowUserNotification' | 'ReplyPostNotification', ParentType, ContextType>;
  createdAt?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  fromUser?: Resolver<ResolversTypes['User'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
};

export type NotificationConnectionResolvers<ContextType = Context, ParentType extends ResolversParentTypes['NotificationConnection'] = ResolversParentTypes['NotificationConnection']> = {
  count?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  edges?: Resolver<Array<ResolversTypes['NotificationEdge']>, ParentType, ContextType>;
  pageInfo?: Resolver<ResolversTypes['PageInfo'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type NotificationEdgeResolvers<ContextType = Context, ParentType extends ResolversParentTypes['NotificationEdge'] = ResolversParentTypes['NotificationEdge']> = {
  cursor?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  node?: Resolver<ResolversTypes['Notification'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type PageInfoResolvers<ContextType = Context, ParentType extends ResolversParentTypes['PageInfo'] = ResolversParentTypes['PageInfo']> = {
  endCursor?: Resolver<Maybe<ResolversTypes['ID']>, ParentType, ContextType>;
  hasNextPage?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  hasPreviousPage?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  startCursor?: Resolver<Maybe<ResolversTypes['ID']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type PostResolvers<ContextType = Context, ParentType extends ResolversParentTypes['Post'] = ResolversParentTypes['Post']> = {
  author?: Resolver<ResolversTypes['User'], ParentType, ContextType>;
  content?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  createdAt?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  likes?: Resolver<ResolversTypes['LikeConnection'], ParentType, ContextType, Partial<PostLikesArgs>>;
  parent?: Resolver<Maybe<ResolversTypes['Post']>, ParentType, ContextType>;
  replies?: Resolver<ResolversTypes['PostConnection'], ParentType, ContextType, Partial<PostRepliesArgs>>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type PostConnectionResolvers<ContextType = Context, ParentType extends ResolversParentTypes['PostConnection'] = ResolversParentTypes['PostConnection']> = {
  count?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  edges?: Resolver<Array<ResolversTypes['PostEdge']>, ParentType, ContextType>;
  pageInfo?: Resolver<ResolversTypes['PageInfo'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type PostEdgeResolvers<ContextType = Context, ParentType extends ResolversParentTypes['PostEdge'] = ResolversParentTypes['PostEdge']> = {
  cursor?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  node?: Resolver<ResolversTypes['Post'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type PrivateMessageResolvers<ContextType = Context, ParentType extends ResolversParentTypes['PrivateMessage'] = ResolversParentTypes['PrivateMessage']> = {
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  items?: Resolver<Array<ResolversTypes['PrivateMessageItem']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type PrivateMessageItemResolvers<ContextType = Context, ParentType extends ResolversParentTypes['PrivateMessageItem'] = ResolversParentTypes['PrivateMessageItem']> = {
  author?: Resolver<ResolversTypes['User'], ParentType, ContextType>;
  content?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  createdAt?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type QueryResolvers<ContextType = Context, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = {
  feed?: Resolver<ResolversTypes['PostConnection'], ParentType, ContextType, RequireFields<QueryFeedArgs, 'data'>>;
  me?: Resolver<ResolversTypes['User'], ParentType, ContextType>;
  notifications?: Resolver<ResolversTypes['NotificationConnection'], ParentType, ContextType, RequireFields<QueryNotificationsArgs, 'data'>>;
  post?: Resolver<ResolversTypes['Post'], ParentType, ContextType, RequireFields<QueryPostArgs, 'id'>>;
  posts?: Resolver<ResolversTypes['PostConnection'], ParentType, ContextType, RequireFields<QueryPostsArgs, 'data'>>;
  replies?: Resolver<ResolversTypes['PostConnection'], ParentType, ContextType, RequireFields<QueryRepliesArgs, 'data'>>;
  user?: Resolver<ResolversTypes['User'], ParentType, ContextType, RequireFields<QueryUserArgs, 'id'>>;
  users?: Resolver<Array<ResolversTypes['User']>, ParentType, ContextType>;
};

export type ReplyPostNotificationResolvers<ContextType = Context, ParentType extends ResolversParentTypes['ReplyPostNotification'] = ResolversParentTypes['ReplyPostNotification']> = {
  createdAt?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  fromUser?: Resolver<ResolversTypes['User'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  post?: Resolver<ResolversTypes['Post'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type SubscriptionResolvers<ContextType = Context, ParentType extends ResolversParentTypes['Subscription'] = ResolversParentTypes['Subscription']> = {
  notificationSubscribe?: SubscriptionResolver<ResolversTypes['Notification'], "notificationSubscribe", ParentType, ContextType>;
};

export type UserResolvers<ContextType = Context, ParentType extends ResolversParentTypes['User'] = ResolversParentTypes['User']> = {
  avatar?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  createdAt?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  email?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  followers?: Resolver<ResolversTypes['FollowConnection'], ParentType, ContextType, Partial<UserFollowersArgs>>;
  following?: Resolver<ResolversTypes['FollowConnection'], ParentType, ContextType, Partial<UserFollowingArgs>>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  posts?: Resolver<ResolversTypes['PostConnection'], ParentType, ContextType, RequireFields<UserPostsArgs, 'data'>>;
  role?: Resolver<ResolversTypes['UserRole'], ParentType, ContextType>;
  username?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type UserRoleResolvers = EnumResolverSignature<{ ADMIN?: any, DEFAULT?: any, VIP?: any }, ResolversTypes['UserRole']>;

export type Resolvers<ContextType = Context> = {
  File?: GraphQLScalarType;
  Follow?: FollowResolvers<ContextType>;
  FollowConnection?: FollowConnectionResolvers<ContextType>;
  FollowEdge?: FollowEdgeResolvers<ContextType>;
  FollowUserNotification?: FollowUserNotificationResolvers<ContextType>;
  Like?: LikeResolvers<ContextType>;
  LikeConnection?: LikeConnectionResolvers<ContextType>;
  LikeEdge?: LikeEdgeResolvers<ContextType>;
  Login?: LoginResolvers<ContextType>;
  Mutation?: MutationResolvers<ContextType>;
  Notification?: NotificationResolvers<ContextType>;
  NotificationConnection?: NotificationConnectionResolvers<ContextType>;
  NotificationEdge?: NotificationEdgeResolvers<ContextType>;
  PageInfo?: PageInfoResolvers<ContextType>;
  Post?: PostResolvers<ContextType>;
  PostConnection?: PostConnectionResolvers<ContextType>;
  PostEdge?: PostEdgeResolvers<ContextType>;
  PrivateMessage?: PrivateMessageResolvers<ContextType>;
  PrivateMessageItem?: PrivateMessageItemResolvers<ContextType>;
  Query?: QueryResolvers<ContextType>;
  ReplyPostNotification?: ReplyPostNotificationResolvers<ContextType>;
  Subscription?: SubscriptionResolvers<ContextType>;
  User?: UserResolvers<ContextType>;
  UserRole?: UserRoleResolvers;
};

export type DirectiveResolvers<ContextType = Context> = {
  auth?: AuthDirectiveResolver<any, any, ContextType>;
  cacheControl?: CacheControlDirectiveResolver<any, any, ContextType>;
  date?: DateDirectiveResolver<any, any, ContextType>;
  validate?: ValidateDirectiveResolver<any, any, ContextType>;
};
