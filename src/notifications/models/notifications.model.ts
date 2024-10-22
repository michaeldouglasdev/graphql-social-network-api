import { ConnectionInputModel } from "@core/connection/connection.model";

export type BaseNotificationModel = {
  id: string;
  type: NotificationTypeModel;
  createdAt: Date;
  fromUserId: string;
  toUserId: string;
};

export type ReplyPostNotificationModel = BaseNotificationModel & {
  type: NotificationTypeModel.REPLY_POST_NOTIFICATION;
  postId: string;
};

export type NotificationModel =
  | BaseNotificationModel
  | ReplyPostNotificationModel;

export interface CreateNotificationModel {
  type: NotificationTypeModel;
  fromUserId: string;
  postId?: string;
  toUserId: string;
}

export interface NotificationsInputModel {
  connection: ConnectionInputModel;
}
export enum NotificationTypeModel {
  REPLY_POST_NOTIFICATION = "REPLY_POST_NOTIFICATION",
  FOLLOW_USER_NOTIFICATION = "FOLLOW_USER_NOTIFICATION",
}

export function isPostReplyNotification(
  notification: BaseNotificationModel
): notification is ReplyPostNotificationModel {
  return notification.type === NotificationTypeModel.REPLY_POST_NOTIFICATION;
}
