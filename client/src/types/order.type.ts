import { IProductRes } from "./product.type";

export interface IResOrder {
  _id: string;
  userId: string;
  codeOrder: string;
  customer: {
    name: string;
    phone: string;
    address: string;
  };
  nameProducts: string[];
  note: string;
  listProducts: TProductOrderItem<IProductRes>[];
  quantityOrder: number;
  statusOrder:
    | "pending"
    | "confirmed"
    | "shipping"
    | "completed"
    | "cancelled"
    | "refund";
  paymentMethod: "cod" | "vnpay";
  paymentStatus: "pending" | "paid" | "cancelled";
  codeBill?: string;
  subTotal: number;
  shippingFee: number;
  shippingUnit: string;
  shippingCode?: string;
  total: number;
  reasonCanceled?: string;
  canceller?: { _id: string; role: "admin" | "user" };
  canceled_at: Date;
  complete_at: Date;
  delivery_at: Date;
  createdAt: Date;
}

export interface IReqOrder {
  userId: string;
  customer: {
    name: string;
    phone: string;
    address: string;
  };
  nameProducts: string[];
  note: string;
  listProducts: Omit<TProductOrderItem<string>, "_id">[];
  quantityOrder: number;
  statusOrder:
    | "pending"
    | "confirmed"
    | "shipping"
    | "completed"
    | "cancelled"
    | "refund";
  paymentMethod: "cod" | "vnpay";
  paymentStatus: "pending" | "paid" | "cancelled";
  codeBill?: string;
  shippingCode?: string;
  subTotal: number;
  shippingFee: number;
  shippingUnit: string;
  delivery_at?: Date;
  total: number;
}

export type TProductOrderItem<T> = {
  _id: string;
  productId: T;
  size: string;
  quantity: number;
  price: number;
  priceSale: number;
};

export interface IOrderItem {
  _id: string;
  productId: IProductRes;
  size: string;
  quantity: number;
  price: number;
  priceSale: number;
}

export interface paramsGetListOrder {
  activePage: number | 1;
  limit: number | 10;
  search: string;
  statusOrder: string;
}

export interface paramsGetListOrderFilter {
  activePage: number | 1;
  limit: number | 10;
  search: string;
  statusOrder: string;
  dateStart: Date | string;
  dateEnd: Date | string;
}

export interface IResStatisticsOrder {
  all: number;
  shipping: number;
  completed: number;
  pending: number;
  cancelled: number;
}
