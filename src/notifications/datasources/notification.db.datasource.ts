import { ConnectionModel } from "@core/connection/connection.model";
import { prisma } from "@core/services/prisma.service";
import {
  CreateNotificationModel,
  NotificationModel,
  NotificationsInputModel,
} from "notifications/models/notifications.model";

export class NotificationDBDatasource {
  async create(data: CreateNotificationModel) {
    const notification = await prisma.notification.create({
      data: {
        type: data.type as string,
        fromUserId: data.fromUserId,
        toUserId: data.toUserId,
        postId: data.postId,
      },
    });

    return notification;
  }

  async listByUserId(
    userId: string,
    data: NotificationsInputModel
  ): Promise<ConnectionModel<NotificationModel>> {
    const { connection } = data;
    const { first, last, after, before } = connection;
    const cursor = after || before;
    const take = first || last || 0;
    const direction = first ? "next" : "previous";

    const notifications = (await prisma.user
      .findUnique({
        where: {
          id: userId,
        },
      })
      .notificationsReceived({
        orderBy: {
          createdAt: "desc",
        },
        cursor: cursor ? { id: cursor } : undefined,
        take: direction === "next" ? take + 1 : -take - 1,
        skip: after || before ? 1 : 0,
      })) as NotificationModel[];

    const hasExtraNode = notifications.length > take;

    if (hasExtraNode) {
      if (first) {
        notifications.pop();
      } else if (last) {
        notifications.shift();
      }
    }

    const startCursor = !!notifications.length
      ? notifications[0].id
      : undefined;
    const endCursor = !!notifications.length
      ? notifications[notifications.length - 1].id
      : undefined;

    return {
      edges: notifications.map((notification) => ({
        cursor: notification.id,
        node: notification,
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
}
