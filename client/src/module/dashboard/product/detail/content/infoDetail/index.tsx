import ProductDesc from "./ProductDesc";
import ProductGeneral from "./ProductGeneral";
import ProductImages from "./ProductImages";

function InfoDetail() {
  return (
    <div className="flex flex-col w-full mx-auto gap-y-3">
      <h1 className="font-semibold">1.Thông tin chi tiết</h1>
      <div className="flex gap-x-5 w-[1000px] justify-between mx-auto">
        <ProductImages></ProductImages>
        <ProductGeneral></ProductGeneral>
      </div>
      <ProductDesc></ProductDesc>
    </div>
  );
}

export default InfoDetail;
