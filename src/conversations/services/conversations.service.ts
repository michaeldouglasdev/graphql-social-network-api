import {
  ConversationDirectModel,
  ConversationModel,
  ConversationsInputModel,
  CreateConversationDirectInputModel,
  MessageModel,
  MessagesInputModel,
  SendMessageInputModel,
} from "@conversations/models/conversations.model";
import { ConversationsRepository } from "@conversations/repositories/conversations.repository";
import { ConnectionModel } from "@core/connection/connection.model";

export class ConversationsService {
  async createConversationDirect(
    data: CreateConversationDirectInputModel
  ): Promise<ConversationDirectModel> {
    const conversationsRepository = new ConversationsRepository();
    const direct = await conversationsRepository.getDirectByParticipant(
      data.senderId,
      data.receiverId
    );

    if (direct) {
      return direct;
    }
    const conversation = await conversationsRepository.createConversationDirect(
      data
    );

    return conversation;
  }

  async sendMessage(data: SendMessageInputModel): Promise<MessageModel> {
    const conversationRepository = new ConversationsRepository();
    const message = await conversationRepository.sendMessage(data);
    return message;
  }

  async get(id: string): Promise<ConversationModel> {
    const conversationRepository = new ConversationsRepository();
    const conversation = await conversationRepository.get(id);
    return conversation;
  }

  async getDirectByParticipant(
    id: string,
    receiverId: string
  ): Promise<ConversationModel | null> {
    const conversationRepository = new ConversationsRepository();
    const conversation = await conversationRepository.getDirectByParticipant(
      id,
      receiverId
    );
    return conversation;
  }

  async list(userId: string, data: ConversationsInputModel) {
    const conversationsRepository = new ConversationsRepository();
    const conversations = await conversationsRepository.list(userId, data);
    return conversations;
  }

  async listConversationMessages(
    conversationId: string,
    data: MessagesInputModel
  ): Promise<ConnectionModel<MessageModel>> {
    const conversationsRepository = new ConversationsRepository();
    const messages = await conversationsRepository.listConversationMessages(
      conversationId,
      data
    );
    return messages;
  }

  async listMessages(
    data: MessagesInputModel
  ): Promise<ConnectionModel<MessageModel>> {
    const conversationsRepository = new ConversationsRepository();
    const messages = await conversationsRepository.listMessages(data);
    return messages;
  }
}
