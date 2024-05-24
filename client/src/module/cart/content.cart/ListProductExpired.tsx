import useTestContext from "@/hook/useTestContext";
import { CartContext, TCartProvider } from "../context.cart";
import CartItemExpired from "./CartItemExpired";
import Modal from "@/components/modal";
import { useState } from "react";
import { Button } from "@/components/button";
import { useDeleteCartMultipleMutation } from "@/stores/service/cart.service";
import { useAppSelector } from "@/hook";
import { RootState } from "@/stores";

function ListProductExpired() {
  const { listProductInactiveToCart, handleOpenError } =
    useTestContext<TCartProvider>(CartContext as React.Context<TCartProvider>);
  const [openModal, setOpenModal] = useState<boolean>(false);

  const user = useAppSelector((state: RootState) => state.authSlice.user);

  const [deleteCartMultiple] = useDeleteCartMultipleMutation();

  const listSelectItem = listProductInactiveToCart.map(
    (product) => product._id
  );

  const handleDeleteMultiple = () => {
    if (user && listSelectItem.length > 0) {
      deleteCartMultiple({
        id: user?._id || "",
        listIdProduct: listSelectItem,
      })
        .unwrap()
        .catch(() => handleOpenError(true));
    }
  };
  return (
    <section className="w-full px-5 mt-5 bg-white rounded-sm">
      <Modal
        variant="fixed"
        isOpenModal={openModal}
        onClick={() => setOpenModal(false)}
        className={{
          content: "bg-white w-[550px] h-[200px] rounded-md p-3",
        }}
      >
        <div className="flex flex-col justify-between h-full">
          <span className="font-semibold">
            Bạn chắc chắn muốn bỏ tất cả sản phẩm không hoạt động này?
          </span>
          <div className="flex justify-end text-xs gap-x-2">
            <Button
              variant="outLine"
              type="button"
              className="min-w-[70px]"
              onClick={() => {
                setOpenModal(false);
                handleDeleteMultiple();
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
      <h1 className="py-6 text-sm font-medium px-14 border-b-1 border-grayCa">
        Danh sách sản phẩm không hoạt động
      </h1>
      <div className="relative py-5">
        {listProductInactiveToCart.map((product) => {
          return (
            <CartItemExpired key={product._id} data={product}></CartItemExpired>
          );
        })}
        <div className="absolute inset-0 z-20 bg-white opacity-60"></div>
      </div>
      <div
        onClick={() => {
          setOpenModal(true);
        }}
        className="py-6 text-base font-medium text-center cursor-pointer hover:text-orange px-14 border-t-1 border-grayCa"
      >
        Bỏ toàn bộ sản phẩm không hoạt động
      </div>
    </section>
  );
}

export default ListProductExpired;
