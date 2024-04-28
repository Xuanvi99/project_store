import { Button } from "../../../../components/button";

function ProductList() {
  return (
    <div className="w-full product">
      <div className="flex items-center justify-between w-full">
        <div className="text-3xl font-semibold ">Danh sách</div>
        <Button variant="default">+Thêm sản phẩm</Button>
      </div>
      <div className="w-full pb-5 mt-5 bg-white">s</div>
    </div>
  );
}

export default ProductList;
