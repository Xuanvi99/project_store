import { Button } from "@/components/button";
import Modal from "@/components/modal";
import { useAppSelector } from "@/hook";
import { RootState } from "@/stores";
import { ICart, ICartItem } from "@/types/cart.type";
import { Fragment, useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import OrderItem from "./OrderItem";
import useTestContext from "@/hook/useTestContext";
import { CheckoutContext, ICheckoutProvide } from "../context";

type TSelectProductOrder = {
  id: string;
  listIdProductOrder: string[];
} | null;

function ListProductOrder() {
  const cart: ICart | null = useAppSelector(
    (state: RootState) => state.cartSlice.cart
  );

  const { listProductOrder, setListProductOrder } =
    useTestContext<ICheckoutProvide>(
      CheckoutContext as React.Context<ICheckoutProvide>
    );

  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [openModal, setOpenModal] = useState<boolean>(false);
  const [redirect, setRedirect] = useState<boolean>(false);
  const [checkOrder, setCheckOrder] = useState<boolean>(false);

  const orderId = useMemo<string>(
    () => searchParams.get("id") || "",
    [searchParams]
  );

  const selectProductToOrder = useMemo<TSelectProductOrder>(
    () =>
      localStorage.getItem("selectProductCart")
        ? (JSON.parse(
            localStorage.getItem("selectProductCart") as string
          ) as TSelectProductOrder)
        : null,
    []
  );

  useEffect(() => {
    const listSelectProduct: string[] | undefined =
      selectProductToOrder?.listIdProductOrder;
    if (
      !selectProductToOrder ||
      !orderId ||
      orderId !== selectProductToOrder.id ||
      !cart ||
      cart.listProduct.length === 0 ||
      !listSelectProduct ||
      listSelectProduct?.length === 0
    ) {
      setOpenModal(true);
      setCheckOrder(true);
    } else {
      const array: ICartItem[] = [];
      for (const idProduct of listSelectProduct) {
        const index = cart.listProduct.findIndex(({ _id }) => _id == idProduct);
        if (index === -1) {
          setOpenModal(true);
          setCheckOrder(true);
          return;
        } else {
          array.push(cart.listProduct[index]);
        }
      }
      setListProductOrder(array);
    }
  }, [cart, orderId, selectProductToOrder, setListProductOrder]);

  useEffect(() => {
    if (redirect) {
      navigate("/cart", { replace: true });
    }
  }, [navigate, redirect]);

  return (
    <Fragment>
      <Modal
        variant="fixed"
        isOpenModal={openModal}
        className={{
          content: "bg-white w-[450px] rounded-md p-3",
        }}
      >
        <div className="flex flex-col justify-between h-full gap-y-2">
          {cart && cart.listProduct.length === 0 && (
            <h2 className="font-semibold">Giỏ hàng của bạn đang trống.</h2>
          )}
          <span className="text-sm">
            Một số sản phẩm trong giỏ hàng vừa được cập nhật, bạn vui lòng kiểm
            tra lại giỏ hàng và thử lại.
          </span>
          <div className="flex justify-end mt-10 text-xs gap-x-2">
            <Button
              variant="default"
              type="button"
              className="min-w-[70px]"
              onClick={() => {
                setOpenModal(false);
                if (cart && cart.listProduct.length === 0) {
                  setRedirect(true);
                }
              }}
            >
              ĐỒNG Ý
            </Button>
          </div>
        </div>
      </Modal>
      <section className="w-full mx-auto mt-5 px-[30px] shadow-sm shadow-grayCa  bg-white rounded-[3px] flex flex-col justify-between items-center">
        <div className="flex items-center w-full py-5 font-bold">
          <div className="w-1/2">Sản phẩm</div>
          <div className="grid w-1/2 grid-cols-3 text-sm text-center text-gray gap-x-5">
            <span>Đơn giá</span>
            <span>Số lượng</span>
            <span>Thành tiền</span>
          </div>
        </div>
        {!checkOrder && (
          <div className="flex flex-col w-full border-dashed gap-y-2 border-t-1 border-grayCa">
            {listProductOrder.length > 0 &&
              listProductOrder.map((product) => {
                return <OrderItem key={product._id} data={product}></OrderItem>;
              })}
          </div>
        )}
      </section>
    </Fragment>
  );
}

export default ListProductOrder;
