import { ConnectionModel } from "@core/connection/connection.model";
import { NotificationDBDatasource } from "@notifications/datasources/notification.db.datasource";
import {
  CreateNotificationModel,
  NotificationModel,
  NotificationsInputModel,
} from "@notifications/models/notifications.model";

export class NotificationRepository {
  async create(data: CreateNotificationModel): Promise<NotificationModel> {
    const notificationDBDatasource = new NotificationDBDatasource();
    const notification = (await notificationDBDatasource.create(
      data
    )) as NotificationModel;

    return notification;
  }

  async listByUserId(
    userId: string,
    data: NotificationsInputModel
  ): Promise<ConnectionModel<NotificationModel>> {
    const notificationDBDatasource = new NotificationDBDatasource();
    const notifications = await notificationDBDatasource.listByUserId(
      userId,
      data
    );

    return notifications;
  }
}
