import { Button } from "@/components/button";
import Content from "./Content.create";
import { CreatePdProvide } from "./CreatePdContext";
import Header from "./Header.create";
function CreateProduct() {
  return (
    <CreatePdProvide>
      <div className="w-full h-full text-dark">
        <div className="flex items-center justify-between w-full">
          <div className="text-xl font-semibold ">Tạo sản phẩm</div>
          <Button variant="default">Xem danh sách</Button>
        </div>
        <div className="w-full min-h-[400px] bg-white mt-6 rounded-md p-5 ">
          <Header></Header>
          <Content></Content>
        </div>
      </div>
    </CreatePdProvide>
  );
}

export default CreateProduct;
