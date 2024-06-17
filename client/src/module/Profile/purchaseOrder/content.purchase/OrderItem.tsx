import { IconAlert, IconShoppingFee } from "@/components/icon";
import Tooltip from "@/components/tooltip";
import { IResOrder, TProductOrderItem } from "@/types/order.type";
import { cn, formatPrice } from "@/utils";
import { Button } from "@/components/button";
import { useState } from "react";
import { listHeaderOrder } from "@/constant/order.constant";
import { toast } from "react-toastify";
import ModalReasonCanceled from "../modalReasonCanceled";
import { IProductRes } from "@/types/product.type";
import { Link, useNavigate } from "react-router-dom";
import { useRepurchaseProductToCartMutation } from "@/stores/service/cart.service";
import { RootState } from "@/stores";
import { useAppSelector } from "@/hook";
import { ModalNotification } from "@/components/modal";
import { LazyLoadImage } from "react-lazy-load-image-component";

type TProps = {
  data: IResOrder;
};

function OrderItem({ data }: TProps) {
  const {
    listProducts,
    total,
    shippingFee,
    status,
    canceller,
    reasonCanceled,
    canceled_at,
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

  const titleStatusOrder = (status: string) => {
    const indexItem = listHeaderOrder.findIndex(
      (order) => order.status === status
    );
    return listHeaderOrder[indexItem].title;
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

  const selectButtonOrder = (status: string) => {
    switch (status) {
      case "pending":
        return (
          <div className="flex items-center justify-end text-sm gap-x-2">
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
        onClick={handleRepurchaseOrder}
        id={data._id}
      ></ModalReasonCanceled>
      <ModalNotification
        type="info"
        isOpenModal={openModalNotification}
        onClick={handleOpenModalNotification}
      >
        Xin lỗi, các sản phẩm của đơn hàng không còn bán hoặc hết hàng nên không
        thể mua lại
      </ModalNotification>
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
              return (
                <ProductItem key={product._id} data={product}></ProductItem>
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
          {canceller && status === "cancelled" && (
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
          {selectButtonOrder(status)}
        </div>
      </div>
    </>
  );
}

const ProductItem = ({ data }: { data: TProductOrderItem<IProductRes> }) => {
  const { productId, quantity, price, priceSale, size } = data;
  const { thumbnail, name, slug } = productId;

  return (
    <Link
      to={`/product_detail/${slug}`}
      className="flex w-full py-2 cursor-pointer gap-x-3 group"
    >
      {/* <img
          loading="lazy"
          alt="Thumbnail order"
          srcSet={thumbnail.url}
          className="w-full h-full"
        /> */}
      <LazyLoadImage
        alt="order"
        placeholderSrc={thumbnail.url}
        srcSet={thumbnail.url}
        effect="blur"
        className="h-[80px] min-w-[80px]"
      />
      <span className="flex flex-col w-full">
        <h1 className="group-hover:underline line-clamp-2">{name}</h1>
        <div className="flex flex-col text-sm text-gray98 gap-x-1">
          <span>x{quantity}</span>
          <span>size: {size}</span>
        </div>
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
    </Link>
  );
};

export default OrderItem;
