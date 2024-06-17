import { IProductRes } from "./product.type";

export interface ICart {
  _id: string;
  userId: string;
  listProduct: ICartItem<IProductRes>[];
}

export interface ICartItem<T> {
  _id: string;
  productId: T;
  size: string;
  quantity: number;
}
