import { IconBag } from "../../components/icon";
import { ICart } from "../../types/commonType";
import { cn } from "../../utils";
import HoverDropdown from "./HoverDropdown";

type TProps = {
  pathname: string;
  cart: ICart | null;
};

function LogoCart({ pathname, cart }: TProps) {
  return (
    <>
      {!pathname.includes("cart") && (
        <HoverDropdown
          select={
            <IconBag
              size={30}
              quantity={cart ? cart.listProduct.length : ""}
            ></IconBag>
          }
        >
          <div
            className={cn(
              "absolute top-[160%] left-2/4 transition-all -translate-x-3/4 min-w-[250px] min-h-[200px] border-2 rounded-lg z-50 hoverDropdown",
              "border-orange bg-white shadow-shadowButton flex items-center justify-center"
            )}
          >
            <div className="flex flex-col items-center justify-center w-full gap-y-2">
              {cart && cart.listProduct.length > 0 ? (
                <></>
              ) : (
                <p className="text-xs text-gray">
                  Chưa có sản phẩm trong giỏ hàng.
                </p>
              )}
            </div>
          </div>
        </HoverDropdown>
      )}
    </>
  );
}

export default LogoCart;
