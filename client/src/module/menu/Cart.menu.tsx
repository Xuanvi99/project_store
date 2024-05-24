import { RootState } from "@/stores";
import { IconBag } from "@/components/icon";
import { cn } from "@/utils";
import { useNavigate } from "react-router-dom";
import { useAppSelector } from "@/hook";
import { Button } from "@/components/button";
import { ICart } from "@/types/cart.type";
import Tooltip from "@/components/tooltip";

function Cart() {
  const navigate = useNavigate();

  const cart: ICart | null = useAppSelector(
    (state: RootState) => state.cartSlice.cart
  );

  return (
    <Tooltip
      place="bottom"
      select={
        <IconBag
          size={30}
          quantity={cart ? cart.listProduct.length : ""}
        ></IconBag>
      }
      onClick={() => navigate(`/cart`)}
      className={{
        content: "-translate-x-3/4",
      }}
    >
      <>
        {cart && cart.listProduct.length > 0 && (
          <div className="h-6 text-sm leading-6 text-grayCa">
            Sản phẩm đã thêm
          </div>
        )}
        <div
          className={cn(
            "flex flex-col items-center max-h-[174px] justify-start w-full gap-y-3",
            cart && cart.listProduct.length > 3 && "overflow-y-scroll"
          )}
        >
          {cart && cart.listProduct.length > 0 ? (
            cart.listProduct.map((item, index) => {
              return (
                <div
                  key={index}
                  onClick={() =>
                    navigate(`/product_detail/${item.productId.slug}`)
                  }
                  className="flex w-[350px] max-h-[50px] gap-x-1 text-xs"
                >
                  <img
                    alt=""
                    srcSet={item.productId.thumbnail.url}
                    className="min-w-[50px] h-[50px] rounded-md object-cover"
                  />
                  <div className="flex flex-col items-start justify-between w-[240px]">
                    <div className="line-clamp-2">{item.productId.name}</div>
                    <div>
                      <span className="text-grayDark">Size:</span>
                      <span className="ml-1 text-gray">{item.size}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-center text-sm min-w-[50px]  text-danger gap-x-1">
                    <span>x</span>
                    <span>{item.quantity}</span>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="text-xs text-gray w-[250px] h-[200px] flex flex-col justify-center items-center gap-y-3">
              <img alt="" srcSet="/cart.png" className="w-10" />
              <p>Chưa có sản phẩm trong giỏ hàng.</p>
            </div>
          )}
        </div>
        {cart && cart.listProduct.length > 0 && (
          <div className="flex justify-end w-full mt-3">
            <Button
              variant="default"
              type="button"
              className="text-xs"
              onClick={() => navigate(`/cart`)}
            >
              Xem giỏ hàng
            </Button>
          </div>
        )}
      </>
    </Tooltip>
  );
}

export default Cart;
