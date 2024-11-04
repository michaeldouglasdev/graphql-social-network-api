import { ConversationsDatasource } from "@conversations/datasources/conversations.datasource";
import { ConversationMapper } from "@conversations/datasources/mappers/conversations.mapper";
import {
  ConversationDirectModel,
  ConversationModel,
  ConversationsInputModel,
  CreateConversationDirectInputModel,
  MessageModel,
  MessagesInputModel,
  SendMessageInputModel,
} from "@conversations/models/conversations.model";
import { ConnectionModel } from "@core/connection/connection.model";

export class ConversationsRepository {
  async createConversationDirect(
    data: CreateConversationDirectInputModel
  ): Promise<ConversationModel> {
    const conversationsDataSource = new ConversationsDatasource();
    const createConversationDirectDB =
      await conversationsDataSource.createConversationDirect(data);
    const conversation =
      ConversationMapper.mapCreateConversationDirectDbToModel(
        createConversationDirectDB
      );
    return conversation;
  }

  async getConversationIdByUserId(senderId: string, receiverId: string) {
    const conversationsDatasource = new ConversationsDatasource();
    const id = await conversationsDatasource.getConversationIdByUserId(
      senderId,
      receiverId
    );
    return id;
  }

  async sendMessage(data: SendMessageInputModel): Promise<MessageModel> {
    const conversationsDataSource = new ConversationsDatasource();
    const message = await conversationsDataSource.sendMessage(data);
    const messageModel = ConversationMapper.mapMessageDbToModel(message);
    return messageModel;
  }

  async get(id: string): Promise<ConversationModel> {
    const conversationsDataSource = new ConversationsDatasource();
    const conversationDB = await conversationsDataSource.get(id);

    const conversationModel =
      ConversationMapper.mapConversationDbToModel(conversationDB);
    return conversationModel;
  }

  async getDirectByParticipant(
    id: string,
    receiverId: string
  ): Promise<ConversationModel | null> {
    const conversationsDataSource = new ConversationsDatasource();
    const conversationDB = await conversationsDataSource.getDirectByParticipant(
      id,
      receiverId
    );

    if (!conversationDB) {
      return null;
    }
    const conversationModel =
      ConversationMapper.mapConversationDbToModel(conversationDB);
    return conversationModel;
  }

  async list(
    userId: string,
    data: ConversationsInputModel
  ): Promise<ConnectionModel<ConversationModel>> {
    const conversationsDatasource = new ConversationsDatasource();
    const conversations = await conversationsDatasource.list(userId, data);
    return conversations;
  }

  async listConversationMessages(
    conversationId: string,
    data: MessagesInputModel
  ): Promise<ConnectionModel<MessageModel>> {
    const conversationsDataSource = new ConversationsDatasource();
    const messages = await conversationsDataSource.listConversationMessages(
      conversationId,
      data
    );

    const messagesEdge = messages.edges.map((edge) => ({
      cursor: edge.cursor,
      node: ConversationMapper.mapMessageDbToModel(edge.node),
    }));

    const connection = {
      ...messages,
      edges: messagesEdge,
    };

    return connection;
  }

  async listMessages(
    data: MessagesInputModel
  ): Promise<ConnectionModel<MessageModel>> {
    const conversationsDataSource = new ConversationsDatasource();
    const messages = await conversationsDataSource.listMessages(data);

    const messagesEdge = messages.edges.map((edge) => ({
      cursor: edge.cursor,
      node: ConversationMapper.mapMessageDbToModel(edge.node),
    }));

    const connection = {
      ...messages,
      edges: messagesEdge,
    };

    return connection;
  }
}
