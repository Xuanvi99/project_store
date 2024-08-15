import ProductDesc from "./ProductDesc.info";
import ProductGeneral from "./ProductGeneral.info";
import ProductImages from "./ProductImages.info";
import ProductSizeAndQuantity from "./ProductSizeAndQuantity.info";

function InfoDetail() {
  return (
    <div className="flex flex-col w-full p-5 mx-auto bg-white rounded-md gap-y-5 ">
      <h1 className="w-full mb-5 text-2xl font-semibold text-center text-orange">
        Thông tin chi tiết
      </h1>
      <div className="flex gap-x-5 w-[1000px] justify-between mx-auto">
        <div className="max-w-[400px] basis-2/5 ">
          <ProductImages></ProductImages>
        </div>
        <div className="max-w-[600px] basis-3/5">
          <ProductGeneral></ProductGeneral>
          <ProductSizeAndQuantity></ProductSizeAndQuantity>
        </div>
      </div>

      <ProductDesc></ProductDesc>
    </div>
  );
}

export default InfoDetail;
