import { IconAlert } from "@/components/icon";
import Tooltip from "@/components/tooltip";
import { IResOrder } from "@/types/order.type";
import { cn, formatPrice } from "@/utils";

function ShippingFee({ data }: { data: IResOrder }) {
  const { listProducts, shippingFee } = data;
  return (
    <div className="flex items-center justify-end p-4 text-sm gap-x-2">
      <span>Phí vận chuyển:</span>
      <span
        className={cn(
          "flex items-center text-danger",
          listProducts.length > 2 && "underline"
        )}
      >
        {formatPrice(shippingFee)}₫
        {listProducts.length > 2 && (
          <Tooltip
            place="top"
            title={
              <div className="min-w-[150px] h-10 text-xs text-center">
                Phí vận chuyển được miễn phí khi mua 2 đôi trở lên
              </div>
            }
            className={{
              container: "z-40 text-danger",
              content: "-translate-x-3/4",
            }}
          >
            <IconAlert size={20}></IconAlert>
          </Tooltip>
        )}
      </span>
    </div>
  );
}

export default ShippingFee;
