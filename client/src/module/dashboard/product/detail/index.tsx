import HeaderProductDB from "../header.product";
import UpdateDetail from "./content/updateDetail";
import InfoDetail from "./content/infoDetail";
import { DetailProductProvide } from "./context";

function DetailProduct() {
  return (
    <div className="Dashboard_product_List">
      <HeaderProductDB></HeaderProductDB>
      <div className="w-full px-6 pb-10 mt-[80px]">
        <div className="flex flex-col p-5 bg-white rounded-md gap-y-5">
          <DetailProductProvide>
            <InfoDetail></InfoDetail>
            <UpdateDetail></UpdateDetail>
          </DetailProductProvide>
        </div>
      </div>
    </div>
  );
}

export default DetailProduct;
