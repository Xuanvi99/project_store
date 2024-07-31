import Content from "./content";
import { CreatePdProvide } from "./context";
import Progress from "./content/Progress.create";
import HeaderProductDB from "../header.product";

function CreateProduct() {
  return (
    <div className="dashboard_product_create">
      <HeaderProductDB></HeaderProductDB>
      <div className="w-full h-full text-dark px-5">
        <div className="w-full min-h-[400px] bg-white mt-6 rounded-md p-5">
          <CreatePdProvide>
            <Progress></Progress>
            <Content></Content>
          </CreatePdProvide>
        </div>
      </div>
    </div>
  );
}

export default CreateProduct;
