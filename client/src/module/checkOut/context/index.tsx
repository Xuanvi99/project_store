// import { ICartItem } from "@/types/cart.type";
import { IOrderItem } from "@/types/order.type";
import { createContext, useEffect, useState } from "react";

export type ICheckoutProvide = {
  listProductOrder: IOrderItem[];
  quantityProductOrder: number;
  setListProductOrder: React.Dispatch<React.SetStateAction<IOrderItem[]>>;
  totalPayment: number;
  totalPriceOrder: number;
  shippingFree: number;
  timeShipping: number;
  setAddressOrder: React.Dispatch<
    React.SetStateAction<{
      name: string;
      phone: string;
      address: string;
    }>
  >;
  addressOrder: {
    name: string;
    phone: string;
    address: string;
  };
  setShippingFree: React.Dispatch<React.SetStateAction<number>>;
  setTimeShipping: React.Dispatch<React.SetStateAction<number>>;
};

const CheckoutContext = createContext<ICheckoutProvide | null>(null);

const CheckoutProvide = ({ children }: { children: React.ReactNode }) => {
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

  const [totalPriceOrder, setTotalPriceOrder] = useState<number>(0);

  const [timeShipping, setTimeShipping] = useState<number>(0);

  const [shippingFree, setShippingFree] = useState<number>(0);

  const [totalPayment, setTotalPayment] = useState<number>(0);

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

  return (
    <CheckoutContext.Provider
      value={{
        listProductOrder,
        quantityProductOrder,
        setListProductOrder,
        totalPayment,
        shippingFree,
        totalPriceOrder,
        addressOrder,
        timeShipping,
        setAddressOrder,
        setShippingFree,
        setTimeShipping,
      }}
    >
      {children}
    </CheckoutContext.Provider>
  );
};

export { CheckoutContext, CheckoutProvide };
