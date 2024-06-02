import { Button } from "@/components/button";
import { IconAlert, IconDown } from "@/components/icon";
import { Input } from "@/components/input";
import Modal, { ModalNotification } from "@/components/modal";
import { useAppSelector, useHover } from "@/hook";
import { useEffect, useRef, useState } from "react";
import Tooltip from "../../../components/tooltip/index";
import PromotionDetail from "./PromotionDetail";
import useTestContext from "@/hook/useTestContext";
import { CartContext, TCartProvider } from "../context.cart";
import {
  useDeleteCartAllMutation,
  useDeleteCartMultipleMutation,
} from "@/stores/service/cart.service";
import { RootState } from "@/stores";
import generateUniqueId from "generate-unique-id";
import { useNavigate } from "react-router-dom";
import { formatPrice } from "@/utils";
function Footer() {
  const user = useAppSelector((state: RootState) => state.authSlice.user);
  const {
    handleOpenError,
    listProductActiveToCart,
    listCheckCart,
    listSelectItem,
    setListCheckCart,
    setListSelectItem,
    handleSetTotalPriceOrder,
    handleCheckAllCart,
  } = useTestContext<TCartProvider>(
    CartContext as React.Context<TCartProvider>
  );

  const navigate = useNavigate();

  const [deleteCartAll] = useDeleteCartAllMutation();
  const [deleteCartMultiple] = useDeleteCartMultipleMutation();

  const inputRef = useRef<HTMLInputElement | null>(null);
  const nodeRef = useRef<HTMLDivElement>(null);

  const { isHover } = useHover(nodeRef);

  const [openModal, setOpenModal] = useState<boolean>(false);
  const [totalPrice, setTotalPrice] = useState<number>(0);
  const [discount, setDiscount] = useState<number>(0);

  const handleDeleteMultiple = () => {
    if (user) {
      deleteCartMultiple({
        id: user?._id || "",
        listIdProduct: listSelectItem,
      })
        .unwrap()
        .then(() => {
          setListCheckCart([]);
          setListSelectItem([]);
        })
        .catch(() => handleOpenError(true));
    }
  };

  const handleDeleteAll = () => {
    if (user) {
      deleteCartAll(user?._id)
        .unwrap()
        .then(() => {
          setListCheckCart([]);
          setListSelectItem([]);
        })
        .catch(() => handleOpenError(true));
    }
  };

  useEffect(() => {
    const totalPriceOrder = listCheckCart.reduce((a, b) => {
      if (b.productId.is_sale === "sale") {
        return a + b.productId.priceSale * b.quantity;
      } else {
        return a + b.productId.price * b.quantity;
      }
    }, 0);
    handleSetTotalPriceOrder(totalPriceOrder);
  }, [handleSetTotalPriceOrder, listCheckCart]);

  useEffect(() => {
    const handleCalculatePrice = () => {
      const calculatePrice = listCheckCart.reduce((a, b) => {
        return a + b.productId.price * b.quantity;
      }, 0);
      const totalDiscount = listCheckCart.reduce((a, b) => {
        if (b.productId.is_sale === "sale") {
          return a + (b.productId.price - b.productId.priceSale) * b.quantity;
        } else {
          return 0;
        }
      }, 0);
      setTotalPrice(calculatePrice);
      setDiscount(totalDiscount);
    };
    handleCalculatePrice();
  }, [listCheckCart]);

  return (
    <section className="footer w-full mt-5 max-w-[1200px] mx-auto min-h-[60px] shadow-sm shadow-grayCa py-10 bg-white px-5 rounded-[3px] flex justify-between items-center">
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
                  listCheckCart.length === listProductActiveToCart.length
                    ? handleDeleteAll()
                    : handleDeleteMultiple();
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
          checked={
            listCheckCart.length === listProductActiveToCart.length
              ? true
              : false
          }
        />
        <div
          onClick={() => {
            if (inputRef.current) {
              handleCheckAllCart(true);
            }
          }}
          className="cursor-pointer hover:text-red-600"
        >
          Chọn Tất Cả ({listProductActiveToCart.length})
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
        </div>
        {listCheckCart.length > 0 ? (
          <Tooltip
            place="top"
            select={
              <div className="flex flex-col justify-between gap-y-1">
                <div ref={nodeRef} className="flex items-center gap-x-2">
                  <span className="text-2xl text-red-600 ">
                    {formatPrice(totalPrice - discount)}₫
                  </span>
                  <span className={isHover ? "rotate-0" : "rotate-180"}>
                    <IconDown size={18}></IconDown>
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs gap-x-2">
                  <span>Tiết kiệm</span>
                  <span className={"text-red-600"}>
                    {formatPrice(discount)}₫
                  </span>
                </div>
              </div>
            }
            className={{ select: "z-40", content: "-translate-x-3/4" }}
          >
            <PromotionDetail
              totalPrice={totalPrice}
              discount={discount}
            ></PromotionDetail>
          </Tooltip>
        ) : (
          <div className="text-2xl text-red-600 ">₫0</div>
        )}

        <Button
          variant="default"
          type="button"
          className="px-5"
          disabled={listCheckCart.length > 0 ? false : true}
          onClick={() => {
            const id = generateUniqueId({
              length: 64,
              useLetters: true,
              useNumbers: true,
            });
            localStorage.setItem(
              "selectProductCart",
              JSON.stringify({
                id,
                listIdProductOrder: listSelectItem,
              })
            );
            navigate(`/checkout/?id=${id}`);
          }}
        >
          Mua Hàng
        </Button>
      </div>
    </section>
  );
}

export default Footer;
