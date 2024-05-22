import { IProductRes } from "./product.type";

export interface ICart {
  _id: string;
  userId: string;
  listProduct: ICartItem[];
}

export interface ICartItem {
  _id: string;
  productId: IProductRes;
  size: string;
  quantity: number;
}
