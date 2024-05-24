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

export interface IProductRes {
  _id: string;
  name: string;
  slug: string;
  desc: string;
  brand: string;
  thumbnail: IImage;
  price: number;
  priceSale: number;
  sold: number;
  status: string;
  imageIds: IImage[];
  commentIds: IComment[];
  categoryId: { _id: string; name: string };
  inventoryId: IInventory;
  is_sale: "sale" | "normal";
  is_delete: boolean;
}

export type paramsListProduct = {
  activePage: number | 1;
  limit: number | 10;
  search: string;
  productId?: string;
};

export interface paramsFilterProduct
  extends Omit<paramsListProduct, "productId"> {
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

export type productItem = {
  _id: string;
  productId: string;
  size: string;
  quantity: number;
};
