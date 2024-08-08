import { IProductRes } from "@/types/product.type";
import Heading from "./Heading.card";
import Thumbnails from "./Thumbnails.card";
import Info from "./Info.card";
import CardSales from "./Sale.card";
import OutOfStock from "./OutOfStock.card";
import CardExpired from "./CardExpired";
import { formatPrice } from "@/utils";
import { useNavigate } from "react-router-dom";

interface ICardItemProps {
  product: IProductRes;
}

function Card({ product }: ICardItemProps) {
  const navigate = useNavigate();
  return (
    <div
      onClick={() =>
        navigate(`/product_detail/${product?.slug}_${product?._id}`)
      }
      className="relative rounded-sm card-item shadow-shadow1 cursor-pointer bg-grayF5 "
    >
      {product.is_sale && (
        <CardSales
          discount={Math.ceil(
            ((product.price - product.priceSale) * 100) / product.price
          )}
        ></CardSales>
      )}
      <div className="flex flex-col">
        <Card.Thumbnails src={product?.thumbnail.url || ""}></Card.Thumbnails>
        <div className="flex flex-col flex-1 text-sm gap-y-4 p-[10px]">
          <Card.Heading title={product?.name || ""}></Card.Heading>
          {!product.inventoryId.stocked && (
            <Card.Info title="Giá">
              <span
                className={
                  product.is_sale
                    ? "line-through text-xs"
                    : "text-red-600 text-lg"
                }
              >
                {formatPrice(product.price)}₫
              </span>
              {product.is_sale && (
                <span className="text-lg text-red-600">
                  {formatPrice(product.priceSale)}₫
                </span>
              )}
            </Card.Info>
          )}
          <Card.Info title="Đã bán">
            <span>{product.sold}</span>
          </Card.Info>
        </div>
      </div>
      {product.inventoryId.stocked && <Card.OutOfStock />}
      {product.status === "inactive" && <Card.CardExpired />}
    </div>
  );
}

export default Card;

Card.Info = Info;
Card.Heading = Heading;
Card.Thumbnails = Thumbnails;
Card.OutOfStock = OutOfStock;
Card.CardExpired = CardExpired;
