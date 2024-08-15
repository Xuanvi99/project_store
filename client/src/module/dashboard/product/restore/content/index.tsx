import { IconSearch } from "@/components/icon";
import { Input } from "@/components/input";
import useTestContext from "@/hook/useTestContext";
import { cn } from "@/utils";
import { debounce } from "lodash";
import { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { IRestoreProductProvide, RestoreProductContext } from "../context";
import ProductItemSkeleton from "./ProductItemSkeleton.Restore";
import ProductItem from "./ProductItem.Restore";
import PaginationRestore from "./Pagination.Restore";
import IconRightArrow from "@/components/icon/IconRightArrow";
import { Dropdown } from "@/components/dropdown";
import { optionLimitList } from "@/constant/category.constant";
import LoadingSpinner from "@/components/loading";

function ListRestoreProduct() {
  const {
    data,
    statusQuery,
    params,
    listSelectProductId,
    isLoadingQuery,
    setListSelectProductId,
    handleSetParams,
  } = useTestContext<IRestoreProductProvide>(
    RestoreProductContext as React.Context<IRestoreProductProvide>
  );

  const [searchParams, setSearchParams] = useSearchParams();

  const [textSearch, setTextSearch] = useState<string>("");

  const debounceHandleSearch = useMemo(() => {
    return debounce(
      (event: React.ChangeEvent<HTMLInputElement>) => {
        searchParams.set("search", event.target.value);
        setSearchParams(searchParams);
      },
      500,
      { trailing: true }
    );
  }, [searchParams, setSearchParams]);

  const handleChangeSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTextSearch(event.target.value);
    debounceHandleSearch(event);
  };

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

  if (data && data.listProduct.length === 0 && params.search === "") {
    return (
      <div className="flex flex-col items-center justify-center h-[350px] font-semibold gap-y-3">
        <img alt="" srcSet="/orderNull.png" />
        <p>Không tìm thấy sản phẩm</p>
      </div>
    );
  }

  return (
    <div className="restore_product w-full rounded-md min-h-[400px] p-5 bg-white">
      <Input
        type="text"
        name="search"
        id="search"
        value={textSearch}
        onChange={(event) => handleChangeSearch(event)}
        placeholder="Tìm kiếm tên sản phẩm hoặc theo danh mục"
        className={{
          input:
            "w-full pl-10 outline-none text-base py-2 border-1 border-grayCa placeholder:text-grayCa ",
        }}
        autoComplete="off"
      >
        <div className="absolute text-black -translate-y-1/2 top-1/2 left-2">
          <IconSearch size={25}></IconSearch>
        </div>
      </Input>
      <div className="flex items-center mt-5 text-sm font-semibold text-end gap-x-2">
        <span className="flex items-center gap-x-1">
          <IconRightArrow size={10}></IconRightArrow>
          <span>Hiện thị:</span>
        </span>
        {data.amountProductFound > 5 ? (
          <Dropdown
            className={{
              wrap: "min-w-[50px]",
              select: "h-7 rounded-md text-dark",
              option: "min-w-[50px] text-center",
            }}
            title={"" + params.limit}
            value={"" + params.limit}
            options={optionLimitList}
            handleSelect={(option) => {
              searchParams.set("limit", option.value);
              setSearchParams(searchParams);
              handleSetParams({ limit: +option.value });
            }}
          />
        ) : (
          <span>{data.amountProductFound}</span>
        )}
        <span>/</span>
        {isLoadingQuery ? (
          <LoadingSpinner className="border-orange border-r-transparent"></LoadingSpinner>
        ) : (
          <span className="font-semibold text-danger">
            {data.amountProductFound}
          </span>
        )}
        <span> (sản phẩm)</span>
      </div>
      <div
        className={cn(
          "w-full mt-5 list_Restore_Product ",
          data.listProduct.length > 0
            ? "shadow-shadow1 border-1 border-grayCa"
            : ""
        )}
      >
        {data.listProduct && data.listProduct.length > 0 && (
          <div
            className={cn(
              "w-full grid grid-cols-[50px_350px_100px_150px_150px_100px_auto] grid-rows-1 place-items-center",
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
              onChange={() => {}}
            />
            <span className="w-full">Sản Phẩm</span>
            <span>Danh Mục</span>
            <span>Ngày Xóa</span>
            <span>Người Xóa</span>
            <span>Chức Vụ</span>
            <span>Hoạt Động</span>
          </div>
        )}
        {statusQuery === "pending" &&
          Array(params.limit)
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
            <PaginationRestore></PaginationRestore>
          </>
        ) : (
          <div className="flex flex-col justify-center items-center gap-y-3 font-semibold py-16 min-h-[400px]">
            <img alt="" srcSet="/orderNull.png" />
            <p>Không tìm thấy sản phẩm</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default ListRestoreProduct;
