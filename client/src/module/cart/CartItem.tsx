import { IconDelete } from "@/components/icon";
import { Input } from "@/components/input";
import { useAppSelector } from "@/hook";
import { RootState } from "@/stores";
import {
  useDeleteCartOneMutation,
  useUpdateCartMutation,
} from "@/stores/service/cart.service";
import { ICartItem } from "@/types/cart.type";
import { cn } from "@/utils";
import { debounce } from "lodash";
import { useMemo, useRef, useState } from "react";

type TCartItemProps = {
  data: ICartItem;
  handleCheckCart: (checked: boolean, id: string) => void;
  handleUpdateCartItem: (id: string, quantity: number) => void;
  handleDeleteItem: (id: string) => void;
  handleOpenError: () => void;
  isChecked: boolean;
};

function CartItem({
  data,
  isChecked,
  handleCheckCart,
  handleUpdateCartItem,
  handleDeleteItem,
  handleOpenError,
}: TCartItemProps) {
  const user = useAppSelector((state: RootState) => state.authSlice.user);
  const { _id: id, size, quantity, productId: product } = data;

  const inputQuantityRef = useRef<HTMLInputElement>(null);

  const [updateCart, updateCartResult] = useUpdateCartMutation();
  const { isLoading } = updateCartResult;

  const [deleteCart] = useDeleteCartOneMutation();

  const [quantityOrder, setQuantityOrder] = useState<number>(quantity);

  const debounceHandleClickUpdate = useMemo(() => {
    return debounce(
      async (quantity: number) => {
        await updateCart({
          id: user?._id || "",
          productId: product._id,
          size,
          quantity,
        })
          .unwrap()
          .then(() => {
            handleUpdateCartItem(id, quantity);
          })
          .catch(() => {
            handleOpenError;
          });
      },
      500,
      { trailing: true }
    );
  }, [
    handleOpenError,
    handleUpdateCartItem,
    id,
    product._id,
    size,
    updateCart,
    user?._id,
  ]);

  const debounceHandleBlurUpdate = useMemo(() => {
    return debounce(
      async (e: React.FocusEvent<HTMLInputElement, Element>) => {
        let quantity = e.target.value;
        if (quantity === "" || quantity === "0") {
          quantity = "1";
        }
        await updateCart({
          id: user?._id || "",
          productId: product._id,
          size,
          quantity: Number(quantity),
        })
          .unwrap()
          .then(() => {
            handleUpdateCartItem(id, Number(quantity));
          })
          .catch(() => {
            handleOpenError;
          });
      },
      500,
      { trailing: true }
    );
  }, [
    handleOpenError,
    handleUpdateCartItem,
    id,
    product._id,
    size,
    updateCart,
    user?._id,
  ]);

  const handleDecrement = () => {
    if (quantityOrder - 1 < 1) return;
    setQuantityOrder((quantityOrder) => quantityOrder - 1);
    debounceHandleClickUpdate(quantityOrder - 1);
  };

  const handleIncrement = () => {
    setQuantityOrder((quantityOrder) => quantityOrder + 1);
    debounceHandleClickUpdate(quantityOrder + 1);
  };

  const handleChangeQuantity = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuantityOrder(Number(e.target.value));
  };

  const handleBlurQuantity = (
    e: React.FocusEvent<HTMLInputElement, Element>
  ) => {
    if (e.target.value === "" || e.target.value === "0") {
      setQuantityOrder(1);
    }
    debounceHandleBlurUpdate(e);
  };

  return (
    <section className="cart mt-5 w-full py-[30px] shadow-₫sm shadow-grayCa bg-white mx-auto max-w-[1160px] rounded-[3px] flex justify-between items-center">
      <div className="flex items-center ml-5 w-[500px] gap-x-10">
        <Input
          type="checkbox"
          name="checkbox"
          data-id={id}
          onChange={() => {
            handleCheckCart(!isChecked, id);
          }}
          checked={isChecked}
          className={{
            input: "w-5 h-5 cursor-pointer",
            wrap: "w-5 static",
          }}
        />
        <div className="flex gap-x-3">
          <img alt="" srcSet={product.thumbnail.url} className="w-[80px]" />
          <div className="flex flex-col">
            <span className="font-semibold">{product.name}</span>
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
          className={cn(
            "flex items-center justify-center h-10 text-grayDark",
            isLoading && "text-grayCa"
          )}
        >
          <button
            type="button"
            disabled={isLoading}
            onClick={handleDecrement}
            className="h-full px-3 text-xl bg-slate-300"
          >
            -
          </button>
          <input
            type="number"
            ref={inputQuantityRef}
            className="w-[50px] border-1 border-grayCa h-full text-center px-1 outline-none "
            onBlur={(e) => handleBlurQuantity(e)}
            onChange={(e) => handleChangeQuantity(e)}
            value={quantityOrder === 0 ? "" : quantityOrder}
          />
          <button
            onClick={handleIncrement}
            type="button"
            disabled={isLoading}
            className="h-full px-3 text-xl bg-slate-300"
          >
            +
          </button>
        </div>
        {product && product.is_sale === "sale" ? (
          <span className="flex items-center justify-center text-red-600">
            {new Intl.NumberFormat().format(product.priceSale * quantityOrder)}₫
          </span>
        ) : (
          <span className="flex items-center justify-center text-red-600">
            {new Intl.NumberFormat().format(product.price * quantityOrder)}₫
          </span>
        )}
      </div>
      <div className=" w-[100px] flex justify-center">
        <IconDelete
          onClick={async () => {
            await deleteCart({
              id: user?._id || "",
              productId: product._id,
              size,
            })
              .unwrap()
              .then(() => {
                handleDeleteItem(id);
              });
          }}
          size={30}
        ></IconDelete>
      </div>
    </section>
  );
}

export default CartItem;
