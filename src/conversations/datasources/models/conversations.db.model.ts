import { DeepPartial } from "@core/types/types";

export interface ConversationDBModel {
  id: string;
  type: string;
  createdAt: Date;
  description?: string | null;
  image?: string | null;
  title?: string | null;
  participants: ConversationParticipantDBModel[];
}

export interface CreateConversationDirectDBModel {
  id: string;
  type: string;
  createdAt: Date;
  participants: ConversationParticipantDBModel[];
}

export interface CreateConversationGroupDBModel {
  id: string;
  type: string;
  createdAt: Date;
  description: string | null;
  image: string | null;
  title: string | null;
}

export interface MessageDBModel {
  id: string;
  createdAt: Date;
  content: string;
  sender: MessageSenderDBModel;
  conversation?: ConversationDBModel;
}

export interface MessageSenderDBModel {
  id: string;
  name: string;
  username: string;
  avatar: string;
}

export interface ConversationParticipantDBModel {
  user: ConversationParticipantUserDBModel;
}

export interface ConversationParticipantUserDBModel {
  id: string;
  name: string;
  username: string;
  avatar: string;
}
