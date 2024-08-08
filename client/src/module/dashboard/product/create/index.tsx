import Content from "./content";
import { CreateProductProvide } from "./context";
import Progress from "./content/Progress.create";
import HeaderProductDB from "../header.product";

function CreateProduct() {
  return (
    <div className="dashboard_product_create">
      <HeaderProductDB></HeaderProductDB>
      <div className="w-full text-dark px-5 mt-[90px]">
        <div className="w-full min-h-[400px] bg-white mt-6 rounded-md p-5">
          <CreateProductProvide>
            <Progress></Progress>
            <Content></Content>
          </CreateProductProvide>
        </div>
      </div>
    </div>
  );
}

export default CreateProduct;
