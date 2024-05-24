import { IconDelete } from "@/components/icon";
import { useAppSelector } from "@/hook";
import useTestContext from "@/hook/useTestContext";
import { RootState } from "@/stores";
import { useDeleteCartOneMutation } from "@/stores/service/cart.service";
import { ICartItem } from "@/types/cart.type";
import { cn } from "@/utils";
import { CartContext, TCartProvider } from "../context.cart";

type TCartItemProps = {
  data: ICartItem;
};

function CartItemExpired({ data }: TCartItemProps) {
  const user = useAppSelector((state: RootState) => state.authSlice.user);

  const { handleOpenError } = useTestContext<TCartProvider>(
    CartContext as React.Context<TCartProvider>
  );

  const { size, quantity, productId: product } = data;

  const [deleteCart] = useDeleteCartOneMutation();

  return (
    <div className="cartItem mt-2 w-full py-[25px] shadow-₫sm shadow-grayCa  mx-auto  rounded-[3px] flex justify-between items-center ">
      <div className="flex items-center ml-5 w-[500px] gap-x-10">
        <div className="p-2 text-xs font-bold text-center text-white bg-red-600 rounded-full ">
          {product.status === "inactive" ? "NGỪNG BÁN" : "HẾT HÀNG"}
        </div>
        <div className="flex gap-x-3">
          <img alt="" srcSet={product.thumbnail.url} className="w-[80px]" />
          <div className="flex flex-col">
            <span className="font-semibold line-clamp-2">{product.name}</span>
            <span className="mt-auto text-sm text-gray">Size: {size}</span>
          </div>
        </div>
      </div>
      <div className="grid w-[560px] grid-cols-3 gap-x-2">
        <span className="flex items-center justify-center gap-x-2">
          {product && product.is_sale === "sale" ? (
            <>
              <p className="text-sm line-through text-gray">
                {new Intl.NumberFormat().format(product.price)}₫
              </p>
              <p>{new Intl.NumberFormat().format(product.priceSale)}₫</p>
            </>
          ) : (
            <p>{new Intl.NumberFormat().format(product.price)}₫</p>
          )}
        </span>
        <div
          className={cn("flex items-center justify-center h-10 text-grayDark")}
        >
          {quantity}
        </div>
        {product && product.is_sale === "sale" ? (
          <span className="flex items-center justify-center text-red-600">
            {new Intl.NumberFormat().format(product.priceSale * quantity)}₫
          </span>
        ) : (
          <span className="flex items-center justify-center text-red-600">
            {new Intl.NumberFormat().format(product.price * quantity)}₫
          </span>
        )}
      </div>
      <div className=" w-[100px] flex justify-center z-30">
        <IconDelete
          onClick={async () => {
            await deleteCart({
              id: user?._id || "",
              productId: product._id,
              size,
            })
              .unwrap()
              .catch(() => {
                handleOpenError(true);
              });
          }}
          size={30}
        ></IconDelete>
      </div>
    </div>
  );
}

export default CartItemExpired;
