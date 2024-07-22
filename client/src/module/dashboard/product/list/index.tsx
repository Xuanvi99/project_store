import { cn } from "@/utils";
import HeaderProductDB from "../header";
import { ListProductProvider } from "./context";
import FilterProductDB from "./Filter";
import { Input } from "@/components/input";

function ListProduct() {
  return (
    <ListProductProvider>
      <div className="Dashboard_product">
        <HeaderProductDB></HeaderProductDB>
        <div className="w-full px-6 pb-10 mt-5">
          <div className="p-5 bg-white">
            <FilterProductDB></FilterProductDB>
            <div className="w-full mt-5 rounded-md list_Product shadow-shadow77 border-1 border-grayCa ">
              <div
                className={cn(
                  "w-full grid grid-cols-[50px_350px_100px_100px_100px_100px_100px_auto] grid-rows-1 place-items-center",
                  "font-semibold bg-slate-100 text-sm py-3 border-b-1 border-b-grayCa"
                )}
              >
                <span>
                  <Input
                    type="checkbox"
                    name="checkboxAll"
                    className={{
                      input: "w-5 h-5 cursor-pointer",
                      wrap: "w-5 static",
                    }}
                  />
                </span>
                <span className="w-full">Sản Phẩm</span>
                <span>Danh Mục</span>
                <span>Giá</span>
                <span>Số Lượng</span>
                <span>Đã Bán</span>
                <span>Trạng Thái</span>
                <span>Hoạt Động</span>
              </div>
              {/* {statusCallApi === "pending" &&
                Array(10)
                  .fill(0)
                  .map((_, index) => {
                    return (
                      <ProductItemSkeleton
                        key={index}
                        index={index}
                      ></ProductItemSkeleton>
                    );
                  })}
              {listProduct &&
                listProduct.length > 0 &&
                listProduct.map((product, index) => {
                  return (
                    <ProductItem
                      key={product._id}
                      data={product}
                      index={index}
                    ></ProductItem>
                  );
                })}
              {listProduct && listProduct.length > 0 && (
                <PaginationProduct
                  totalPage={totalPage}
                  filter={filter}
                  handleSetFilter={handleSetFilter}
                ></PaginationProduct>
              )} */}
            </div>
          </div>
        </div>
      </div>
    </ListProductProvider>
  );
}

export default ListProduct;
