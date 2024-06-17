import { IconDelete } from "@/components/icon";
import { Input } from "@/components/input";
import { useAppSelector } from "@/hook";
import useTestContext from "@/hook/useTestContext";
import { RootState } from "@/stores";
import {
  useDeleteCartOneMutation,
  useUpdateCartMutation,
} from "@/stores/service/cart.service";
import { ICartItem } from "@/types/cart.type";
import { cn, formatPrice } from "@/utils";
import { debounce } from "lodash";
import { useMemo, useRef, useState } from "react";
import { CartContext, TCartProvider } from "../context.cart";
import { useNavigate } from "react-router-dom";
import { useGetProductItemQuery } from "@/stores/service/product.service";
import Modal from "@/components/modal";
import { Button } from "@/components/button";
import { IProductRes } from "@/types/product.type";
import { LazyLoadImage } from "react-lazy-load-image-component";

type TCartItemProps = {
  data: ICartItem<IProductRes>;
  handleCheckCart: (checked: boolean, id: string) => void;
  handleUpdateCartItem: (id: string, quantity: number) => void;
  handleDeleteItem: (id: string) => void;
  isChecked: boolean;
};

function CartItem({
  data: listCartItem,
  isChecked,
  handleCheckCart,
  handleUpdateCartItem,
  handleDeleteItem,
}: TCartItemProps) {
  const user = useAppSelector((state: RootState) => state.authSlice.user);

  const { handleOpenError } = useTestContext<TCartProvider>(
    CartContext as React.Context<TCartProvider>
  );
  const [openModal, setOpenModal] = useState<boolean>(false);

  const { _id: id, size, quantity, productId: product } = listCartItem;

  const { data: res } = useGetProductItemQuery({
    productId: product._id,
    size,
  });

  const navigate = useNavigate();

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
            handleOpenError(true);
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
            handleOpenError(true);
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
    if (res?.data && quantityOrder + 1 > res?.data.quantity) {
      const quantity = res?.data && res?.data.quantity;
      setOpenModal(true);
      setQuantityOrder(quantity || 1);
      return;
    }
    setQuantityOrder((quantityOrder) => quantityOrder + 1);
    debounceHandleClickUpdate(quantityOrder + 1);
  };

  const handleChangeQuantity = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuantityOrder(Number(e.target.value));
  };

  const handleBlurQuantity = (
    e: React.FocusEvent<HTMLInputElement, Element>
  ) => {
    const quantityOrder = Number(e.target.value);
    const quantity = res?.data && res?.data.quantity;
    if (quantity && quantityOrder > quantity) {
      setOpenModal(true);
      setQuantityOrder(quantity || 1);
      return;
    }
    if (e.target.value === "" || e.target.value === "0") {
      setQuantityOrder(1);
    }
    debounceHandleBlurUpdate(e);
  };

  return (
    <div className="cartItem mt-2 w-full py-[25px] shadow-₫sm shadow-grayCa bg-white mx-auto  rounded-[3px] flex justify-between items-center">
      <Modal
        variant="fixed"
        isOpenModal={openModal}
        onClick={() => setOpenModal(false)}
        className={{
          content: "bg-white w-[450px] h-[150px] rounded-md p-3",
        }}
      >
        <div className="flex flex-col justify-between h-full">
          <span className="font-semibold">
            Rất tiếc, bạn chỉ có thể mua tối đa {res?.data.quantity} sản phẩm
            của sản phẩm này.
          </span>
          <div className="flex justify-end text-xs gap-x-2">
            <Button
              variant="default"
              type="button"
              className="min-w-[70px]"
              onClick={() => {
                setOpenModal(false);
              }}
            >
              Có
            </Button>
          </div>
        </div>
      </Modal>
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
        <div
          className="flex cursor-pointer gap-x-3"
          onClick={() => {
            navigate(`/product_detail/${product.slug}`);
          }}
        >
          <LazyLoadImage
            alt="Cart"
            placeholderSrc={product.thumbnail.url}
            srcSet={product.thumbnail.url}
            effect="blur"
            className="w-[80px]"
          />
          <div className="flex flex-col">
            <span className="text-sm font-semibold line-clamp-2">
              {product.name}
            </span>
            <span className="mt-auto text-sm text-gray">Size: {size}</span>
          </div>
        </div>
      </div>
      <div className="grid w-[560px] grid-cols-3 gap-x-2">
        <span className="flex items-center justify-center gap-x-2">
          {product && product.is_sale === "sale" ? (
            <>
              <p className="text-sm line-through text-gray">
                {formatPrice(product.price)}₫
              </p>
              <p>{formatPrice(product.priceSale)}₫</p>
            </>
          ) : (
            <p>{formatPrice(product.price)}₫</p>
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
            {formatPrice(product.priceSale * quantityOrder)}₫
          </span>
        ) : (
          <span className="flex items-center justify-center text-red-600">
            {formatPrice(product.price * quantityOrder)}₫
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
    </div>
  );
}

export default CartItem;
