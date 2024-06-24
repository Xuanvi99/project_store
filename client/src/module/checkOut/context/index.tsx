import { useAppSelector } from "@/hook";
import { IOrderItem, IReqOrder } from "@/types/order.type";
import { createContext, useEffect, useState } from "react";
import { RootState } from "../../../stores/index";

export type ICheckoutProvide = {
  reqOrder: IReqOrder;
  listProductOrder: IOrderItem[];
  quantityProductOrder: number;
  totalPayment: number;
  totalPriceOrder: number;
  shippingFree: number;
  note: string;
  paymentMethod: "cod" | "vnpay";
  addressOrder: {
    name: string;
    phone: string;
    address: string;
  };
  deliveryTime: Date;
  setAddressOrder: React.Dispatch<
    React.SetStateAction<{
      name: string;
      phone: string;
      address: string;
    }>
  >;
  setListProductOrder: React.Dispatch<React.SetStateAction<IOrderItem[]>>;
  setShippingFree: React.Dispatch<React.SetStateAction<number>>;
  setNote: React.Dispatch<React.SetStateAction<string>>;
  setPaymentMethod: React.Dispatch<React.SetStateAction<"cod" | "vnpay">>;
  setDeliveryTime: React.Dispatch<React.SetStateAction<Date>>;
};

const CheckoutContext = createContext<ICheckoutProvide | null>(null);

const CheckoutProvide = ({ children }: { children: React.ReactNode }) => {
  const user = useAppSelector((state: RootState) => state.authSlice.user);

  const [listProductOrder, setListProductOrder] = useState<IOrderItem[]>([]);
  console.log("listProductOrder: ", listProductOrder);

  const [quantityProductOrder, setQuantityProductOrder] = useState<number>(0);

  const [addressOrder, setAddressOrder] = useState<{
    name: string;
    phone: string;
    address: string;
  }>({
    name: "",
    phone: "",
    address: "",
  });

  const [note, setNote] = useState<string>("");

  const [totalPriceOrder, setTotalPriceOrder] = useState<number>(0);

  const [shippingFree, setShippingFree] = useState<number>(0);

  const [deliveryTime, setDeliveryTime] = useState<Date>(new Date());

  const [totalPayment, setTotalPayment] = useState<number>(0);

  const [paymentMethod, setPaymentMethod] = useState<"cod" | "vnpay">("cod");

  const [reqOrder, setReqOrder] = useState<IReqOrder>({
    userId: "",
    customer: {
      name: "",
      phone: "",
      address: "",
    },
    nameProducts: [],
    note: "",
    listProducts: [],
    status: "pending",
    paymentMethod: "cod",
    paymentStatus: "pending",
    subTotal: 0,
    shippingFee: 0,
    total: 0,
    shippingUnit: "",
    delivery_at: deliveryTime,
  });
  console.log(reqOrder);

  useEffect(() => {
    if (listProductOrder.length > 0) {
      const totalPriceOrder = listProductOrder.reduce((a, b) => {
        if (b.productId.is_sale === "sale") {
          return a + b.priceSale * b.quantity;
        } else {
          return a + b.price * b.quantity;
        }
      }, 0);
      const quantityProduct = listProductOrder.reduce((a, b) => {
        return a + b.quantity;
      }, 0);
      setQuantityProductOrder(quantityProduct);
      setTotalPriceOrder(totalPriceOrder);
    }
  }, [listProductOrder]);

  useEffect(() => {
    setTotalPayment(
      quantityProductOrder === 1
        ? shippingFree + totalPriceOrder
        : totalPriceOrder
    );
  }, [quantityProductOrder, shippingFree, totalPriceOrder]);

  useEffect(() => {
    if (user) {
      const listProductReq = listProductOrder.map((product) => {
        return {
          ...product,
          productId: product.productId._id,
        };
      });

      const nameProducts = listProductOrder.map(
        (product) => product.productId.name
      );

      setReqOrder({
        userId: user._id,
        customer: addressOrder,
        nameProducts: nameProducts,
        note: "",
        listProducts: listProductReq,
        status: "pending",
        paymentMethod,
        paymentStatus: "pending",
        subTotal: totalPriceOrder,
        shippingFee: quantityProductOrder > 1 ? 0 : shippingFree,
        total: totalPayment,
        shippingUnit: "giaohangnhanh",
        delivery_at: deliveryTime,
      });
    }
  }, [
    addressOrder,
    deliveryTime,
    listProductOrder,
    note,
    paymentMethod,
    quantityProductOrder,
    shippingFree,
    totalPayment,
    totalPriceOrder,
    user,
  ]);

  return (
    <CheckoutContext.Provider
      value={{
        reqOrder,
        listProductOrder,
        quantityProductOrder,
        totalPayment,
        shippingFree,
        totalPriceOrder,
        addressOrder,
        note,
        paymentMethod,
        deliveryTime,
        setAddressOrder,
        setShippingFree,
        setNote,
        setPaymentMethod,
        setListProductOrder,
        setDeliveryTime,
      }}
    >
      {children}
    </CheckoutContext.Provider>
  );
};

export { CheckoutContext, CheckoutProvide };
