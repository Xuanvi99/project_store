import { useAppSelector } from "@/hook";
import { RootState } from "@/stores";
import { ICartItem } from "@/types/cart.type";
import { createContext, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

export type TCartProvider = {
  listProductActiveToCart: ICartItem[] | [];
  listProductInactiveToCart: ICartItem[] | [];
  listCheckCart: ICartItem[];
  listSelectItem: string[];
  totalPriceOrder: number;
  openModal: boolean;
  handleOpenError: (value: boolean) => void;
  setListCheckCart: React.Dispatch<React.SetStateAction<ICartItem[]>>;
  setListSelectItem: React.Dispatch<React.SetStateAction<string[]>>;
  handleSetTotalPriceOrder: (value: number) => void;
  handleCheckAllCart: (checked: boolean) => void;
};

const CartContext = createContext<TCartProvider | null>(null);

function CartProvider({ children }: { children: React.ReactNode }) {
  const cart = useAppSelector((state: RootState) => state.cartSlice.cart);

  const { state } = useLocation();

  const [listProductActiveToCart, setListProductActiveToCart] = useState<
    ICartItem[]
  >([]);

  const [listProductInactiveToCart, setListProductInactiveToCart] = useState<
    ICartItem[]
  >([]);

  const [listCheckCart, setListCheckCart] = useState<ICartItem[]>([]);

  const [listSelectItem, setListSelectItem] = useState<string[]>([]);

  const [totalPriceOrder, setTotalPriceOrder] = useState<number>(0);

  const [openModal, setOpenModal] = useState<boolean>(false);

  const handleOpenError = (value: boolean) => {
    setOpenModal(value);
  };

  const handleSetTotalPriceOrder = (value: number) => {
    setTotalPriceOrder(value);
  };

  const handleCheckAllCart = (checked: boolean) => {
    const listCheckCartCopy: ICartItem[] = [];
    const ListSelectCartItem: string[] = [];
    if (checked) {
      for (let i = 0; i < listProductActiveToCart.length; i++) {
        listCheckCartCopy.push(listProductActiveToCart[i]);
        ListSelectCartItem.push(listProductActiveToCart[i]._id);
      }
    } else {
      listCheckCartCopy.splice(0, listCheckCartCopy.length);
      ListSelectCartItem.splice(0, ListSelectCartItem.length);
    }
    setListSelectItem([...ListSelectCartItem]);
    setListCheckCart([...listCheckCartCopy]);
  };

  useEffect(() => {
    if (cart) {
      const productActive = cart.listProduct.filter(
        (product) => product.productId.status === "active"
      );
      const productInactive = cart.listProduct.filter(
        (product) =>
          product.productId.status === "inactive" ||
          product.productId.inventoryId.stocked
      );
      setListProductActiveToCart(productActive);
      setListProductInactiveToCart(productInactive);
    }
  }, [cart]);

  useEffect(() => {
    if (state && state.type_Cart === "buy_now" && state.cartItem) {
      const indexItem = listProductActiveToCart.findIndex(
        (item: ICartItem) => item._id === state.cartItem._id
      );
      if (indexItem > -1) {
        setListCheckCart([state.cartItem]);
        setListSelectItem([state.cartItem._id]);
      }
    }
  }, [listProductActiveToCart, state]);

  return (
    <CartContext.Provider
      value={{
        listProductActiveToCart,
        listProductInactiveToCart,
        listCheckCart,
        listSelectItem,
        totalPriceOrder,
        openModal,
        setListCheckCart,
        setListSelectItem,
        handleSetTotalPriceOrder,
        handleOpenError,
        handleCheckAllCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export { CartProvider, CartContext };
