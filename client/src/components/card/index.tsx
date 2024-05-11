import { IProductRes } from "@/types/product.type";
import Heading from "./Heading.card";
import Thumbnails from "./Thumbnails.card";
import Info from "./Info.card";
import CardSales from "./Sale.card";
import OutOfStock from "./OutOfStock.card";
import ProgressBar from "./ProgressBar.card";

interface ICardItemProps {
  type?: "flashSale" | "sale" | "normal";
  name?: string;
  product: IProductRes;
}

function Card({ type, product, name }: ICardItemProps) {
  return (
    <div className="relative rounded-sm card-item shadow-shadow77 shadow-grayCa bg-grayF5">
      {product.flashSaleId?.discount && (
        <CardSales
          discount={product.flashSaleId?.discount.toString()}
          type={product.is_sale}
        ></CardSales>
      )}
      <div className="flex flex-col">
        <Card.Thumbnails
          src={product?.thumbnail.url || ""}
          path={`/productDetail/${product?.slug}`}
        ></Card.Thumbnails>
        <div className="flex flex-col flex-1 text-sm gap-y-4 p-[10px]">
          <Card.Heading
            title={product?.name || ""}
            path={`/productDetail/${product?.slug}`}
          ></Card.Heading>
          {!product.inventoryId.stocked && (
            <Card.Info title="Giá">
              <span
                className={
                  product.flashSaleId?.discount
                    ? "line-through text-xs"
                    : "text-red-600 text-lg"
                }
              >
                {new Intl.NumberFormat().format(product.price)}₫
              </span>
              {product.flashSaleId?.discount && (
                <span className="text-lg text-red-600">
                  {new Intl.NumberFormat().format(
                    product.price -
                      (product.price * product.flashSaleId?.discount) / 100
                  )}
                  ₫
                </span>
              )}
            </Card.Info>
          )}
          <Card.Info title="Đã bán">
            <span>{product.sold}</span>
          </Card.Info>
          {name === "flashSale" && type === "flashSale" && (
            <Card.ProgressBar
              sold={product.flashSaleId?.sold as number}
              quantity={product.flashSaleId?.quantity as number}
            ></Card.ProgressBar>
          )}
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
Card.ProgressBar = ProgressBar;
Card.OutOfStock = OutOfStock;
