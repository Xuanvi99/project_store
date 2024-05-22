import { IProductRes } from "@/types/product.type";
import Heading from "./Heading.card";
import Thumbnails from "./Thumbnails.card";
import Info from "./Info.card";
import CardSales from "./Sale.card";
import OutOfStock from "./OutOfStock.card";

interface ICardItemProps {
  product: IProductRes;
}

function Card({ product }: ICardItemProps) {
  return (
    <div className="relative rounded-sm card-item shadow-shadow77 shadow-grayCa bg-grayF5">
      {product.is_sale === "sale" && (
        <CardSales
          discount={Math.ceil(
            ((product.price - product.priceSale) * 100) / product.price
          )}
        ></CardSales>
      )}
      <div className="flex flex-col">
        <Card.Thumbnails
          src={product?.thumbnail.url || ""}
          path={`/product_detail/${product?.slug}`}
        ></Card.Thumbnails>
        <div className="flex flex-col flex-1 text-sm gap-y-4 p-[10px]">
          <Card.Heading
            title={product?.name || ""}
            path={`/product_detail/${product?.slug}`}
          ></Card.Heading>
          {!product.inventoryId.stocked && (
            <Card.Info title="Giá">
              <span
                className={
                  product.is_sale === "sale"
                    ? "line-through text-xs"
                    : "text-red-600 text-lg"
                }
              >
                {new Intl.NumberFormat().format(product.price)}₫
              </span>
              {product.is_sale === "sale" && (
                <span className="text-lg text-red-600">
                  {new Intl.NumberFormat().format(product.priceSale)}₫
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
    </div>
  );
}

export default Card;

Card.Info = Info;
Card.Heading = Heading;
Card.Thumbnails = Thumbnails;
Card.OutOfStock = OutOfStock;
