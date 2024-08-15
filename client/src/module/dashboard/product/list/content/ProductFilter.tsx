import useTestContext from "@/hook/useTestContext";
import { debounce } from "lodash";
import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { IListProductProvide, ListProductContext } from "../context";
import { Input } from "@/components/input";
import { IconSearch } from "@/components/icon";
import {
  optionLimitGrid,
  optionLimitList,
  OptionPrice,
  OptionSearch,
} from "@/constant/category.constant";
import { cn } from "@/utils";
import { Dropdown } from "@/components/dropdown";
import { Label } from "@/components/label";
import { IParamsFilterProductDashboard } from "@/types/product.type";
import IconRightArrow from "@/components/icon/IconRightArrow";
import { useGetListProductDeletedQuery } from "@/stores/service/product.service";
import LoadingSpinner from "@/components/loading";
import IconShowList from "../../../../../components/icon/IconShowList";
import IconShowGrid from "../../../../../components/icon/IconShowGrid";

function ProductFilter() {
  const {
    filter,
    showProduct,
    data,
    isLoadingQuery,
    setShowProduct,
    handleSetFilter,
    setScrollTop,
  } = useTestContext<IListProductProvide>(
    ListProductContext as React.Context<IListProductProvide>
  );

  const filterRef = useRef<HTMLDivElement | null>(null);

  const [searchParams, setSearchParams] = useSearchParams();

  const [textSearch, setTextSearch] = useState<string>(filter.search);

  const { data: resDeleted, isFetching } = useGetListProductDeletedQuery({
    activePage: 1,
    limit: 10,
    search: "",
  });

  const debounceHandleSearch = useMemo(() => {
    return debounce(
      (event: React.ChangeEvent<HTMLInputElement>) => {
        handleSetFilter({
          search: event.target.value.trim(),
        });
        searchParams.set("search", event.target.value);
        setSearchParams(searchParams);
      },
      500,
      { trailing: true }
    );
  }, [handleSetFilter, searchParams, setSearchParams]);

  const handleChangeSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTextSearch(event.target.value);
    debounceHandleSearch(event);
  };

  const handleCheckStatusProduct = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    searchParams.set("status", event.target.dataset.value || "");
    setSearchParams(searchParams);
    handleSetFilter({
      status: event.target.dataset
        .value as IParamsFilterProductDashboard["status"],
    });
  };

  console.log(filterRef);

  useEffect(() => {
    if (filterRef.current) {
      setScrollTop(
        filterRef.current.offsetTop + filterRef.current.clientHeight - 80
      );
    }
  }, [setScrollTop]);

  return (
    <div ref={filterRef} className="flex flex-col rounded-md gap-y-5">
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
      <div className="flex items-center text-sm gap-x-4">
        <span>Sắp xếp theo:</span>
        {OptionSearch.map((item, index) => {
          return (
            <button
              key={index}
              className={cn(
                "px-2 font-medium rounded-md bg-white border-1 border-grayCa leading-7 hover:bg-orangeLinear hover:text-white",
                filter.sortBy === item.value ||
                  searchParams.get("sortBy") === item.value
                  ? "bg-orangeLinear text-white border-none"
                  : ""
              )}
              onClick={() => {
                searchParams.set("sortBy", item.value);
                searchParams.delete("order");
                setSearchParams(searchParams);
                handleSetFilter({
                  activePage: 1,
                  sortBy: item.value,
                  order: "",
                });
              }}
            >
              {item.label}
            </button>
          );
        })}
        <Dropdown
          className={{
            select:
              "h-7 rounded-md" +
              " " +
              `${
                filter.sortBy === "price" && filter.order
                  ? "font-semibold bg-orangeLinear text-white"
                  : ""
              }`,
          }}
          title="Sắp xếp theo giá"
          value={filter.order}
          options={OptionPrice}
          handleSelect={(option) => {
            searchParams.set("sortBy", "price");
            searchParams.set("order", option.value);
            setSearchParams(searchParams);
            handleSetFilter({
              activePage: 1,
              sortBy: "price",
              order: option.value as "" | "desc" | "asc" | undefined,
            });
          }}
        />
      </div>
      <div className="flex items-center justify-start w-full text-sm gap-x-5">
        <span>Trạng thái sản phẩm:</span>
        <span className="flex items-center gap-x-1">
          <Input
            type="radio"
            name="status"
            id="all"
            data-value=""
            checked={filter.status === "" ? true : false}
            className={{ input: "w-5 h-5", wrap: "flex items-center" }}
            onChange={(event) => handleCheckStatusProduct(event)}
          ></Input>
          <Label name="all" className="whitespace-nowrap">
            Tất cả
          </Label>
        </span>
        <span className="flex items-center gap-x-1">
          <Input
            type="radio"
            name="status"
            id="active"
            data-value="active"
            checked={filter.status === "active" ? true : false}
            className={{ input: "w-5 h-5", wrap: "flex items-center" }}
            onChange={(event) => handleCheckStatusProduct(event)}
          ></Input>
          <Label name="active" className="whitespace-nowrap">
            Đang bán
          </Label>
        </span>
        <span className="flex items-center gap-x-1">
          <Input
            type="radio"
            id="inactive"
            name="status"
            data-value="inactive"
            checked={filter.status === "inactive" ? true : false}
            className={{ input: "w-5 h-5", wrap: "flex items-center" }}
            onChange={(event) => handleCheckStatusProduct(event)}
          ></Input>
          <Label name="inactive" className="whitespace-nowrap">
            Ngừng bán
          </Label>
        </span>
      </div>
      <div className="flex items-center justify-center cursor-pointer gap-x-3">
        <span
          onClick={() => {
            setShowProduct("list");
            searchParams.set("show", "list");
            setSearchParams(searchParams);
            handleSetFilter({ limit: 10 });
          }}
          className={cn(
            `hover:text-orange`,
            showProduct === "list" && "text-orange"
          )}
        >
          <IconShowList size={25}></IconShowList>
        </span>
        <span className="w-[2px] h-[25px] bg-gray"></span>
        <span
          onClick={() => {
            setShowProduct("grid");
            searchParams.set("show", "grid");
            setSearchParams(searchParams);
            handleSetFilter({ limit: 8 });
          }}
          className={cn(
            `hover:text-orange`,
            showProduct === "grid" && "text-orange"
          )}
        >
          <IconShowGrid size={25}></IconShowGrid>
        </span>
      </div>
      <div className="flex justify-between text-sm">
        <div className="flex items-center text-sm font-semibold text-end gap-x-2">
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
              title={"" + filter.limit}
              value={"" + filter.limit}
              options={
                showProduct === "list" ? optionLimitList : optionLimitGrid
              }
              handleSelect={(option) => {
                searchParams.set("limit", option.value);
                setSearchParams(searchParams);
                handleSetFilter({ limit: +option.value });
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
        {resDeleted && resDeleted.amountProductFound > 0 && (
          <div className="flex items-center justify-end gap-x-2">
            <div className="flex items-center gap-x-1">
              <span className="font-semibold">Thùng rác</span>(
              {isFetching ? (
                <LoadingSpinner className="border-orange border-r-transparent"></LoadingSpinner>
              ) : (
                <span className="flex font-semibold">
                  <p className="text-danger">
                    {resDeleted?.amountProductFound || 0}
                  </p>
                </span>
              )}
              )
            </div>
            <IconRightArrow size={10}></IconRightArrow>
            <Link
              to="/dashboard/product/restore"
              className="flex items-center text-sm gap-x-1 text-blue hover:underline hover:text-orange"
            >
              <span>Khôi Phục</span>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

export default ProductFilter;
