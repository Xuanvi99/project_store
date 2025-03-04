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
  messageType: "text" | "image";
  text?: string;
  imagesId?: IImage[];
  receiverSeen: boolean;
  createdAt: Date;
}

export interface IReqSendMessage {
  conversationId: string;
  senderId: string;
  receiverId: string;
  text?: string;
  images?: Array<Pick<IImage, "url" | "width" | "height">>;
  messageType: "text" | "image";
  receiverSeen: boolean;
}
