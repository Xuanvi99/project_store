import { Button } from "@/components/button";
import Field from "@/components/fields";
import { Input } from "@/components/input";
import { Label } from "@/components/label";
import TextArea from "@/components/textArea";
import useTestContext from "@/hook/useTestContext";
import { useState } from "react";
import { CheckoutContext, ICheckoutProvide } from "../context";
import { formatPrice } from "@/utils";
import IconCamera from "../../../components/icon/IconCamera";
import { IconAlert } from "@/components/icon";
import Tooltip from "@/components/tooltip";

function InfoOrder() {
  const { totalPriceOrder, totalPayment, shippingFree, quantityProductOrder } =
    useTestContext<ICheckoutProvide>(
      CheckoutContext as React.Context<ICheckoutProvide>
    );

  const [textArea, setTextArea] = useState<string>("");
  const [paymentMethod, setPaymentMethod] = useState<string>("cod");

  const handleChangeTextArea = (value: string) => {
    setTextArea(value);
  };
  return (
    <section className="w-full mx-auto mt-5 px-[30px] py-5 shadow-sm shadow-grayCa  bg-white rounded-[3px]">
      <div className="w-full my-5">
        <span className="font-bold">Ghi chú đơn hàng (tuỳ chọn)</span>
        <TextArea
          cols={100}
          placeholder="Lưu ý cho người bán..."
          textValue={textArea}
          handleChange={handleChangeTextArea}
        ></TextArea>
      </div>
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
            <span className="text-end">{formatPrice(totalPriceOrder)}₫</span>
            <span className="text-gray">Phí vận chuyển:</span>
            <span className={`text-end flex justify-end items-center gap-x-1`}>
              <span
                className={quantityProductOrder > 1 ? "line-through " : ""}
              >
                {formatPrice(shippingFree)}₫
              </span>
              {quantityProductOrder > 1 && (
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
              {formatPrice(totalPayment)}₫
            </span>
          </div>
        </div>
      </div>
      <div className="my-5 text-end">
        <Button variant="default" type="button" className="px-10">
          Đặt hàng
        </Button>
      </div>
    </section>
  );
}

export default InfoOrder;
