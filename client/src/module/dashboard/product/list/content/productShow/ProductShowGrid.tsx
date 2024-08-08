import useTestContext from "@/hook/useTestContext";
import { IListProductProvide, ListProductContext } from "../../context";
import { cn } from "@/utils";
import PaginationListProduct from "../Pagination";
import ProductItemGrid from "../productItem/ProductItemGrid";
import { ProductItemGridSkeleton } from "../productSkeleton";

function ProductShowGrid() {
  const { data, statusQuery, filter } = useTestContext<IListProductProvide>(
    ListProductContext as React.Context<IListProductProvide>
  );
  return (
    <div className={cn("w-full mt-5 product_grid")}>
      {statusQuery === "pending" && (
        <div className="grid grid-cols-4 gap-5 ">
          {Array(filter.limit)
            .fill(0)
            .map((_, index) => {
              return (
                <ProductItemGridSkeleton key={index}></ProductItemGridSkeleton>
              );
            })}
        </div>
      )}
      {statusQuery === "fulfilled" &&
        data &&
        data.listProduct &&
        data.listProduct.length > 0 && (
          <div className="grid grid-cols-4 gap-5 ">
            {data.listProduct.map((product, index) => {
              return (
                <ProductItemGrid
                  key={index}
                  product={product}
                ></ProductItemGrid>
              );
            })}
          </div>
        )}
      <PaginationListProduct></PaginationListProduct>
      {statusQuery === "fulfilled" && data && data.listProduct.length < 0 && (
        <div className="flex flex-col justify-center items-center gap-y-3 font-semibold py-16 min-h-[400px]">
          <img alt="" srcSet="/orderNull.png" />
          <p>Không tìm thấy sản phẩm</p>
        </div>
      )}
    </div>
  );
}

export default ProductShowGrid;
