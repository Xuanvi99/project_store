import { IComment } from "./comment.type";
import { IImage } from "./commonType";
import { IUser } from "./user.type";

export type TParams<T> = {
  [P in keyof T]?: T[P];
};

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
  is_sale: boolean;
  deleted: boolean;
}

export interface IResProductDeleted extends IProductRes {
  deletedAt: Date;
  deletedBy: Pick<IUser, "_id" | "userName" | "role">;
}

export type TParamsListProduct = {
  activePage: number | 1;
  limit: number | 10;
  search: string;
  productId?: string;
  is_sale?: boolean;
  status?: "active" | "inactive" | "deleted";
};

export interface TParamsFilterProduct
  extends Omit<TParamsListProduct, "productId"> {
  sortBy: "news" | "sales" | "price" | "relevancy" | "";
  order: "asc" | "desc" | "";
  min_price?: number;
  max_price?: number;
}

export interface IParamsFilterProductDashboard
  extends Omit<TParamsListProduct, "productId" | "status"> {
  sortBy: "news" | "sales" | "price" | "relevancy" | "";
  order: "asc" | "desc" | "";
  status: "" | "active" | "inactive" | "deleted";
  deleted: boolean;
}

export type TParamsListSale = {
  activePage: number | 1;
  limit: number | 10;
  is_sale: boolean;
};

export type productItem = {
  _id: string;
  productId: string;
  size: string;
  quantity: number;
};

export type TResStatisticsProduct = {
  all: number;
  active: number;
  inactive: number;
  deleted: number;
};
