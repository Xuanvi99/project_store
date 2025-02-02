import { IImage } from "./commonType";

export interface IConversation {
  _id: string;
  participants: string[];
  totalMessage: number;
  messageLasterId: string;
}

export interface IMessage {
  _id: string;
  roomChatId: string;
  senderId: string;
  receiverId: string;
  messageType: ["text", "image"];
  text?: string;
  imageIds?: IImage[];
  receiverSeen: boolean;
  createdAt: Date;
}

export interface IReqSendMessageText {
  conversationId: string;
  senderId: string;
  receiverId: string;
  text: string;
  receiverSeen: boolean;
}
