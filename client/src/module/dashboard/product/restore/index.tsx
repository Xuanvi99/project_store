import HeaderProductDB from "../header.product";
import ListRestoreProduct from "./content";
import { RestoreProductProvide } from "./context";

function RestoreProduct() {
  return (
    <div className="Dashboard_product_List">
      <HeaderProductDB></HeaderProductDB>
      <div className="w-full px-6 pb-10 mt-[80px]">
        <div className="p-5 bg-white rounded-md">
          <RestoreProductProvide>
            <ListRestoreProduct></ListRestoreProduct>
          </RestoreProductProvide>
        </div>
      </div>
    </div>
  );
}

export default RestoreProduct;
