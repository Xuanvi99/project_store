import HeaderProductDB from "../header.product.db";
import { DetailProductProvide } from "./context";
import { useEffect } from "react";
import DetailContent from "./content";

function DetailProduct() {
  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, []);
  return (
    <div className="Dashboard_product_List">
      <HeaderProductDB></HeaderProductDB>
      <DetailProductProvide>
        <DetailContent></DetailContent>
      </DetailProductProvide>
    </div>
  );
}

export default DetailProduct;
