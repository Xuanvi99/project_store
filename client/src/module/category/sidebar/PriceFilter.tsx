import useTestContext from "@/hook/useTestContext";
import { cn } from "@/utils";
import Slider from "rc-slider";
import { CategoryContext, ICategoryProvide } from "../context";
import { useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { Button } from "@/components/button";

function PriceFilter() {
  const { handleSetFilter, maxPrice, minPrice, filter, data } =
    useTestContext<ICategoryProvide>(
      CategoryContext as React.Context<ICategoryProvide>
    );
  const [searchParams, setSearchParams] = useSearchParams();

  const [priceFilter, setPriceFilter] = useState<{
    start: number;
    end: number;
  }>({
    start: 0,
    end: 0,
  });

  useEffect(() => {
    const start = filter.min_price == 0 ? minPrice : filter.min_price;
    const end = filter.max_price === 0 ? maxPrice : filter.max_price;
    setPriceFilter({ start, end });
  }, [filter.max_price, filter.min_price, maxPrice, minPrice]);

  const currency = (value: number) => {
    return new Intl.NumberFormat().format(value);
  };

  return (
    <div className="mt-5">
      <h3
        className={cn(
          "inline-block w-full bg-orangeLinear p-2 text-lg font-bold text-white rounded-t-md"
        )}
      >
        Lọc sản phẩm
      </h3>
      <form
        onSubmit={(event) => {
          event.preventDefault();
          searchParams.set("min_price", "" + priceFilter.start);
          searchParams.set("max_price", "" + priceFilter.end);
          setSearchParams(searchParams);
          handleSetFilter({
            activePage: 1,
            min_price: priceFilter.start,
            max_price: priceFilter.end,
          });
        }}
        className="flex flex-col px-3 py-5 bg-white gap-y-5 rounded-b-md"
      >
        <Slider
          range
          allowCross={false}
          defaultValue={[priceFilter.start, priceFilter.end]}
          value={[priceFilter.start, priceFilter.end]}
          min={minPrice}
          max={maxPrice}
          step={50}
          onChange={(value) => {
            const [start, end] = value as number[];
            setPriceFilter({ start, end });
          }}
          className="w-full slider"
        />

        <div className="flex items-center gap-x-1">
          <span>Giá:</span>
          <div className="flex items-center font-bold gap-x-1">
            <span>{currency(priceFilter.start)}₫</span>
            <span className="w-3 h-[1px] bg-black"></span>
            <span>{currency(priceFilter.end)}₫</span>
          </div>
        </div>

        <Button
          variant="default"
          type="submit"
          disabled={
            data?.result_search && data?.result_search.length > 0 ? false : true
          }
          className="px-3 py-1 font-bold max-w-[100px] text-sm text-white rounded-lg bg-orangeLinear"
        >
          Áp Dụng
        </Button>
      </form>
    </div>
  );
}

export default PriceFilter;
