import { IImage } from "./commonType";

export interface IRoomChat<T> {
  _id: string;
  participants: T[];
  totalMessage: number;
  messageLaster: IMessage;
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
}
