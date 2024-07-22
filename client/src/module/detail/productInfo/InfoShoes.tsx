import { Button } from "@/components/button";
import { IconShoppingCart, IconStar, IconTick } from "@/components/icon";
import useTestContext from "@/hook/useTestContext";
import { cn, formatPrice } from "@/utils";
import { useEffect, useState } from "react";
import { IProductDetailProvide, PDetailContext } from "../context";
import { ModalNotification } from "@/components/modal";
import { useAddToCartMutation } from "@/stores/service/cart.service";
import { useAppSelector } from "@/hook";
import { RootState } from "@/stores";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { IUser } from "@/types/user.type";

function InfoShoes() {
  const user: IUser | null = useAppSelector(
    (state: RootState) => state.authSlice.user
  );

  const { data, listProductItem } = useTestContext<IProductDetailProvide>(
    PDetailContext as React.Context<IProductDetailProvide>
  );

  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { slug } = useParams();
  const redirectUrl = import.meta.env.VITE_DOMAIN_CLIENT + pathname;

  const [addToCart] = useAddToCartMutation();

  const [star, setStar] = useState<string>("0");
  const [productOrder, setProductOrder] = useState<{
    size: string;
    quantity: number;
  }>({
    size: "",
    quantity: 1,
  });
  const [quantityOrder, setQuantityOrder] = useState<number>(1);
  const [selectSizeQuantityShoes, setSelectSizeQuantityShoes] = useState<{
    size: string;
    quantity: number;
  }>({
    size: "",
    quantity: 0,
  });

  const [openModal, setOpenModal] = useState<boolean>(false);

  const [notify, setNotify] = useState<{
    type: "success" | "error" | "info" | "warning" | "default";
    message: string;
  }>({ type: "default", message: "" });

  const handleIncrement = () => {
    let quantityShoes = selectSizeQuantityShoes.size
      ? selectSizeQuantityShoes.quantity
      : data?.inventoryId.total;
    quantityShoes = quantityShoes ? quantityShoes : 0;
    if (quantityOrder + 1 > quantityShoes) return;
    setQuantityOrder((quantityOrder) => quantityOrder + 1);
    setProductOrder({ ...productOrder, quantity: quantityOrder + 1 });
  };

  const handleDecrement = () => {
    if (quantityOrder - 1 === 0) return;
    setQuantityOrder((quantityOrder) => quantityOrder - 1);
    setProductOrder({ ...productOrder, quantity: quantityOrder - 1 });
  };

  const handleSelectSizeQuantity = (value: {
    size: string;
    quantity: number;
  }) => {
    if (selectSizeQuantityShoes.size === value.size) {
      setSelectSizeQuantityShoes({
        size: "",
        quantity: 0,
      });
      setProductOrder({ ...productOrder, size: "" });
      return;
    }
    setProductOrder({ ...productOrder, size: value.size });
    setSelectSizeQuantityShoes(value);
  };

  const handleBlurQuantityOrder = (
    e: React.FocusEvent<HTMLInputElement, Element>
  ) => {
    const quantityChange = Number(e.target.value);
    const quantityShoes = selectSizeQuantityShoes.size
      ? selectSizeQuantityShoes.quantity || 0
      : data?.inventoryId.total || 0;
    if (e.target.value === "") {
      setQuantityOrder(1);
    }
    if (quantityChange > quantityShoes) {
      setQuantityOrder(quantityShoes);
    }
  };

  const handleValidate = (func: () => void) => {
    if (productOrder.size === "") {
      setNotify({ type: "warning", message: "Bạn chưa chọn size giày" });
      setOpenModal(true);
    } else if (productOrder.quantity === 0) {
      setNotify({
        type: "warning",
        message: "Bạn chưa đặt số lượng sản phẩm",
      });
      setOpenModal(true);
    } else if (productOrder.quantity > selectSizeQuantityShoes.quantity) {
      setNotify({
        type: "warning",
        message: "Số lượng bạn đặt mua lớn hơn số lượng sản phẩm có sẵn",
      });
      setOpenModal(true);
    } else {
      func();
    }
  };

  const handleAddProductToCart = async () => {
    if (user && data) {
      await addToCart({ id: user._id, productId: data._id, ...productOrder })
        .unwrap()
        .then(() => {
          setNotify({
            type: "success",
            message: "Sản phẩm đã được thêm vào giỏ",
          });
        })
        .catch(() => {
          setNotify({
            type: "error",
            message: "Lỗi thêm sản phẩm",
          });
        })
        .finally(() => {
          setOpenModal(true);
        });
    }
  };

  const handleAddToCartBuyNow = async () => {
    if (user && data) {
      await addToCart({
        id: user._id,
        productId: data._id,
        ...productOrder,
      })
        .unwrap()
        .then((res) => {
          if (res) {
            const listCartItem = [res.cartItem];
            console.log("listCartItem: ", listCartItem);
            navigate("/cart", {
              state: { type_Cart: "buy_now", listCartItem },
            });
          }
        })
        .catch(() => {
          setNotify({
            type: "error",
            message: "Lỗi mua sản phẩm",
          });
          setOpenModal(true);
        });
    }
  };

  const handleLogin = async () => {
    const query = encodeURIComponent(redirectUrl);
    navigate("/auth/login?next=" + query, { state: { path: pathname } });
  };

  useEffect(() => {
    if (data) {
      if (data.commentIds.length === 0) {
        setStar("50");
      } else {
        const countStar = data.commentIds.reduce((a, b) => a + b.star, 0);
        const mediumStar =
          Math.round((countStar * 10) / data.commentIds.length) / 10;
        setStar("" + mediumStar);
      }
    }
  }, [data]);

  useEffect(() => {
    setSelectSizeQuantityShoes({
      size: "",
      quantity: 0,
    });
    setSelectSizeQuantityShoes({ size: "", quantity: 0 });
    setQuantityOrder(1);
    setOpenModal(false);
    setNotify({ type: "default", message: "" });
  }, [slug]);

  return (
    <div className="basis-5/12 max-w-[500px]">
      <ModalNotification
        type={notify.type}
        isOpenModal={openModal}
        onClick={() => setOpenModal(false)}
        time={700}
        className={{
          content: "w-[350px] gap-x-5 text-white font-semibold opacity-50",
        }}
      >
        <span>{notify.message}</span>
      </ModalNotification>
      <h2
        className={cn(
          "text-xl font-bold text-left pb-2",
          "border-b-2 border-grayCa"
        )}
      >
        {data?.name}
      </h2>
      <div className="flex flex-col mt-5 gap-y-5">
        <ul className="flex gap-x-5">
          <li className="flex items-center gap-x-2">
            <p className="text-xl text-red-600 border-b-2 border-red-600">
              {star[0] + "." + star[1]}
            </p>
            <span className="flex text-orange">
              <IconStar size={20}></IconStar>
            </span>
          </li>
          <li className="border-l-[1px] border-grayCa"></li>
          <li className="flex items-center gap-x-2 text-gray">
            <p className="text-xl border-b-2 text-grayDark border-grayCa">
              {data?.commentIds.length}
            </p>
            Đánh Giá
          </li>
          <li className="border-l-[1px] border-grayCa"></li>
          <li className="flex items-center gap-x-2 text-gray">
            <p className="text-xl border-b-2 text-grayDark border-grayCa">
              {data?.sold}
            </p>
            Đã Bán
          </li>
        </ul>
        <div className="flex flex-col justify-start text-sm text-grayDark gap-y-2">
          <span>
            Tình trạng:
            <span
              className={cn(
                "ml-2 text-danger",
                data?.status === "active" && "text-green"
              )}
            >
              {data?.inventoryId.stocked
                ? "Hết hàng"
                : data?.status === "active"
                ? "Đang bán"
                : " Ngừng bán"}
            </span>
          </span>
        </div>
      </div>
      {data && data.is_sale && (
        <div className="w-full bg-redLinear rounded mt-5 p-[10px] grid grid-cols-2">
          <div className="grid grid-cols-1 grid-rows-3 text-white gap-y-2">
            <span>
              Giá sale:
              <strong className="ml-1 text-xl font-bold text-yellow">
                {formatPrice(data?.priceSale)}₫
              </strong>
            </span>
            <span className="flex items-center">
              Giá gốc:
              <strong className="ml-1 line-through ">
                {formatPrice(data?.price)}₫
              </strong>
            </span>
            <span>
              Tiết kiệm:
              <strong className="ml-1 text-xl font-bold text-yellow">
                {formatPrice(data?.price - data?.priceSale)}₫
              </strong>
            </span>
          </div>
          <div className="flex items-center justify-end">
            <img alt="" srcSet="/flashSales.png" className=" h-[80px] " />
          </div>
        </div>
      )}
      {data && !data.is_sale && (
        <div className="flex items-end mt-5 gap-x-3">
          <span className="text-lg font-bold">Giá:</span>
          <span className="text-2xl font-bold text-red-600">
            {formatPrice(850000)}₫
          </span>
        </div>
      )}
      <div className="w-full border-dashed border-[1px] border-blue rounded-lg mt-[10px]">
        <div className="bg-[#f9f9f9]  p-[10px] flex gap-x-5">
          <img alt="" srcSet="/icon-discount-bag-v2.svg" />
          <span>
            <h3 className="font-bold">Mua càng nhiều, ưu đãi càng lớn</h3>
            <i className="mt-5 text-xs font-normal">
              (Ưu đãi có thể kết thúc sớm)
            </i>
          </span>
        </div>
        <div className="p-[10px] flex flex-col gap-y-2 text-sm ">
          <span className="flex items-center gap-x-2">
            <IconTick size={20}></IconTick>
            <p>Freeship khi mua 2 đôi</p>
          </span>
          <span className="flex items-center gap-x-2">
            <IconTick size={20}></IconTick>
            <p>Tặng tất theo sản phẩm(Tùy đôi)</p>
          </span>
          <span className="flex items-center gap-x-2">
            <IconTick size={20}></IconTick>
            <p>Mua 5 đôi tặng 1 đôi</p>
          </span>
        </div>
      </div>
      {data?.status === "active" && !data.inventoryId.stocked ? (
        <div className="flex flex-col mt-10 gap-y-10">
          <div className="grid grid-cols-[50px_calc(100%-50px)]">
            <span className="inline-block font-bold ">Size:</span>
            <div className="flex flex-wrap cursor-pointer gap-x-2 gap-y-2">
              {listProductItem &&
                listProductItem.length > 0 &&
                listProductItem.map((item, index) => {
                  return (
                    <button
                      key={index}
                      type="button"
                      disabled={item.quantity > 0 ? false : true}
                      data-value={item.size}
                      onClick={() =>
                        handleSelectSizeQuantity({
                          size: item.size,
                          quantity: item.quantity,
                        })
                      }
                      className={cn(
                        "px-[10px] py-[3px] border-[1px] rounded-md text-center border-gray text-gray hover:border-orange hover:text-orange",
                        selectSizeQuantityShoes.size === item.size
                          ? "border-orange text-orange"
                          : "",
                        item.quantity === 0 &&
                          "border-grayCa hover:border-grayCa text-grayCa"
                      )}
                    >
                      {item.size}
                    </button>
                  );
                })}
            </div>
          </div>
          <div className="flex items-center gap-x-3 ">
            <span className="inline-block font-bold ">Chọn số lượng:</span>
            <div className="flex items-center border-[1px] h-[40px] border-[#b5b4b4] text-grayDark">
              <button
                type="button"
                onClick={handleDecrement}
                className="h-full px-3 text-xl bg-slate-300"
              >
                -
              </button>
              <input
                type="number"
                className="w-[50px] text-center px-1 outline-none "
                size={6}
                min={1}
                onBlur={(e) => {
                  handleBlurQuantityOrder(e);
                }}
                onChange={(e) => {
                  setQuantityOrder(Number(e.target.value));
                }}
                value={quantityOrder === 0 ? "" : quantityOrder}
              />
              <button
                onClick={handleIncrement}
                type="button"
                className="h-full px-3 text-xl bg-slate-300"
              >
                +
              </button>
            </div>
            <span className="text-gray">
              (
              {selectSizeQuantityShoes.size === ""
                ? data?.inventoryId.total
                : selectSizeQuantityShoes.quantity}
              &nbsp;sản phẩm có sẵn)
            </span>
          </div>
          <div className="flex items-center mb-16 font-bold gap-x-3">
            <Button
              type="submit"
              variant="outLine-flex"
              onClick={() =>
                user ? handleValidate(handleAddProductToCart) : handleLogin
              }
              className="min-w-["
            >
              <IconShoppingCart size={20}></IconShoppingCart>
              Thêm vào giỏ hàng
            </Button>
            <Button
              type="submit"
              variant="outLine-flex"
              onClick={() => {
                user ? handleValidate(handleAddToCartBuyNow) : handleLogin();
              }}
            >
              Mua ngay
            </Button>
          </div>
        </div>
      ) : (
        <div className="w-full max-h-[100px] flex justify-center items-center my-10">
          <span className="p-2 text-lg font-semibold border-2 rounded-md border-orange">
            Sản phẩm hết hàng
          </span>
        </div>
      )}
    </div>
  );
}

export default InfoShoes;
