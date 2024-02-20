import { Fragment, useState } from "react";
import { BannerCommon } from "../components/banner";
import LayoutMain from "../layout/LayoutMain";

import Cart from "../module/cart";
import { listCartShoes } from "../constant/cart";
import ProductSlideshow from "../components/product/ProductSlideshow";

export type TCartItem = {
  id: string;
  name: string;
  image: string;
  size: string;
  price: {
    main: string;
    sale: string;
  };
  quantity: number;
};

function CartPage() {
  const [listCheckCart, setListCheckCart] = useState<TCartItem[]>([]);

  const handleCheckCart = (id: string, checked: boolean) => {
    const listCheckCartCopy = [...listCheckCart];
    if (checked) {
      for (let i = 0; i < listCartShoes.length; i++) {
        if (listCartShoes[i].id === id) {
          listCheckCartCopy.push(listCartShoes[i]);
        }
      }
    } else {
      for (let i = 0; i < listCheckCartCopy.length; i++) {
        if (listCheckCartCopy[i].id === id) {
          listCheckCartCopy.splice(i, 1);
        }
      }
    }
    setListCheckCart([...listCheckCartCopy]);
  };

  const handleCheckAllCart = (checked: boolean) => {
    const listCheckCartCopy: TCartItem[] = [];
    if (checked) {
      for (let i = 0; i < listCartShoes.length; i++) {
        listCheckCartCopy.push(listCartShoes[i]);
      }
    } else {
      listCheckCartCopy.splice(0, listCheckCartCopy.length);
    }
    setListCheckCart([...listCheckCartCopy]);
  };

  return (
    <Fragment>
      <BannerCommon heading="Giỏ Hàng Của Bạn" title="Giỏ hàng "></BannerCommon>
      <Cart.Header
        handleCheckAll={handleCheckAllCart}
        checkAll={listCheckCart.length === listCartShoes.length ? true : false}
      ></Cart.Header>
      <LayoutMain>
        {listCartShoes.map((item: TCartItem, index) => {
          return (
            <Cart.CartItem
              key={item.id}
              data={item}
              handleCheckCart={handleCheckCart}
              isChecked={listCheckCart.includes(listCartShoes[index])}
            ></Cart.CartItem>
          );
        })}
      </LayoutMain>
      <Cart.Footer
        handleCheckAll={handleCheckAllCart}
        listCheckCart={listCheckCart}
        listCart={listCartShoes}
        checkAll={listCheckCart.length === listCartShoes.length ? true : false}
      ></Cart.Footer>
      <ProductSlideshow name="Khám phá thêm"></ProductSlideshow>
    </Fragment>
  );
}

export default CartPage;
