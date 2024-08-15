import useTestContext from "@/hook/useTestContext";
import { DetailProductContext, IDetailProductProvide } from "../../context";
import { cn, formatPrice } from "@/utils";
import { useEffect, useState } from "react";
import { IconStar } from "@/components/icon";
import { handleFormatStatusProduct } from "@/utils/product.utils";

function ProductGeneral() {
  const { product } = useTestContext<IDetailProductProvide>(
    DetailProductContext as React.Context<IDetailProductProvide>
  );

  const [star, setStar] = useState<string>("0");

  useEffect(() => {
    if (product) {
      if (product.commentIds.length === 0) {
        setStar("50");
      } else {
        const countStar = product.commentIds.reduce((a, b) => a + b.star, 0);
        const mediumStar =
          Math.round((countStar * 10) / product.commentIds.length) / 10;
        setStar("" + mediumStar);
      }
    }
  }, [product]);

  if (!product) {
    return;
  }

  return (
    <div className="flex flex-col w-full gap-y-5">
      <h1
        className={cn(
          "font-bold text-left pb-2 text-xl border-b-2 border-grayCa"
        )}
      >
        {product.name}
      </h1>
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
            {product?.commentIds.length}
          </p>
          Đánh Giá
        </li>
        <li className="border-l-[1px] border-grayCa"></li>
        <li className="flex items-center gap-x-2 text-gray">
          <p className="text-xl border-b-2 text-grayDark border-grayCa">
            {product?.sold}
          </p>
          Đã Bán
        </li>
      </ul>
      <div className="flex items-center justify-start text-sm text-grayDark gap-x-2">
        <span className="font-bold">Tình trạng:</span>
        <span>{handleFormatStatusProduct(product.status)}</span>
      </div>
      {product && product.is_sale ? (
        <div className="w-full bg-redLinear rounded p-[10px] grid grid-cols-2">
          <div className="grid grid-cols-1 grid-rows-3 text-white gap-y-2">
            <span>
              Giá sale:
              <strong className="ml-1 text-xl font-bold text-yellow">
                {formatPrice(product?.priceSale)}₫
              </strong>
            </span>
            <span className="flex items-center">
              Giá gốc:
              <strong className="ml-1 line-through ">
                {formatPrice(product?.price)}₫
              </strong>
            </span>
            <span>
              Tiết kiệm:
              <strong className="ml-1 text-xl font-bold text-yellow">
                {formatPrice(product?.price - product?.priceSale)}₫
              </strong>
            </span>
          </div>
          <div className="flex items-center justify-end">
            <img alt="" srcSet="/flashSales.png" className=" h-[80px] " />
          </div>
        </div>
      ) : (
        <div className="flex items-end gap-x-3">
          <span className="font-bold">Giá:</span>
          <span className="text-2xl font-bold text-red-600">
            {formatPrice(850000)}₫
          </span>
        </div>
      )}
      <div className="flex items-center justify-start text-sm text-grayDark gap-x-2">
        <span className="font-bold">Thương hiệu:</span>
        <span className="italic font-semibold text-orange">
          {product.categoryId.name}
        </span>
      </div>
      <div className="flex items-center text-sm font-semibold gap-x-2">
        <span>Số lượng trong kho:</span>
        <span className="text-orange">{product.inventoryId.total}</span>
      </div>
    </div>
  );
}

export default ProductGeneral;
