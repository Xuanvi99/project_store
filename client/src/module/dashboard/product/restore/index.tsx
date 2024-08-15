import HeaderProductDB from "../header.product.db";
import ListRestoreProduct from "./content";
import { RestoreProductProvide } from "./context";

function RestoreProduct() {
  return (
    <div className="Dashboard_product_List">
      <HeaderProductDB></HeaderProductDB>
      <div className="w-full px-6 pb-10 mt-[80px]">
        <RestoreProductProvide>
          <ListRestoreProduct></ListRestoreProduct>
        </RestoreProductProvide>
      </div>
    </div>
  );
}

export default RestoreProduct;
