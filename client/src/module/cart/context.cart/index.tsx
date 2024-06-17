import { useAppSelector } from "@/hook";
import { RootState } from "@/stores";
import { ICartItem } from "@/types/cart.type";
import { IProductRes } from "@/types/product.type";
import { createContext, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

export type TCartProvider = {
  listProductActiveToCart: ICartItem<IProductRes>[] | [];
  listProductInactiveToCart: ICartItem<IProductRes>[] | [];
  listCheckCart: ICartItem<IProductRes>[];
  listSelectId: string[];
  totalPriceOrder: number;
  openModal: boolean;
  handleOpenError: (value: boolean) => void;
  setListCheckCart: React.Dispatch<
    React.SetStateAction<ICartItem<IProductRes>[]>
  >;
  setListSelectId: React.Dispatch<React.SetStateAction<string[]>>;
  handleSetTotalPriceOrder: (value: number) => void;
  handleCheckAllCart: (checked: boolean) => void;
};

const CartContext = createContext<TCartProvider | null>(null);

function CartProvider({ children }: { children: React.ReactNode }) {
  const cart = useAppSelector((state: RootState) => state.cartSlice.cart);

  const { state } = useLocation();

  const [listProductActiveToCart, setListProductActiveToCart] = useState<
    ICartItem<IProductRes>[]
  >([]);

  const [listProductInactiveToCart, setListProductInactiveToCart] = useState<
    ICartItem<IProductRes>[]
  >([]);

  const [listCheckCart, setListCheckCart] = useState<ICartItem<IProductRes>[]>(
    []
  );

  const [listSelectId, setListSelectId] = useState<string[]>([]);

  const [totalPriceOrder, setTotalPriceOrder] = useState<number>(0);

  const [openModal, setOpenModal] = useState<boolean>(false);

  const handleOpenError = (value: boolean) => {
    setOpenModal(value);
  };

  const handleSetTotalPriceOrder = (value: number) => {
    setTotalPriceOrder(value);
  };

  const handleCheckAllCart = (checked: boolean) => {
    const listCheckCartCopy: ICartItem<IProductRes>[] = [];
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
    setListSelectId([...ListSelectCartItem]);
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
    if (state && state.type_Cart === "buy_now" && state.listCartItem) {
      const listCartItem = state.listCartItem;
      const arrCheckCart = [];
      const arrSelectCartId = [];
      for (const cartItem of listCartItem) {
        const indexItem = listProductActiveToCart.findIndex(
          (item: ICartItem<IProductRes>) => item._id === cartItem._id
        );
        if (indexItem > -1) {
          arrCheckCart.push(cartItem);
          arrSelectCartId.push(cartItem._id);
        }
      }
      setListCheckCart(arrCheckCart);
      setListSelectId(arrSelectCartId);
    }
  }, [listProductActiveToCart, state]);

  return (
    <CartContext.Provider
      value={{
        listProductActiveToCart,
        listProductInactiveToCart,
        listCheckCart,
        listSelectId,
        totalPriceOrder,
        openModal,
        setListCheckCart,
        setListSelectId,
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
