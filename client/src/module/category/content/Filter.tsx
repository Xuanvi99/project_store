import { Dropdown } from "@/components/dropdown";
import { OptionPrice, OptionSearch } from "@/constant/category.constant";
import useTestContext from "@/hook/useTestContext";
import { cn } from "@/utils";
import React, { useEffect, useState } from "react";
import { useLocation, useParams, useSearchParams } from "react-router-dom";
import { CategoryContext, ICategoryProvide } from "../context";

function Filter() {
  const { pathname } = useLocation();
  const { slug } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();

  const { handleSetFilter, handleSetData, data, filter } =
    useTestContext<ICategoryProvide>(
      CategoryContext as React.Context<ICategoryProvide>
    );
  console.log(filter);

  const [active, setActive] = useState<string>(filter.sortBy);
  console.log("active: ", active);

  const handleActive = (id: string) => {
    setActive(id);
  };

  useEffect(() => {
    if (slug) {
      handleActive("1");
    }
  }, [slug]);

  return (
    <div className="flex flex-col items-start w-full mb-2 gap-y-5">
      {pathname === "/search" && (
        <>
          <div className="flex items-center justify-center w-full text-xl font-bold">
            Tìm Kiếm Sản Phẩm
          </div>
          <div className="flex items-center justify-between w-full font-bold">
            <div className="flex basis-5/6 gap-x-2">
              <span className="text-orange">Từ khóa:</span>
              <span className="max-w-[400px] line-clamp-1 whitespace-nowrap font-semibold text-sm">
                "{searchParams.get("s") ? searchParams.get("s") : "Tất cả"}"
              </span>
            </div>
          </div>
        </>
      )}
      {slug && (
        <>
          <div className="flex items-center justify-center w-full text-xl font-bold">
            Danh mục sản phẩm
          </div>
          <div
            className={cn(
              "w-full mb-5 text-2xl font-bold text-center text-orange",
              slug === "Sale" ? "flex justify-center items-center gap-x-2" : ""
            )}
          >
            <span>Giày {slug.charAt(0).toUpperCase() + slug.slice(1)}</span>
            {slug === "Sale" && (
              <img
                src=""
                alt=""
                srcSet="/flashSales.png"
                className="h-[30px]"
              />
            )}
          </div>
        </>
      )}
      <div className="flex items-center justify-between w-full mb-3">
        <div className="flex items-center gap-x-2">
          <span className="font-bold text-orange">Sắp xếp theo:</span>
          <div className="flex items-center mr-3 text-sm gap-x-4">
            {OptionSearch.map((item, index) => {
              return (
                <button
                  key={index}
                  className={cn(
                    "px-2 font-medium rounded-md bg-white leading-7 hover:bg-orangeLinear hover:text-white",
                    active === item.value ||
                      searchParams.get("sortBy") === item.value
                      ? "bg-orangeLinear text-white"
                      : ""
                  )}
                  onClick={() => {
                    handleActive(item.value);
                    searchParams.set("sortBy", item.value);
                    searchParams.delete("order");
                    setSearchParams(searchParams);
                    handleSetFilter({
                      activePage: 1,
                      sortBy: item.value,
                      order: "",
                    });
                    handleSetData({
                      listProduct: [],
                      totalPage: 0,
                      amount_filter: 0,
                      result_search: [],
                    });
                  }}
                >
                  {item.label}
                </button>
              );
            })}
          </div>
          <Dropdown
            className={{
              select:
                "max-h-7 " +
                `${
                  filter.sortBy === "price" && filter.order ? "text-danger" : ""
                }`,
            }}
            title="Thứ tự theo giá"
            value={filter.order}
            options={OptionPrice}
            handleSelect={(option) => {
              handleActive("price");
              searchParams.set("sortBy", "price");
              searchParams.set("order", option.value);
              setSearchParams(searchParams);
              handleSetFilter({
                activePage: 1,
                sortBy: "price",
                order: option.value as "" | "desc" | "asc" | undefined,
              });
              handleSetData({
                listProduct: [],
                totalPage: 0,
                amount_filter: 0,
                result_search: [],
              });
            }}
          />
        </div>
        <div className="flex items-center text-sm gap-x-2">
          <span className="font-bold text-orange">Kết quả:</span>
          <span>{data?.amount_filter}</span>
          <span>sản phẩm</span>
        </div>
      </div>
    </div>
  );
}

export default Filter;
