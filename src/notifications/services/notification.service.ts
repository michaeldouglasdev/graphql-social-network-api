import { ConnectionModel } from "@core/connection/connection.model";
import {
  CreateNotificationModel,
  NotificationModel,
  NotificationsInputModel,
} from "@notifications/models/notifications.model";
import { NotificationRepository } from "@notifications/repository/notification.repository";

export class NotificationService {
  async create(data: CreateNotificationModel): Promise<NotificationModel> {
    const notificationRepository = new NotificationRepository();
    const notification = await notificationRepository.create(data);

    return notification;
  }

  async listByUserId(
    userId: string,
    data: NotificationsInputModel
  ): Promise<ConnectionModel<NotificationModel>> {
    const notificationRepository = new NotificationRepository();
    const notifications = await notificationRepository.listByUserId(
      userId,
      data
    );

    return notifications;
  }
}
