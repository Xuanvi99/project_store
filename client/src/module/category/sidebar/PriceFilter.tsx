import { cn } from "@/utils";
import Slider from "rc-slider";
import { useState } from "react";

interface IPriceFilterProps {
  price: {
    start: number;
    end: number;
  };
}

function PriceFilter({ price }: IPriceFilterProps) {
  const [priceFilter, setPriceFilter] = useState<{
    start: number;
    end: number;
  }>(price);

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
        onSubmit={() => {
          console.log("a");
        }}
        className="flex flex-col px-3 py-5 bg-white gap-y-5 rounded-b-md"
      >
        <Slider
          range
          allowCross={false}
          defaultValue={[0, 1000]}
          min={price.start}
          max={price.end}
          step={50}
          onChange={(value) => {
            const [start, end] = value as number[];
            setPriceFilter({ start, end });
          }}
          className="w-full slider"
        />
        <div className="flex flex-col items-start justify-start gap-y-3">
          <div className="flex items-center gap-x-1">
            <span>Giá:</span>
            <div className="flex items-center font-bold gap-x-1">
              <span>{currency(priceFilter.start)}₫</span>
              <span className="w-3 h-[1px] bg-black"></span>
              <span>{currency(priceFilter.end)}₫</span>
            </div>
          </div>
          <button
            type="submit"
            className="px-3 py-1 font-bold text-white rounded-lg bg-orangeLinear"
          >
            Lọc
          </button>
        </div>
      </form>
    </div>
  );
}

export default PriceFilter;
