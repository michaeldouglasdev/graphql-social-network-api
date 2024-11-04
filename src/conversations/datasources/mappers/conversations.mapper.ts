import {
  ConversationModel,
  ConversationParticipantModel,
  ConversationTypeModel,
  MessageModel,
} from "@conversations/models/conversations.model";
import {
  ConversationDBModel,
  ConversationParticipantDBModel,
  CreateConversationDirectDBModel,
  MessageDBModel,
  MessageSenderDBModel,
} from "../models/conversations.db.model";
import { UserModel } from "@users/models/user.model";

export class ConversationMapper {
  static mapCreateConversationDirectDbToModel(
    conversation: CreateConversationDirectDBModel
  ) {
    const { id, createdAt, type, participants } = conversation;
    const conversationModel: ConversationModel = {
      id,
      createdAt,
      type:
        type === ConversationTypeModel.DIRECT
          ? ConversationTypeModel.DIRECT
          : ConversationTypeModel.GROUP,
      participants: participants.map((participant) =>
        this.mapConversationParticipantDBToModel(participant)
      ),
    };

    return conversationModel;
  }
  static mapCreateConversationDirectDbToModelList(
    listCreateConversationDirectDb: CreateConversationDirectDBModel[]
  ) {
    return listCreateConversationDirectDb.map((conversation) =>
      this.mapCreateConversationDirectDbToModel(conversation)
    );
  }

  static mapConversationDbToModel(
    conversation: ConversationDBModel
  ): ConversationModel {
    const { id, createdAt, type, title, description, image, participants } =
      conversation;
    const conversationModel: ConversationModel = {
      id,
      createdAt,
      description,
      image,
      title,
      type:
        type === ConversationTypeModel.DIRECT
          ? ConversationTypeModel.DIRECT
          : ConversationTypeModel.GROUP,
      participants: participants.map((participant) =>
        this.mapConversationParticipantDBToModel(participant)
      ),
    };

    return conversationModel;
  }

  static mapConversationDbToModelList(
    conversationDbList: ConversationDBModel[]
  ) {
    return conversationDbList.map((conversation) =>
      this.mapConversationDbToModel(conversation)
    );
  }
  static mapMessageDbToModel(messageDb: MessageDBModel) {
    const { id, content, createdAt, sender, conversation } = messageDb;

    const participantsIds = conversation?.participants?.map(
      (participant) => participant?.user?.id
    );
    const message: MessageModel = {
      id,
      content,
      createdAt,
      sender: this.mapMessageSenderDbToModel(sender),
      participantsIds,
    };

    return message;
  }

  static mapMessageDbToModelList(messageDbList: MessageDBModel[]) {
    return messageDbList.map((message) => this.mapMessageDbToModel(message));
  }

  static mapMessageSenderDbToModel(messageSender: MessageSenderDBModel) {
    const { id, name, avatar, username } = messageSender;
    const user: UserModel = {
      id,
      name,
      avatar,
      username,
    };

    return user;
  }

  static mapConversationParticipantDBToModel(
    conversationParticipant: ConversationParticipantDBModel
  ) {
    const { id, name, username, avatar } = conversationParticipant.user;

    const conversationParticipantModel: ConversationParticipantModel = {
      id,
      name,
      avatar,
      username,
    };

    return conversationParticipantModel;
  }
}
