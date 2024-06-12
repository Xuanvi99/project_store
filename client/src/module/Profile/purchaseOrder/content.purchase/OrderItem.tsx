import { IconAlert, IconShoppingFee } from "@/components/icon";
import Tooltip from "@/components/tooltip";
import { IResOrder } from "@/types/order.type";
import { cn, formatPrice } from "@/utils";
import { Button } from "@/components/button";
import { useState } from "react";
import ModalReasonCanceled from "@/components/modal/ModalReasonCanceled";
import { listHeaderOrder } from "@/constant/order.constant";
import { RootState } from "@/stores";
import { useAppSelector } from "@/hook";

type TProps = {
  data: IResOrder;
};

function OrderItem({ data }: TProps) {
  const user = useAppSelector((state: RootState) => state.authSlice.user);

  const {
    listProducts,
    total,
    shippingFee,
    status,
    canceller,
    reasonCanceled,
  } = data;

  const [openModal, setOpenModal] = useState<boolean>(false);

  const handleSetOpenModal = () => {
    setOpenModal(!openModal);
  };

  const titleStatusOrder = (status: string) => {
    const indexItem = listHeaderOrder.findIndex(
      (order) => order.status === status
    );
    return listHeaderOrder[indexItem].title;
  };

  const selectButtonOrder = (status: string) => {
    switch (status) {
      case "pending":
        return (
          <div className="flex items-center justify-end text-sm gap-x-2">
            <span className="px-3 py-2 border-2 rounded-md text-gray98 border-gray98 ">
              Chờ xác nhận
            </span>
            <Button variant="default" onClick={handleSetOpenModal}>
              Hủy đơn hàng
            </Button>
          </div>
        );

      case "cancelled":
      case "completed":
        return (
          <div className="flex items-center justify-end text-sm gap-x-2">
            <Button variant="default">Mua lại</Button>
          </div>
        );

      case "confirmed":
        return (
          <div className="flex items-center justify-end text-sm gap-x-2">
            <span className="px-3 py-2 border-2 rounded-md text-gray98 border-gray98 ">
              Chờ giao hàng
            </span>
          </div>
        );

      case "shipping":
        return (
          <div className="flex items-center justify-end text-sm gap-x-2">
            <span className="px-3 py-2 border-2 rounded-md text-gray98 border-gray98 ">
              Đang giao hàng
            </span>
          </div>
        );

      default:
        break;
    }
  };

  return (
    <>
      <ModalReasonCanceled
        isOpenModal={openModal}
        onClick={handleSetOpenModal}
      ></ModalReasonCanceled>
      <div className="w-full p-4 bg-white rounded-sm">
        <div className="flex items-center justify-end pb-3 border-dashed gap-x-2 border-b-1 border-b-grayCa">
          {status === "completed" && (
            <>
              <div className="flex items-center text-xs gap-x-1 text-green ">
                <IconShoppingFee size={20}></IconShoppingFee>
                <div className="flex">
                  <span>Giao hàng thành công</span>
                  <Tooltip
                    place="bottom"
                    select={<IconAlert size={15}></IconAlert>}
                    className={{
                      select: "z-40 text-gray",
                      content: "-translate-x-3/4",
                    }}
                  >
                    <div className="min-w-[150px] h-10 text-xs text-center">
                      Phí vận chuyển được miễn phí khi mua 2 đôi trở lên
                    </div>
                  </Tooltip>
                </div>
              </div>
              <div className="bg-grayCa w-[1px] h-[20px]"></div>
            </>
          )}
          <div className=" text-danger">
            {titleStatusOrder(status).toLocaleUpperCase()}
          </div>
        </div>
        <div className="border-dashed border-b-1 border-b-grayCa">
          {listProducts &&
            listProducts.map((product) => {
              const { productId, quantity, price, priceSale } = product;
              const { thumbnail, name } = productId;
              return (
                <div key={product._id} className="flex w-full py-2 gap-x-3">
                  <img
                    alt=""
                    srcSet={thumbnail.url}
                    className="max-h-[80px] w-[80px]"
                  />
                  <span className="flex flex-col w-full">
                    <h1>{name}</h1>
                    <span>x{quantity}</span>
                  </span>
                  <div className="flex items-center justify-end min-w-[100px] text-sm">
                    {priceSale > 0 ? (
                      <span className="flex gap-x-2">
                        <p className="text-sm line-through text-gray">
                          {formatPrice(price)}₫
                        </p>
                        <p className="text-danger">{formatPrice(priceSale)}₫</p>
                      </span>
                    ) : (
                      <p>{formatPrice(price)}₫</p>
                    )}
                  </div>
                </div>
              );
            })}
        </div>
        <div className="flex items-center justify-end p-4 text-sm gap-x-2">
          <span>Phí vận chuyển:</span>
          <span>{formatPrice(shippingFee)}₫</span>
        </div>
        <div className="border-dashed border-t-1 border-t-grayCa">
          <div className="flex items-center justify-end p-4 gap-x-2">
            <span>Thành tiền:</span>
            <span className="text-xl text-danger">{formatPrice(total)}₫</span>
          </div>
        </div>
        <div
          className={cn(
            "flex items-center justify-end p-4 gap-x-2",
            status === "cancelled" && "justify-between"
          )}
        >
          {status === "cancelled" && (
            <div className="flex flex-col text-xs gap-y-2">
              <p>Đã hủy bởi {canceller === user?._id ? "bạn" : "Admin"}</p>
              <span>
                <span className="mr-2 font-bold">Lý do:</span>
                <span>{reasonCanceled}</span>
              </span>
            </div>
          )}
          {selectButtonOrder(status)}
        </div>
      </div>
    </>
  );
}

export default OrderItem;
