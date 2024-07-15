import { Button } from "@/components/button";
import Modal from "@/components/modal";
import { useAppSelector } from "@/hook";
import { RootState } from "@/stores";
import { ICart } from "@/types/cart.type";
import { Fragment, useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import OrderItem from "./OrderItem";
import useTestContext from "@/hook/useTestContext";
import { CheckoutContext, ICheckoutProvide } from "../context";
import { IOrderItem } from "@/types/order.type";
import TextArea from "@/components/textArea";
import { formatPrice } from "@/utils";

type TSelectProductOrder = {
  id: string;
  listIdProductOrder: string[];
} | null;

function ListProductOrder() {
  const cart: ICart | null = useAppSelector(
    (state: RootState) => state.cartSlice.cart
  );

  const {
    listProductOrder,
    setListProductOrder,
    shippingFree,
    note,
    setNote,
    deliveryTime,
  } = useTestContext<ICheckoutProvide>(
    CheckoutContext as React.Context<ICheckoutProvide>
  );

  console.log("ca", deliveryTime.getTime() - new Date().getTime());

  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [openModal, setOpenModal] = useState<boolean>(false);
  const [checkOrder, setCheckOrder] = useState<boolean>(false);
  const [redirect, setRedirect] = useState<boolean>(false);

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
      cart &&
      cart.listProduct.length > 0 &&
      selectProductToOrder &&
      orderId &&
      orderId === selectProductToOrder.id &&
      listSelectProduct &&
      listSelectProduct?.length > 0
    ) {
      const array: IOrderItem[] = [];
      for (const idProduct of listSelectProduct) {
        const index = cart.listProduct.findIndex(
          ({ _id }) => _id === idProduct
        );
        if (index === -1) {
          setOpenModal(true);
          setCheckOrder(true);
          return;
        } else {
          const productItemOrder = cart.listProduct[index].productId;
          const price = productItemOrder.price;
          const priceSale = productItemOrder.priceSale;
          array.push({ ...cart.listProduct[index], price, priceSale });
        }
      }
      setListProductOrder(array);
    } else {
      setOpenModal(true);
      setCheckOrder(true);
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
                setRedirect(true);
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
      <section className="w-full mx-auto bg-grayFa">
        <div className="flex px-5 text-sm border-dashed border-1 border-grayCa">
          <div className="flex w-full px-2 my-5 basis-3/5 gap-x-2">
            <span className="whitespace-nowrap">Lời nhắn: </span>
            <TextArea
              cols={50}
              placeholder="Lưu ý cho người bán..."
              textValue={note}
              handleChange={(value) => {
                setNote(value);
              }}
            ></TextArea>
          </div>
          <div className="flex flex-col justify-between px-5 py-2 border-dashed basis-2/5 border-l-1 border-l-grayCa ">
            <div className="flex gap-x-2">
              <span className="font-semibold">Đơn vị vận chuyển:</span>
              <span className="underline text-blue">Giao hàng nhanh</span>
            </div>
            <div className="flex gap-x-2">
              <span className="font-semibold">Thời gian dự kiến giao:</span>
              <span>
                {(
                  (deliveryTime.getTime() - new Date().getTime()) /
                  (1000 * 60 * 60 * 24)
                ).toFixed(0)}{" "}
                ngày
              </span>
            </div>
            <div className="flex gap-x-2">
              <span className="font-semibold">Phí vận chuyển:</span>
              <span>{formatPrice(shippingFree)}₫</span>
            </div>
          </div>
        </div>
      </section>
    </Fragment>
  );
}

export default ListProductOrder;
