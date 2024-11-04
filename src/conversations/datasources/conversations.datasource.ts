import {
  ConversationsInputModel,
  ConversationModel,
  ConversationTypeModel,
  CreateConversationDirectInputModel,
  MessageModel,
  SendMessageInputModel,
  MessagesInputModel,
} from "@conversations/models/conversations.model";
import { prisma } from "@core/services/prisma.service";
import {
  ConversationDBModel,
  CreateConversationDirectDBModel,
  MessageDBModel,
} from "./models/conversations.db.model";
import { ConnectionModel } from "@core/connection/connection.model";
import { ConversationMapper } from "./mappers/conversations.mapper";

export class ConversationsDatasource {
  async createConversationDirect(
    data: CreateConversationDirectInputModel
  ): Promise<CreateConversationDirectDBModel> {
    const { receiverId, senderId } = data;

    const conversation = await prisma.conversation.create({
      data: {
        type: ConversationTypeModel.DIRECT,
        participants: {
          create: [
            { user: { connect: { id: senderId } } },
            { user: { connect: { id: receiverId } } },
          ],
        },
      },
      select: {
        id: true,
        type: true,
        createdAt: true,
        participants: {
          select: {
            user: {
              select: {
                id: true,
                avatar: true,
                name: true,
                username: true,
              },
            },
          },
        },
      },
    });

    return conversation;
  }

  async get(id: string): Promise<ConversationDBModel> {
    const conversation = await prisma.conversation.findUnique({
      where: {
        id,
      },
      select: {
        id: true,
        createdAt: true,
        description: true,
        image: true,
        title: true,
        type: true,
        participants: {
          select: {
            user: {
              select: {
                id: true,
                name: true,
                avatar: true,
                username: true,
              },
            },
          },
        },
      },
    });

    return conversation!;
  }

  async getDirectByParticipant(meId: string, receiverId: string) {
    const conversation = await prisma.conversation.findFirst({
      where: {
        type: "DIRECT",
        participants: {
          every: {
            userId: {
              in: [meId, receiverId],
            },
          },
        },
      },
      select: {
        id: true,
        createdAt: true,
        description: true,
        image: true,
        title: true,
        type: true,
        participants: {
          select: {
            user: {
              select: {
                id: true,
                name: true,
                avatar: true,
                username: true,
              },
            },
          },
        },
      },
    });
    return conversation;
  }
  async list(
    userId: string,
    data: ConversationsInputModel
  ): Promise<ConnectionModel<ConversationModel>> {
    const { connection } = data;
    const { first, last, after, before } = connection;
    const cursor = after || before;
    const take = first || last || 0;
    const direction = first ? "next" : "previous";

    const nodes = await prisma.conversation.findMany({
      where: {
        participants: {
          some: {
            userId,
          },
        },
        messages: {
          some: {},
        },
      },
      cursor: cursor ? { id: cursor } : undefined,
      take: direction === "next" ? take + 1 : -take - 1,
      skip: after || before ? 1 : 0,
      select: {
        id: true,
        createdAt: true,
        description: true,
        image: true,
        title: true,
        type: true,
        participants: {
          select: {
            user: {
              select: {
                id: true,
                name: true,
                avatar: true,
                username: true,
              },
            },
          },
        },
      },
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
    const conversationModel =
      ConversationMapper.mapConversationDbToModelList(nodes);

    return {
      edges: conversationModel.map((node) => ({
        cursor: node.id,
        node: node,
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

  async sendMessage(data: SendMessageInputModel): Promise<MessageDBModel> {
    const { message, senderId, conversationId } = data;

    const messageDb = await prisma.message.create({
      data: {
        content: message,
        senderId,
        conversationId,
      },
      select: {
        id: true,
        content: true,
        createdAt: true,
        sender: {
          select: {
            id: true,
            name: true,
            username: true,
            avatar: true,
          },
        },
        conversation: {
          select: {
            createdAt: true,
            id: true,
            type: true,
            participants: {
              select: {
                user: {
                  select: {
                    id: true,
                    createdAt: true,
                    avatar: true,
                    name: true,
                    username: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    return messageDb;
  }

  async getConversationIdByUserId(
    senderId: string,
    receiverId: string
  ): Promise<string | undefined> {
    const conversation = await prisma.conversation.findFirst({
      where: {
        participants: {
          every: {
            userId: {
              in: [senderId, receiverId],
            },
          },
        },
      },
      select: {
        id: true,
      },
    });

    return conversation?.id;
  }

  async listConversationMessages(
    conversationId: string,
    data: MessagesInputModel
  ): Promise<ConnectionModel<MessageDBModel>> {
    const { where, connection, order } = data;
    const { first, last, after, before } = connection;
    const cursor = after || before;
    const take = first || last || 0;
    const direction = first ? "next" : "previous";

    const nodes =
      (await prisma.conversation
        .findUnique({
          where: {
            id: conversationId,
          },
        })
        .messages({
          cursor: cursor ? { id: cursor } : undefined,
          take: direction === "next" ? take + 1 : -take - 1,
          skip: after || before ? 1 : 0,
          where,
          orderBy: order,
          select: {
            id: true,
            content: true,
            createdAt: true,
            sender: {
              select: {
                id: true,
                name: true,
                username: true,
                avatar: true,
              },
            },
          },
        })) || [];

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
      edges: nodes.map((node) => ({
        cursor: node.id,
        node: node,
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

  async listMessages(data: MessagesInputModel) {
    const { where, connection, order } = data;
    const { first, last, after, before } = connection;
    const cursor = after || before;
    const take = first || last || 0;
    const direction = first ? "next" : "previous";

    const nodes =
      (await prisma.message.findMany({
        cursor: cursor ? { id: cursor } : undefined,
        take: direction === "next" ? take + 1 : -take - 1,
        skip: after || before ? 1 : 0,
        where,
        orderBy: order,
        select: {
          id: true,
          content: true,
          createdAt: true,
          sender: {
            select: {
              id: true,
              name: true,
              username: true,
              avatar: true,
            },
          },
        },
      })) || [];

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
      edges: nodes.map((node) => ({
        cursor: node.id,
        node: node,
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
