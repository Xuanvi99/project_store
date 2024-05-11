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

  const { handleSetFilter, data } = useTestContext<ICategoryProvide>(
    CategoryContext as React.Context<ICategoryProvide>
  );

  const [active, setActive] = useState<string>("1");

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
        <div className="flex items-center justify-between w-full font-bold">
          <div className="flex basis-5/6 gap-x-2">
            <span className="text-orange">Từ khóa tìm kiếm:</span>
            <span className="max-w-[400px] line-clamp-1 whitespace-nowrap font-semibold text-sm">
              "{searchParams.get("s") ? searchParams.get("s") : "Tất cả"}"
            </span>
          </div>

          <div className="flex basis-1/6 gap-x-2">
            <span className="text-orange">Kết Quả:</span>
            <span className="line-clamp-1">{data?.result}</span>
          </div>
        </div>
      )}
      {slug && (
        <div className="w-full mb-5 text-2xl font-bold text-center">
          {slug === "flashSale" ? "Flash Sale" : slug}
        </div>
      )}
      <div className="flex items-center w-full mb-3 gap-x-2">
        <span className="text-sm">Sắp xếp theo:</span>
        <div className="flex items-center mr-3 text-sm gap-x-4">
          {OptionSearch.map((item, index) => {
            return (
              <button
                key={index}
                className={cn(
                  "px-2 font-medium rounded-md bg-white leading-7 hover:bg-orangeLinear hover:text-white",
                  active === item.id ? "bg-orangeLinear text-white" : ""
                )}
                onClick={() => {
                  handleActive(item.id);
                  searchParams.set("sortBy", item.value);
                  searchParams.delete("order");
                  setSearchParams(searchParams);
                  handleSetFilter({ sortBy: item.value, order: "" });
                }}
              >
                {item.label}
              </button>
            );
          })}
        </div>
        <Dropdown
          className={{
            select: "max-h-7" + `${active === "4" && "text-danger"}`,
          }}
          active={active === "4" ? true : false}
          title="Thứ tự theo giá"
          options={OptionPrice}
          handleSelect={(value) => {
            handleActive("4");
            searchParams.set("sortBy", "price");
            searchParams.set("order", value);
            setSearchParams(searchParams);
            handleSetFilter({
              sortBy: "price",
              order: value as "asc" | "desc",
            });
          }}
        />
      </div>
    </div>
  );
}

export default Filter;
