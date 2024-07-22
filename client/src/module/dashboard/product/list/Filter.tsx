import useTestContext from "@/hook/useTestContext";
import { debounce } from "lodash";
import { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { IListPdProvide, ListPdContext } from "./context";
import { Input } from "@/components/input";
import { IconSearch } from "@/components/icon";
import { OptionPrice, OptionSearch } from "@/constant/category.constant";
import { cn } from "@/utils";
import { Dropdown } from "@/components/dropdown";

function FilterProductDB() {
  const { filter, handleSetFilter } = useTestContext<IListPdProvide>(
    ListPdContext as React.Context<IListPdProvide>
  );

  const [searchParams, setSearchParams] = useSearchParams();

  const [textSearch, setTextSearch] = useState<string>("");

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

  return (
    <div className="flex flex-col gap-y-5">
      <Input
        type="text"
        name="search"
        id="search"
        value={textSearch}
        onChange={(event) => handleChangeSearch(event)}
        placeholder="Tìm kiếm theo danh mục, mã hoặc tên sản phẩm"
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
                  ? "bg-orangeLinear text-white"
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
          title="trạng thái sản phẩm"
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
    </div>
  );
}

export default FilterProductDB;
