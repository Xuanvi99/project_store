import useTestContext from "@/hook/useTestContext";
import { IListProductProvide, ListProductContext } from "../context";
import { Fragment } from "react";
import { ProductShowList } from "./productShow";
import ProductShowGrid from "./productShow/ProductShowGrid";

function ProductContent() {
  const { showProduct, data } = useTestContext<IListProductProvide>(
    ListProductContext as React.Context<IListProductProvide>
  );

  const selectShowProduct = (showProduct: "list" | "grid") => {
    switch (showProduct) {
      case "list":
        return <ProductShowList></ProductShowList>;

      case "grid":
        return <ProductShowGrid></ProductShowGrid>;

      default:
        break;
    }
  };
  return (
    <Fragment>
      {data.listProduct.length > 0 ? (
        selectShowProduct(showProduct)
      ) : (
        <div className="flex flex-col justify-center items-center gap-y-3 font-semibold py-16 min-h-[400px]">
          <img alt="" srcSet="/orderNull.png" />
          <p>Không tìm thấy sản phẩm</p>
        </div>
      )}
    </Fragment>
  );
}

export default ProductContent;
