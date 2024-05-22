import { IImage } from "./commonType";
import { IUser } from "./user.type";

export interface IComment {
  _id: string;
  userId: IUser;
  productId: string;
  imageIds: IImage[];
  status: boolean;
  content: string;
  star: number;
  like: number;
  reply: string;
}
