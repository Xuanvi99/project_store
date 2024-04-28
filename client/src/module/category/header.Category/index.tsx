import { useState } from "react";
import { Dropdown } from "../../../components/dropdown";
import { OptionPrice, OptionSearch } from "../../../constant/category.constant";
import { cn } from "../../../utils";

function Header() {
  const [active, setActive] = useState<string>("1");

  const handleActive = (id: string) => {
    setActive(id);
  };

  return (
    <div className="flex flex-col items-start gap-y-5 w-full mb-2">
      <div className="flex items-center font-bold justify-between  w-full">
        <div className="basis-5/6 flex gap-x-2">
          <span className="text-orange">Từ khóa tìm kiếm:</span>
          <span className="max-w-[400px] line-clamp-1 whitespace-nowrap">
            'abc'
          </span>
        </div>
        <div className="basis-1/6 flex gap-x-2">
          <span className="text-orange">Kết Quả:</span>
          <span className="line-clamp-1">1000</span>
        </div>
      </div>
      <div className="flex items-center gap-x-2 w-full mb-3">
        <span className="text-sm">Sắp xếp theo:</span>
        <div className="flex items-center gap-x-4 mr-3 text-sm">
          {OptionSearch.map((item, index) => {
            return (
              <button
                key={index}
                className={cn(
                  "px-2 font-medium rounded-sm bg-white leading-7 hover:bg-orangeLinear hover:text-white",
                  active === item.id ? "bg-orangeLinear text-white" : ""
                )}
                onClick={() => handleActive(item.id)}
              >
                {item.label}
              </button>
            );
          })}
        </div>
        <Dropdown
          className={{ select: "max-h-7" }}
          title="Giá"
          options={OptionPrice}
        ></Dropdown>
      </div>
    </div>
  );
}

export default Header;
