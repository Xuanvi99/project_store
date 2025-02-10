import { IImage } from "./commonType";

export interface IConversation<T> {
  _id: string;
  participants: T[];
  totalMessage: number;
  messageLasterId: string;
}

export interface IMessage<T> {
  _id: string;
  roomChatId: string;
  senderId: T;
  receiverId: T;
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
