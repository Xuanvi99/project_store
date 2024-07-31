import HeaderProductDB from "../header.product";
import ListRestoreProduct from "./content";
import { RestorePdProvide } from "./context";

function RestoreProduct() {
  return (
    <div className="Dashboard_product_List">
      <HeaderProductDB></HeaderProductDB>
      <div className="w-full px-6 pb-10 mt-5">
        <div className="p-5 bg-white rounded-md">
          <RestorePdProvide>
            <ListRestoreProduct></ListRestoreProduct>
          </RestorePdProvide>
        </div>
      </div>
    </div>
  );
}

export default RestoreProduct;
