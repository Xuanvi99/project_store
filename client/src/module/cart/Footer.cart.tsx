import { Button } from "@/components/button";
import { IconAlert } from "@/components/icon";
import { Input } from "@/components/input";
import Modal, { ModalNotification } from "@/components/modal";
import { ICartItem } from "@/types/cart.type";
import { useRef, useState } from "react";

type TFooterProps<T> = {
  listCheckCart: T[];
  listCartItem: T[];
  checkAll: boolean;
  handleCheckAllCart: (checked: boolean) => void;
  handleDelete: () => void;
};

function Footer({
  listCheckCart,
  listCartItem,
  checkAll,
  handleCheckAllCart,
  handleDelete,
}: TFooterProps<ICartItem>) {
  const inputRef = useRef<HTMLInputElement | null>(null);

  const [openModal, setOpenModal] = useState<boolean>(false);

  const totalMoney = () => {
    return listCheckCart.reduce((a, b) => {
      if (b.productId.is_sale === "sale") {
        return a + b.productId.priceSale * b.quantity;
      } else {
        return a + b.productId.price * b.quantity;
      }
    }, 0);
  };

  return (
    <section className="footer w-full max-w-[1200px] mx-auto min-h-[60px] shadow-sm shadow-grayCa py-10 bg-white px-5 rounded-[3px] flex justify-between items-center">
      {listCheckCart.length === 0 && (
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
            <span>
              <IconAlert size={50}></IconAlert>
            </span>
            <span>Vui lòng chọn sản phẩm</span>
          </div>
        </ModalNotification>
      )}
      {listCheckCart.length > 0 && (
        <Modal
          variant="fixed"
          isOpenModal={openModal}
          onClick={() => setOpenModal(false)}
          className={{
            content: "bg-white w-[350px] h-[150px] rounded-md p-3",
          }}
        >
          <div className="flex flex-col justify-between h-full">
            <span className="font-semibold">
              Bạn có muốn bỏ {listCheckCart.length} sản phẩm
            </span>
            <div className="flex justify-end text-xs gap-x-2">
              <Button
                variant="outLine"
                type="button"
                className="min-w-[70px]"
                onClick={() => {
                  setOpenModal(false);
                  handleDelete();
                }}
              >
                Có
              </Button>
              <Button
                variant="default"
                type="button"
                onClick={() => {
                  setOpenModal(false);
                }}
              >
                Quay lại
              </Button>
            </div>
          </div>
        </Modal>
      )}
      <div className="flex items-center w-1/3 gap-x-10">
        <Input
          ref={inputRef}
          type="checkbox"
          name="checkbox"
          onChange={(event) => {
            handleCheckAllCart(event.currentTarget.checked);
          }}
          className={{
            input: "w-5 h-5 cursor-pointer",
            wrap: "w-5 static",
          }}
          checked={checkAll}
        />
        <div
          onClick={() => {
            if (inputRef.current) {
              handleCheckAllCart(true);
            }
          }}
          className="cursor-pointer hover:text-red-600"
        >
          Chọn Tất Cả ({listCartItem.length})
        </div>
        <div
          onClick={() => {
            setOpenModal(true);
          }}
          className="cursor-pointer hover:text-red-600"
        >
          Xóa
        </div>
      </div>
      <div className="flex items-center justify-end w-2/3 gap-x-5">
        <div className="flex items-center gap-x-1">
          <span>Tổng thanh toán</span>
          <span>({listCheckCart.length} sản phẩm):</span>
          <span className="text-2xl text-red-600">
            ₫{new Intl.NumberFormat().format(totalMoney())}
          </span>
        </div>
        <Button
          variant="default"
          type="button"
          className="px-5"
          disabled={listCheckCart.length > 0 ? false : true}
        >
          Mua Hàng
        </Button>
      </div>
    </section>
  );
}

export default Footer;
