import { IProductRes } from "./product.type";
import { IUser } from "./user.type";

export interface IResOrder {
  _id: string;
  userId: string | IUser;
  customer: {
    name: string;
    phone: string;
    address: string;
  };
  nameProducts: string[];
  note: string;
  listProducts: TProductOrderItem<IProductRes>[];
  status:
    | "pending"
    | "confirmed"
    | "shipping"
    | "completed"
    | "cancelled"
    | "refund";
  paymentMethod: "cod" | "vnpay";
  paymentStatus: "pending" | "paid" | "cancelled";
  codePayment?: string;
  subTotal: number;
  shippingFee: number;
  total: number;
  reasonCanceled?: string;
  canceller?: string;
  canceled_at: Date;
  complete_at: Date;
  delivery_at: Date;
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
  status: "pending" | "confirmed" | "shipping" | "completed" | "cancelled";
  paymentMethod: "cod" | "vnpay";
  paymentStatus: "pending" | "paid" | "cancelled";
  codePayment?: string;
  subTotal: number;
  shippingFee: number;
  shippingUnit: string;
  delivery_at?: Date;
  total: number;
}

type TProductOrderItem<T> = {
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
  status: string;
}
