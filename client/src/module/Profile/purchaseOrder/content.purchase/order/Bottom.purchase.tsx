import { Button } from "@/components/button";
import { useAppSelector } from "@/hook";
import { RootState } from "@/stores";
import { useRepurchaseProductToCartMutation } from "@/stores/service/cart.service";
import { IResOrder } from "@/types/order.type";
import { cn } from "@/utils";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import ModalReasonCanceled from "../../modalReasonCanceled";
import { ModalNotification } from "@/components/modal";

type TProps = {
  data: IResOrder;
};

function BottomPurchase({ data }: TProps) {
  const {
    canceller,
    reasonCanceled,
    canceled_at,
    listProducts,
    paymentMethod,
    paymentStatus,
    total,
    statusOrder,
  } = data;

  const user = useAppSelector((state: RootState) => state.authSlice.user);

  const navigate = useNavigate();

  const [repurchaseProductToCart] = useRepurchaseProductToCartMutation();

  const [openModalReasonCanceled, setOpenModalReasonCanceled] =
    useState<boolean>(false);

  const [openModalNotification, setOpenModalNotification] =
    useState<boolean>(false);

  const handleOpenModalNotification = () => {
    setOpenModalNotification(!openModalNotification);
  };

  const handleOpenModalReasonCanceled = () => {
    setOpenModalReasonCanceled(!openModalReasonCanceled);
  };

  const handleRepurchaseOrder = async () => {
    if (user) {
      const listProductToCart = listProducts.map((product) => {
        return {
          productId: product.productId._id,
          size: product.size,
          quantity: product.quantity,
        };
      });
      await repurchaseProductToCart({ id: user._id, listProductToCart })
        .unwrap()
        .then((res) => {
          console.log("res: ", res);
          if (res) {
            toast("Đã thêm đơn hàng vào giỏ hàng", { type: "success" });
            navigate("/cart", {
              state: { type_Cart: "buy_now", listCartItem: res.listCartItem },
            });
          }
        })
        .catch(() => {
          handleOpenModalNotification();
        });
    }
  };

  const handlePayment = () => {
    navigate("/payment/" + data.codeOrder, {
      replace: true,
      state: { totalPricePayment: total },
    });
  };

  const selectButtonOrder = (statusOrder: string) => {
    switch (statusOrder) {
      case "pending":
        return (
          <div className="flex items-center justify-end text-sm gap-x-2">
            {paymentMethod === "vnpay" && paymentStatus !== "paid" && (
              <Button variant="default" onClick={handlePayment}>
                Thanh toán
              </Button>
            )}
            <Button variant="default" onClick={handleOpenModalReasonCanceled}>
              Hủy đơn hàng
            </Button>
          </div>
        );

      case "cancelled":
      case "completed":
        return (
          <div className="flex items-center justify-end text-sm gap-x-2">
            <Button variant="default" onClick={handleRepurchaseOrder}>
              Mua lại
            </Button>
          </div>
        );

      default:
        break;
    }
  };
  return (
    <>
      <ModalReasonCanceled
        isOpenModal={openModalReasonCanceled}
        onClick={handleOpenModalReasonCanceled}
        codeOrder={data.codeOrder}
      ></ModalReasonCanceled>
      <ModalNotification
        type="info"
        isOpenModal={openModalNotification}
        onClick={handleOpenModalNotification}
      >
        Xin lỗi, các sản phẩm của đơn hàng không còn bán hoặc hết hàng nên không
        thể mua lại
      </ModalNotification>
      <div
        className={cn(
          "flex items-center justify-end p-4 gap-x-2",
          statusOrder === "cancelled" && "justify-between"
        )}
      >
        {canceller && statusOrder === "cancelled" && (
          <div className="flex flex-col text-xs gap-y-2">
            <p>Đã hủy bởi {canceller?.role === "admin" ? "Admin" : "bạn"}</p>
            <span>
              <span className="mr-2 font-bold">Thời gian hủy:</span>
              <span>
                {new Date(canceled_at).toLocaleTimeString()},{" "}
                {new Date(canceled_at).toLocaleDateString()}
              </span>
            </span>
            <span>
              <span className="mr-2 font-bold">Lý do:</span>
              <span>{reasonCanceled}</span>
            </span>
          </div>
        )}
        {selectButtonOrder(statusOrder)}
      </div>
    </>
  );
}

export default BottomPurchase;
