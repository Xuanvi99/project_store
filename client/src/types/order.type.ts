import { ICartItem } from "./cart.type";
import { IProductRes } from "./product.type";

export interface IOrder {
  _id: string;
  userId: string;
  customer: {
    name: string;
    phone: string;
    address: string;
  };
  note: string;
  listProduct: [TProductOrderItem];
  status: "pending" | "confirmed" | "shipping" | "completed" | "cancelled";
  paymentMethod: "cod" | "vnpay";
  paymentStatus: "pending" | "paid" | "cancelled";
  subTotal: number;
  shippingFee: number;
  discount: number;
  total: number;
  canceled_at: Date;
  complete_at: Date;
  delivery_at: Date;
}

type TProductOrderItem = {
  _id: string;
  productId: IProductRes;
  size: string;
  quantity: number;
  price: number;
};

export interface IOrderItem extends ICartItem {
  price: number;
  priceSale: number;
}
