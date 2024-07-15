import { TProductOrderItem } from "@/types/order.type";
import { IProductRes } from "@/types/product.type";
import { formatPrice } from "@/utils";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { Link } from "react-router-dom";

function ProductItem({ data }: { data: TProductOrderItem<IProductRes> }) {
  const { productId, quantity, price, priceSale, size } = data;
  const { thumbnail, name, slug, _id } = productId;

  return (
    <Link
      to={`/product_detail/${slug}_${_id}`}
      className="flex w-full py-2 cursor-pointer gap-x-3 group"
    >
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
          <p className="text-danger">{formatPrice(price)}₫</p>
        )}
      </div>
    </Link>
  );
}

export default ProductItem;
