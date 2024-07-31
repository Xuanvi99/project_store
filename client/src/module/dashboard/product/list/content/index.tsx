import { Input } from "@/components/input";
import { cn } from "@/utils";
import { IListPdProvide, ListPdContext } from "../context";
import useTestContext from "@/hook/useTestContext";
import ProductItem from "./ProductItem";
import PaginationListProduct from "./Pagination";
import ProductItemSkeleton from "./ProductItemSkeleton";

function ShowListProduct() {
  const {
    data,
    statusQuery,
    filter,
    listSelectProductId,
    setListSelectProductId,
    handleCheckAllProduct,
  } = useTestContext<IListPdProvide>(
    ListPdContext as React.Context<IListPdProvide>
  );

  const handleCheckOneProduct = (checked: boolean, id: string) => {
    const listSelectProductIdCopy = [...listSelectProductId];
    if (checked) {
      setListSelectProductId([...listSelectProductIdCopy, id]);
    } else {
      setListSelectProductId((preData) => {
        return preData.filter((value) => id !== value);
      });
    }
  };

  return (
    <div
      className={cn(
        "w-full mt-5 list_Restore_Product ",
        data.listProduct.length > 0
          ? "shadow-shadow77 border-1 border-grayCa"
          : ""
      )}
    >
      {data.listProduct && data.listProduct.length > 0 && (
        <div
          className={cn(
            "w-full grid grid-cols-[50px_350px_100px_100px_100px_100px_100px_auto] grid-rows-1 place-items-center",
            "font-semibold bg-slate-100 text-sm py-3 border-b-1 border-b-grayCa"
          )}
        >
          <Input
            type="checkbox"
            name="checkAll"
            className={{
              input: "w-5 h-5 cursor-pointer",
              wrap: "w-5 static",
            }}
            onChange={(event) => {
              handleCheckAllProduct(event.target.checked);
            }}
            checked={
              listSelectProductId.length === data.listProduct.length
                ? true
                : false
            }
          />
          <span className="w-full">Sản Phẩm</span>
          <span>Danh Mục</span>
          <span>Giá hiện tại</span>
          <span>Số Lượng</span>
          <span>Đã Bán</span>
          <span>Trạng Thái</span>
          <span>Hoạt Động</span>
        </div>
      )}
      {statusQuery === "pending" &&
        Array(filter.limit)
          .fill(0)
          .map((_, index) => {
            return (
              <ProductItemSkeleton
                key={index}
                index={index}
              ></ProductItemSkeleton>
            );
          })}
      {statusQuery === "fulfilled" &&
      data &&
      data.listProduct &&
      data.listProduct.length > 0 ? (
        <>
          {data.listProduct.map((product, index) => {
            return (
              <ProductItem
                key={product._id}
                data={product}
                index={index}
                handleCheckOneProduct={handleCheckOneProduct}
                isChecked={
                  listSelectProductId.includes(product._id) ? true : false
                }
              ></ProductItem>
            );
          })}
          <PaginationListProduct></PaginationListProduct>
        </>
      ) : (
        <div className="flex flex-col justify-center items-center gap-y-3 font-semibold py-16 min-h-[400px]">
          <img alt="" srcSet="/orderNull.png" />
          <p>Không tìm thấy sản phẩm</p>
        </div>
      )}
    </div>
  );
}

export default ShowListProduct;
