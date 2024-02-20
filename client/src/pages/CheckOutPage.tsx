import { Fragment, useState } from "react";
import { BannerCommon } from "../components/banner";
import LayoutMain from "../layout/LayoutMain";
import { IconAddress } from "../components/icon/SidebarProfile";
import TextArea from "../components/textArea";
import Field from "../components/fields/index";
import { Label } from "../components/label";
import { Input } from "../components/input";
import { Button } from "../components/button";
import { useToggle } from "../hook";
import { ModalAddress } from "../components/modal";

function CheckOutPage() {
  const [textArea, setTextArea] = useState<string>("");
  const { toggle: openShow, handleToggle: handleShow } = useToggle();
  const handleChangeTextArea = (value: string) => {
    setTextArea(value);
  };

  return (
    <Fragment>
      <BannerCommon heading="Thanh Toán" title="Thanh Toán "></BannerCommon>
      <LayoutMain>
        <section className="w-full bg-white relative py-7 px-[30px] flex flex-col gap-y-5 shadow-sm shadow-gray">
          <div className="w-full h-[3px] absolute top-0 left-0 borderCheckOut"></div>
          <div className="flex items-center gap-x-3 text-orange text-xl">
            <IconAddress size={20}></IconAddress>
            <h2>Địa Chỉ Nhận Hàng</h2>
          </div>
          <div className="flex items-center gap-x-3">
            <span className="font-bold">Bùi Xuân Vĩ (+84) 377825679</span>
            <span>Thôn Giao Tự, Xã Kim Sơn, Huyện Gia Lâm, Hà Nội</span>
            <span
              onClick={handleShow}
              className="text-blue hover:text-orange cursor-pointer ml-10"
            >
              Thay đổi
            </span>
            <ModalAddress show={openShow} handle={handleShow}></ModalAddress>
          </div>
        </section>
        <section className="w-full mx-auto mt-5 px-[30px] shadow-sm shadow-grayCa  bg-white rounded-[3px] flex flex-col justify-between items-center">
          <div className="w-full flex items-center font-bold py-5">
            <div className="w-1/2">Sản phẩm</div>
            <div className="w-1/2 grid grid-cols-3 text-gray gap-x-5 text-center text-sm">
              <span>Đơn giá</span>
              <span>Số lượng</span>
              <span>Thành tiền</span>
            </div>
          </div>
          <div className="flex flex-col w-full gap-y-2 border-t-1 border-dashed border-grayCa">
            <div className="w-full py-5 flex items-center">
              <div className="w-1/2 flex gap-x-2 items-center text-sm font-normal">
                <img
                  alt=""
                  srcSet="/shoes.jpg"
                  className="max-w-[80px] w-full"
                />
                <span className="line-clamp-1">
                  Giày Nike Air Jordan 1 Low Panda Like Auth
                </span>
              </div>
              <div className="w-1/2 grid grid-cols-3 text-gray gap-x-5 text-center text-sm">
                <span>Đơn giá</span>
                <span>Số lượng</span>
                <span>Thành tiền</span>
              </div>
            </div>
            <div className="w-full py-5 flex items-center">
              <div className="w-1/2 flex gap-x-2 items-center text-sm font-normal">
                <img alt="" srcSet="/shoes.jpg" className="w-[80px]" />
                <span className="line-clamp-1">
                  Giày Nike Air Jordan 1 Low Panda Like Auth
                </span>
              </div>
              <div className="w-1/2 grid grid-cols-3 text-gray gap-x-5 text-center text-sm">
                <span>Đơn giá</span>
                <span>Số lượng</span>
                <span>Thành tiền</span>
              </div>
            </div>
          </div>
        </section>
        <section className="w-full mx-auto mt-5 px-[30px] py-5 shadow-sm shadow-grayCa  bg-white rounded-[3px]">
          <div className="my-5 w-full">
            <span className="font-bold">Ghi chú đơn hàng (tuỳ chọn)</span>
            <TextArea
              cols={50}
              placeholder="Lưu ý cho người bán..."
              textValue={textArea}
              handleChange={handleChangeTextArea}
            ></TextArea>
          </div>
          <div className="flex justify-between ">
            <div className="w-1/2 flex flex-col justify-start gap-y-5">
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
            <div className="w-1/2 flex flex-col items-end gap-y-5">
              <h1 className="text-xl font-bold">Thông tin đơn hàng</h1>
              <div className="grid grid-cols-2 grid-rows-3 gap-5">
                <span className="text-gray">Tổng tiền hàng:</span>
                <span className="text-end">₫105.000</span>
                <span className="text-gray">Phí vận chuyển:</span>
                <span className="text-end">₫15.000</span>
                <span className="text-gray flex items-center">
                  Tổng thanh toán:
                </span>
                <span className="text-end text-red-600 text-3xl">₫120.000</span>
              </div>
            </div>
          </div>
          <div className="text-end my-5">
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
