import { IProductRes } from "@/types/product.type";
import Heading from "./Heading.card";
import Thumbnails from "./Thumbnails.card";
import Info from "./Info.card";
import CardSales from "./Sale.card";
import OutOfStock from "./OutOfStock.card";
import ProgressBar from "./ProgressBar.card";

interface ICardItemProps {
  type?: "flashSale" | "normal";
  product: IProductRes;
}

function Card({ type, product }: ICardItemProps) {
  return (
    <div className="relative card-item shadow-shadow77 shadow-grayCa rounded-sm bg-grayF5">
      {product.saleId?.discount && (
        <CardSales
          discount={product.saleId?.discount.toString()}
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
                  product.saleId?.discount
                    ? "line-through text-xs"
                    : "text-red-600 text-lg"
                }
              >
                {new Intl.NumberFormat().format(product.price)}₫
              </span>
              {product.saleId?.discount && (
                <span className="text-red-600 text-lg">
                  {new Intl.NumberFormat().format(
                    product.price -
                      (product.price * product.saleId?.discount) / 100
                  )}
                  ₫
                </span>
              )}
            </Card.Info>
          )}
          <Card.Info title="Đã bán">
            <span>{product.inventoryId.sold}</span>
          </Card.Info>
          {type === "flashSale" && (
            <Card.ProgressBar
              sold={product.saleId?.sold as number}
              quantity={product.saleId?.quantity as number}
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
