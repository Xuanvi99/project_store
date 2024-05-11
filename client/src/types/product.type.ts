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
  total: number;
  stocked: boolean;
}

export interface IFlashSale {
  productId: string | IProductRes;
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
  discount: number;
  sold: number;
  status: string;
  imageIds: [IImage];
  commentIds: IComment[];
  categoryId: { _id: string; name: string };
  inventoryId: IInventory;
  is_sale: "flashSale" | "sale" | "normal";
  flashSaleId?: IFlashSale;
  is_delete: boolean;
}

export type paramsListProduct = {
  activePage: number | 1;
  limit: number | 10;
  search: string;
};

export interface paramsFilterProduct extends paramsListProduct {
  sortBy: "news" | "sales" | "price" | "relevancy" | "";
  order: "asc" | "desc" | "";
  min_price: number;
  max_price: number;
}

export type paramsListSale = {
  activePage: number | 1;
  limit: number | 10;
  is_sale: "flashSale" | "sale";
};
