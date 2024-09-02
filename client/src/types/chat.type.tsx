import { IImage } from "./commonType";

export interface IRoomChat {
  _id: string;
  participants: string[];
  totalMessage: number;
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
