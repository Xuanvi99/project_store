import { Fragment, useEffect, useMemo, useState } from "react";
import { BannerCommon } from "../components/banner";
import LayoutMain from "../layout/LayoutMain";
import Cart from "../module/cart";
import { useAppSelector } from "@/hook";
import { RootState } from "@/stores";
import { ICartItem } from "@/types/cart.type";
import { ProductSlideshow } from "@/components/product";
import {
  useDeleteCartAllMutation,
  useDeleteCartMultipleMutation,
} from "@/stores/service/cart.service";
import { ModalNotification } from "@/components/modal";
import { IconError } from "@/components/icon";
import { Button } from "@/components/button";
import { useLocation, useNavigate } from "react-router-dom";

function CartPage() {
  const user = useAppSelector((state: RootState) => state.authSlice.user);
  const cart = useAppSelector((state: RootState) => state.cartSlice.cart);

  const [deleteCartAll] = useDeleteCartAllMutation();
  const [deleteCartMultiple] = useDeleteCartMultipleMutation();

  const navigate = useNavigate();
  const { pathname, state } = useLocation();
  const redirectUrl = import.meta.env.VITE_DOMAIN_CLIENT + pathname;

  const listProduct: ICartItem[] | [] = useMemo(() => {
    return cart?.listProduct || [];
  }, [cart?.listProduct]);

  const [listCheckCart, setListCheckCart] = useState<ICartItem[]>([]);
  console.log("listCheckCart: ", listCheckCart);

  const [listSelectItem, setListSelectItem] = useState<string[]>([]);
  console.log("listSelectItem: ", listSelectItem);

  const [openModal, setOpenModal] = useState<boolean>(false);

  const handleCheckCart = (checked: boolean, id: string) => {
    const listCheckCartCopy = [...listCheckCart];
    if (checked) {
      const result: ICartItem[] = listProduct.filter(
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

  const handleCheckAllCart = (checked: boolean) => {
    const listCheckCartCopy: ICartItem[] = [];
    const ListSelectCartItem: string[] = [];
    if (checked) {
      for (let i = 0; i < listProduct.length; i++) {
        listCheckCartCopy.push(listProduct[i]);
        ListSelectCartItem.push(listProduct[i]._id);
      }
    } else {
      listCheckCartCopy.splice(0, listCheckCartCopy.length);
      ListSelectCartItem.splice(0, ListSelectCartItem.length);
    }
    setListSelectItem([...ListSelectCartItem]);
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

  const handleDeleteAll = () => {
    if (user) {
      deleteCartAll(user?._id)
        .unwrap()
        .then(() => {
          setListCheckCart([]);
          setListSelectItem([]);
        })
        .catch(() => handleOpenError());
    }
  };

  const handleDeleteMultiple = () => {
    if (user) {
      deleteCartMultiple({
        id: user?._id || "",
        listIdProduct: listSelectItem,
      })
        .unwrap()
        .then(() => {
          setListCheckCart([]);
          setListSelectItem([]);
        })
        .catch(() => handleOpenError());
    }
  };

  const handleOpenError = () => {
    setOpenModal(true);
  };

  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, []);

  useEffect(() => {
    if (!user) {
      const query = encodeURIComponent(redirectUrl);
      navigate("/auth/login?next=" + query, { state: { path: pathname } });
    }
  }, [navigate, pathname, redirectUrl, user]);

  useEffect(() => {
    if (state && state.type_Cart === "buy_now" && state.cartItem) {
      const indexItem = listProduct.findIndex(
        (item: ICartItem) => item._id === state.cartItem._id
      );
      if (indexItem > -1) {
        setListCheckCart([state.cartItem]);
        setListSelectItem([state.cartItem._id]);
      }
    }
  }, [listProduct, state]);

  return (
    <Fragment>
      <BannerCommon heading="Giỏ Hàng Của Bạn" title="Giỏ hàng "></BannerCommon>
      <ModalNotification
        isOpen={openModal}
        onClick={() => setOpenModal(false)}
        time={700}
        className={{
          content:
            "bg-black w-[350px] h-[200px] rounded-md opacity-75 flex justify-center items-center gap-x-5 text-white font-semibold",
        }}
      >
        <div className="flex flex-col items-center justify-center gap-y-5">
          <span className={"text-danger"}>
            <IconError size={50}></IconError>
          </span>
          <span>Lỗi xóa sản phẩm trong giỏ hàng</span>
        </div>
      </ModalNotification>
      {listProduct.length > 0 && (
        <>
          <Cart.Header
            handleCheckAll={handleCheckAllCart}
            checkAll={
              listCheckCart.length === listProduct.length ? true : false
            }
          ></Cart.Header>
          <LayoutMain>
            {listProduct.map((item: ICartItem) => {
              return (
                <Cart.CartItem
                  key={item._id}
                  data={item}
                  handleCheckCart={handleCheckCart}
                  handleUpdateCartItem={handleUpdateCartItem}
                  handleDeleteItem={handleDeleteItem}
                  handleOpenError={handleOpenError}
                  isChecked={listSelectItem.includes(item._id) ? true : false}
                ></Cart.CartItem>
              );
            })}
          </LayoutMain>
          <Cart.Footer
            handleCheckAllCart={handleCheckAllCart}
            listCheckCart={listCheckCart}
            listCartItem={listProduct}
            handleDelete={
              listCheckCart.length === listProduct.length
                ? handleDeleteAll
                : handleDeleteMultiple
            }
            checkAll={
              listCheckCart.length === listProduct.length ? true : false
            }
          ></Cart.Footer>
        </>
      )}
      {listProduct.length === 0 && <NoItemsToCart></NoItemsToCart>}
      <ProductSlideshow name=""></ProductSlideshow>
    </Fragment>
  );
}

const NoItemsToCart = () => {
  const navigate = useNavigate();
  return (
    <LayoutMain className="flex items-center justify-center">
      <div className="flex flex-col items-center justify-center gap-y-3 py-[100px]">
        <img alt="" srcSet="/cart.png" className="w-[100px]" />
        <p>Giỏ hàng của bạn còn trống</p>
        <Button variant="default" onClick={() => navigate("/")}>
          MUA NGAY
        </Button>
      </div>
    </LayoutMain>
  );
};

export default CartPage;
