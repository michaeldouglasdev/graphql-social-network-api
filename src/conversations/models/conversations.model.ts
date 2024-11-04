import {
  ConnectionInputModel,
  ConnectionModel,
} from "@core/connection/connection.model";
import {
  OrderByModel,
  StringFilterInputModel,
} from "@core/filters/filters.model";
import { DeepPartial } from "@core/types/types";
import { UserModel } from "@users/models/user.model";

export interface ConversationModel {
  id: string;
  createdAt: Date;
  type: ConversationTypeModel;
  messages?: ConnectionModel<MessageModel>;
  title?: string | null;
  description?: string | null;
  image?: string | null;
  participants: ConversationParticipantModel[];
}

export interface ConversationDirectModel extends ConversationModel {}

export interface ConversationGroupModel extends ConversationModel {
  title?: string;
  description?: string;
  image?: string;
}
export enum ConversationTypeModel {
  DIRECT = "DIRECT",
  GROUP = "GROUP",
}
export interface CreateConversationDirectInputModel {
  receiverId: string;
  senderId: string;
}
export interface CreateConversationGroupInputModel {
  participantIds: string[];
  title: string;
  description: string;
  image?: string;
}

export interface SendMessageInputModel {
  //target: SendMessageTargetInputModel;
  conversationId: string;
  message: string;
  senderId: string;
}

export interface SendMessageTargetInputModel {
  conversationId?: string;
  userId?: string;
}

export interface MessageModel {
  id: string;
  content: string;
  createdAt: Date;
  sender: UserModel;
  participantsIds?: string[];
}

export interface ConversationsInputModel {
  //where: ConversationWhereInputModel;
  connection: ConnectionInputModel;
}

export interface ConversationWhereInputModel {
  name: StringFilterInputModel;
}

export interface MessagesInputModel {
  where?: MessagesWhereInputModel;
  connection: ConnectionInputModel;
  order?: MessagesOrderInputModel;
}

export interface MessagesWhereInputModel {
  conversationId?: StringFilterInputModel;
}
export interface MessagesOrderInputModel {
  createdAt?: OrderByModel;
}
export interface ConversationParticipantModel {
  id: string;
  name: string;
  username: string;
  avatar: string;
}
