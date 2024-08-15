import ProductFilter from "./content/ProductFilter";
import ProductContent from "./content";
import StatisticsProduct from "./content/StatisticsProduct";
import { ListProductProvider } from "./context";
import HeaderProductDB from "../header.product.db";
import { useEffect } from "react";

function ListProduct() {
  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, []);
  return (
    <div className="Dashboard_product_List">
      <HeaderProductDB></HeaderProductDB>
      <div className="w-full px-6 pb-10 mt-[80px]">
        <StatisticsProduct></StatisticsProduct>
        <div className="p-5 mt-5 bg-white rounded-md">
          <ListProductProvider>
            <ProductFilter></ProductFilter>
            <ProductContent></ProductContent>
          </ListProductProvider>
        </div>
      </div>
    </div>
  );
}

export default ListProduct;
