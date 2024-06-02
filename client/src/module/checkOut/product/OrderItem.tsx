import { ICartItem } from "@/types/cart.type";
import { formatPrice } from "@/utils";

function OrderItem({ data }: { data: ICartItem }) {
  const { productId, quantity } = data;
  return (
    <div className="flex items-center w-full py-5">
      <div className="flex items-center w-1/2 text-sm font-normal gap-x-2">
        <img
          alt=""
          srcSet={productId.thumbnail.url}
          className="max-w-[80px] w-full"
        />
        <span className="line-clamp-1">{productId.name}</span>
      </div>
      <div className="grid w-1/2 grid-cols-3 text-sm text-center text-grayDark gap-x-5">
        <span>
          {formatPrice(
            productId.is_sale === "sale" ? productId.priceSale : productId.price
          )}
          ₫
        </span>
        <span>{quantity}</span>
        <span className="text-danger">
          {formatPrice(
            quantity *
              Number(
                productId.is_sale === "sale"
                  ? productId.priceSale
                  : productId.price
              )
          )}
          ₫
        </span>
      </div>
    </div>
  );
}

export default OrderItem;
