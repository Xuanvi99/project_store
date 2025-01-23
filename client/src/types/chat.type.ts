import { IImage } from "./commonType";

export interface IConversation {
  _id: string;
  participants: string[];
  totalMessage: number;
  messageLaster: string;
}

export interface IMessage {
  _id: string;
  roomChatId: string;
  senderId: string;
  receiverId: string;
  messageType: ["text", "image"];
  text?: string;
  imageIds?: IImage[];
  seen: boolean;
  createdAt: Date;
}

export interface IReqSendMessageText {
  conversationId: string;
  senderId: string;
  receiverId: string;
  text: string;
}
