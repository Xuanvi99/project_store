import { IComment } from "./comment.type";
import { IImage } from "./commonType";

export interface IProductReq {
  name: string;
  summary: string;
  desc: string;
  brand: string;
  price: number;
  status: string;
  thumbnail: File | null;
  images: File[] | null;
  specs: string;
}

export interface IInventory {
  productId: string;
  sold: number;
  total: number;
  stocked: boolean;
}

export interface ISale {
  productId: string | IProductRes;
  status: string;
  quantity: number;
  sold: number;
  discount: number;
}

export interface IProductRes {
  _id: string;
  name: string;
  slug: string;
  summary: string;
  desc: string;
  brand: string;
  thumbnail: IImage;
  price: number;
  sold: number;
  status: string;
  imageIds: [IImage];
  commentIds: IComment[];
  categoryId: { _id: string; name: string };
  inventoryId: IInventory;
  is_sale: "flashSale" | "sale" | "normal";
  saleId?: ISale;
  is_delete: boolean;
}
