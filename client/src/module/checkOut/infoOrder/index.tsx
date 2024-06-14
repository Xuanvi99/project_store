import { Button } from "@/components/button";
import Field from "@/components/fields";
import { Input } from "@/components/input";
import { Label } from "@/components/label";
import useTestContext from "@/hook/useTestContext";
import { CheckoutContext, ICheckoutProvide } from "../context";
import { formatPrice } from "@/utils";
import { IconAlert } from "@/components/icon";
import Tooltip from "@/components/tooltip";
import { useCreateOrderMutation } from "@/stores/service/order.service";
import { Fragment, useEffect, useState } from "react";
import { ModalNotification } from "@/components/modal";
import LoadingSpinner from "../../../components/loading/index";
import { useDeleteCartMultipleMutation } from "@/stores/service/cart.service";
import { useAppSelector } from "@/hook";
import { RootState } from "@/stores";
import { useNavigate } from "react-router-dom";
import { QueryStatus } from "@reduxjs/toolkit/query";

function InfoOrder() {
  const {
    totalPriceOrder,
    totalPayment,
    shippingFree,
    quantityProductOrder,
    listProductOrder,
    paymentMethod,
    reqOrder,
    setPaymentMethod,
  } = useTestContext<ICheckoutProvide>(
    CheckoutContext as React.Context<ICheckoutProvide>
  );

  const user = useAppSelector((state: RootState) => state.authSlice.user);

  const navigate = useNavigate();

  const [openModal, setOpenModal] = useState<boolean>(true);

  const [createOrder, { status }] = useCreateOrderMutation();

  const [deleteCartMultiple] = useDeleteCartMultipleMutation();

  const handleSubmitOrder = async () => {
    if (user) {
      await createOrder(reqOrder)
        .unwrap()
        .then(async () => {
          const listIdProduct = listProductOrder.map((item) => item._id);
          await deleteCartMultiple({ id: user._id, listIdProduct }).unwrap();
          navigate("/user/account/purchaseOrder?type=2", {
            replace: true,
          });
        })
        .catch(() => {
          setOpenModal(true);
        });
    }
  };

  const selectNotification = (status: QueryStatus) => {
    if (status === "pending") {
      return (
        <div className="flex flex-col items-center justify-center text-lg gap-y-2">
          <LoadingSpinner className="w-12 h-12 border-4 rounded-full border-orange animate-spin border-r-transparent"></LoadingSpinner>
          <span>Đang xử lý...</span>
        </div>
      );
    } else if (status === "rejected") {
      return (
        <>
          <IconAlert size={50}></IconAlert>
          <span>Lỗi đặt đơn hàng</span>
        </>
      );
    }
  };

  useEffect(() => {}, []);

  return (
    <Fragment>
      <ModalNotification
        variant="fixed"
        onClick={() => {
          if (status !== "pending") {
            setOpenModal(false);
          }
        }}
        isOpen={openModal}
        className={{
          overlay: "opacity-20",
          content:
            "modal-content max-w-[300px] h-[200px] w-full flex flex-col text-danger font-semibold gap-y-2 justify-center items-center bg-white rounded z-[70]",
        }}
      >
        {selectNotification(status)}
      </ModalNotification>
      <section className="w-full mx-auto mt-5 px-[30px] py-5 shadow-sm shadow-grayCa  bg-white rounded-[3px]">
        <div className="flex justify-between ">
          <div className="flex flex-col justify-start w-1/2 gap-y-5">
            <h1 className="text-xl font-bold">Phương thức thanh toán</h1>
            <Field variant="flex-row" className="justify-start">
              <Input
                type="radio"
                name="payment"
                value="cod"
                checked={paymentMethod === "cod"}
                onChange={() => setPaymentMethod("cod")}
                className={{ wrap: "w-5" }}
              />
              <Label className="line-clamp-1">Nhận hàng thanh toán</Label>
            </Field>
            <Field variant="flex-row">
              <Input
                type="radio"
                name="payment"
                value="vnpay"
                checked={paymentMethod === "vnpay"}
                onChange={() => setPaymentMethod("vnpay")}
                className={{ wrap: "w-5" }}
              />
              <Label> Chuyển khoản ngân hàng</Label>
            </Field>
          </div>
          <div className="flex flex-col items-end w-1/2 gap-y-5">
            <h1 className="text-xl font-bold">Thông tin đơn hàng</h1>
            <div className="grid grid-cols-2 grid-rows-3 gap-5">
              <span className="text-gray">Tổng tiền hàng:</span>
              <span className="text-end">
                {listProductOrder.length > 0 ? formatPrice(totalPriceOrder) : 0}
                ₫
              </span>
              <span className="text-gray">Phí vận chuyển:</span>
              <span
                className={`text-end flex justify-end items-center gap-x-1`}
              >
                <span
                  className={quantityProductOrder > 1 ? "line-through " : ""}
                >
                  {listProductOrder.length > 0 ? formatPrice(shippingFree) : 0}₫
                </span>
                {listProductOrder.length > 0 && quantityProductOrder > 1 && (
                  <Tooltip
                    place="top"
                    select={<IconAlert size={20}></IconAlert>}
                    className={{
                      select: "z-40 text-danger",
                      content: "-translate-x-3/4",
                    }}
                  >
                    <div className="min-w-[150px] h-10 text-xs text-center">
                      Phí vận chuyển được miễn phí khi mua 2 đôi trở lên
                    </div>
                  </Tooltip>
                )}
              </span>
              <span className="flex items-center text-gray">
                Tổng thanh toán:
              </span>
              <span className="text-3xl text-red-600 text-end">
                {listProductOrder.length > 0 ? formatPrice(totalPayment) : 0}₫
              </span>
            </div>
          </div>
        </div>
        <div className="my-5 text-end">
          <Button
            variant="default"
            type="button"
            className=" max-w-[150px]"
            onClick={handleSubmitOrder}
            disabled={listProductOrder.length > 0 ? false : true}
          >
            Đặt hàng
          </Button>
        </div>
      </section>
    </Fragment>
  );
}

export default InfoOrder;
