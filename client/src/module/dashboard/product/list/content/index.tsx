import useTestContext from "@/hook/useTestContext";
import { IListProductProvide, ListProductContext } from "../context";
import { Fragment } from "react";
import { ProductShowList } from "./productShow";
import ProductShowGrid from "./productShow/ProductShowGrid";

function ProductContent() {
  const { showProduct } = useTestContext<IListProductProvide>(
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
  return <Fragment>{selectShowProduct(showProduct)}</Fragment>;
}

export default ProductContent;
