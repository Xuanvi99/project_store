import FilterProductDB from "./content/FilterProductDB";
import ShowListProduct from "./content";
import StatisticsProduct from "./content/StatisticsProduct";
import { ListProductProvider } from "./context";
import HeaderProductDB from "../header.product";

function ListProduct() {
  return (
    <div className="Dashboard_product_List">
      <HeaderProductDB></HeaderProductDB>
      <div className="w-full px-6 pb-10 mt-5">
        <StatisticsProduct></StatisticsProduct>
        <div className="p-5 bg-white mt-5 rounded-md">
          <ListProductProvider>
            <FilterProductDB></FilterProductDB>
            <ShowListProduct></ShowListProduct>
          </ListProductProvider>
        </div>
      </div>
    </div>
  );
}

export default ListProduct;
