import { Fragment, useState } from "react";
import { BannerCommon } from "../components/banner";
import LayoutMain from "../layout/LayoutMain";
import TextArea from "../components/textArea";
import Field from "../components/fields/index";
import { Label } from "../components/label";
import { Input } from "../components/input";
import { Button } from "../components/button";
import AddressCheckout from "@/module/checkOut/address";
import ListProductOrder from "@/module/checkOut/product";
import { useLocation } from "react-router-dom";

function CheckOutPage() {
  const [textArea, setTextArea] = useState<string>("");
  const handleChangeTextArea = (value: string) => {
    setTextArea(value);
  };

  return (
    <Fragment>
      <BannerCommon heading="Thanh Toán" title="Thanh Toán "></BannerCommon>
      <LayoutMain>
        <AddressCheckout></AddressCheckout>
        <ListProductOrder></ListProductOrder>
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
                  className={{ wrap: "w-5" }}
                />
                <Label className="line-clamp-1">Nhận hàng thanh toán</Label>
              </Field>
              <Field variant="flex-row">
                <Input
                  type="radio"
                  name="payment"
                  className={{ wrap: "w-5" }}
                />
                <Label> Chuyển khoản ngân hàng</Label>
              </Field>
            </div>
            <div className="flex flex-col items-end w-1/2 gap-y-5">
              <h1 className="text-xl font-bold">Thông tin đơn hàng</h1>
              <div className="grid grid-cols-2 grid-rows-3 gap-5">
                <span className="text-gray">Tổng tiền hàng:</span>
                <span className="text-end">₫105.000</span>
                <span className="text-gray">Phí vận chuyển:</span>
                <span className="text-end">₫15.000</span>
                <span className="flex items-center text-gray">
                  Tổng thanh toán:
                </span>
                <span className="text-3xl text-red-600 text-end">₫120.000</span>
              </div>
            </div>
          </div>
          <div className="my-5 text-end">
            <Button variant="default" type="button" className="px-10">
              Đặt hàng
            </Button>
          </div>
        </section>
      </LayoutMain>
    </Fragment>
  );
}

export default CheckOutPage;
