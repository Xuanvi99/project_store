import useTestContext from "@/hook/useTestContext";
import { CartContext, TCartProvider } from "../context.cart";
import CartItem from "./CartItem";
import { ICartItem } from "@/types/cart.type";
import { Fragment } from "react";
import ListProductExpired from "./ListProductExpired";

function Content() {
  const {
    listProductActiveToCart,
    listProductInactiveToCart,
    listCheckCart,
    listSelectItem,
    setListCheckCart,
    setListSelectItem,
  } = useTestContext<TCartProvider>(
    CartContext as React.Context<TCartProvider>
  );

  const handleCheckCart = (checked: boolean, id: string) => {
    const listCheckCartCopy = [...listCheckCart];
    if (checked) {
      const result: ICartItem[] = listProductActiveToCart.filter(
        (item: ICartItem) => item._id === id
      );
      listCheckCartCopy.push(result[0]);
      setListSelectItem([...listSelectItem, id]);
    } else {
      const indexItem = listCheckCartCopy.findIndex(
        (item: ICartItem) => item._id === id
      );
      listCheckCartCopy.splice(indexItem, 1);
      setListSelectItem((preData) => {
        return preData.filter((value) => id !== value);
      });
    }
    setListCheckCart([...listCheckCartCopy]);
  };

  const handleUpdateCartItem = (id: string, quantity: number) => {
    const listCheckCartCopy = [...listCheckCart];
    const indexItem = listCheckCartCopy.findIndex(
      (item: ICartItem) => item._id === id
    );
    if (indexItem > -1) {
      const cartItemUpdate = { ...listCheckCartCopy[indexItem], quantity };
      listCheckCartCopy.splice(indexItem, 1, cartItemUpdate);
      setListCheckCart([...listCheckCartCopy]);
    }
  };

  const handleDeleteItem = (id: string) => {
    const indexItemListCart = listCheckCart.findIndex(
      (item: ICartItem) => item._id === id
    );
    const indexSelectItem = listSelectItem.findIndex((item) => item === id);
    if (indexItemListCart > -1) {
      listCheckCart.splice(indexItemListCart, 1);
    }
    if (indexSelectItem > -1) {
      listSelectItem.splice(indexSelectItem, 1);
    }
  };

  return (
    <Fragment>
      <section className="w-full mt-5">
        {listProductActiveToCart.map((item: ICartItem) => {
          return (
            <CartItem
              key={item._id}
              data={item}
              handleCheckCart={handleCheckCart}
              handleUpdateCartItem={handleUpdateCartItem}
              handleDeleteItem={handleDeleteItem}
              isChecked={listSelectItem.includes(item._id) ? true : false}
            ></CartItem>
          );
        })}
      </section>
      {listProductInactiveToCart.length > 0 && (
        <ListProductExpired></ListProductExpired>
      )}
    </Fragment>
  );
}

export default Content;
