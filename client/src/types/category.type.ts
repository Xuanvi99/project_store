import { IImage } from "./commonType";
import { IProductRes } from "./product.type";

export interface ICategory {
  _id: string;
  name: string;
  image: Omit<IImage, "_id" | "public_id">;
  productIds: IProductRes[];
}
