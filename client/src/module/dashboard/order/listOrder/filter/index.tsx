import { IconDown, IconSearch } from "@/components/icon";
import { Input } from "@/components/input";
import { debounce } from "lodash";
import { useMemo, useRef, useState } from "react";
import Dropdown from "../../../../../components/dropdown/Dropdown";
import { Button } from "@/components/button";
import IconFilter from "@/components/icon/IconFilter";
import { cn } from "@/utils";
import { useToggle } from "@/hook";
import useTestContext from "@/hook/useTestContext";
import { IListOrderFilterProvider, ListOrderFilterContext } from "../context";
import { useSearchParams } from "react-router-dom";

const ListOptionPaymentMethod = [
  { id: 1, label: "Tất cả", value: "" },
  { id: 2, label: "Thanh toán khi nhận hàng", value: "cod" },
  { id: 3, label: "Thanh toán vnpay", value: "vnpay" },
];

const ListOptionPaymentStatus = [
  { id: 1, label: "Tất cả", value: "" },
  { id: 2, label: "Chờ thanh toán", value: "pending" },
  { id: 3, label: "Đã trả", value: "paid" },
  { id: 4, label: "Thanh toán thất bại", value: "shipping" },
];

const listOptionStatusOrder = [
  { id: 1, label: "Tất cả", value: "" },
  { id: 2, label: "Chờ xác nhận", value: "pending" },
  { id: 3, label: "Vận chuyển", value: "confirmed" },
  { id: 4, label: "Chờ giao hàng", value: "shipping" },
  { id: 5, label: "Hoàn thành", value: "completed" },
  { id: 6, label: "Đã hủy", value: "cancelled" },
  { id: 7, label: "Trả hàng/Hoàn tiền", value: "refund" },
];

function FilterOrder() {
  const { handleSetParams } = useTestContext<IListOrderFilterProvider>(
    ListOrderFilterContext as React.Context<IListOrderFilterProvider>
  );

  const [searchParams, setSearchParams] = useSearchParams();

  const [textSearch, setTextSearch] = useState<string>("");

  const { toggle: openFilter, handleToggle: handleOpenFilter } = useToggle();

  const inputDateStart = useRef<HTMLInputElement | null>(null);
  const inputDateEnd = useRef<HTMLInputElement | null>(null);

  const [statusOrder, setStatusOrder] = useState<string>("");
  const [paymentStatus, setPaymentStatus] = useState<string>("");
  const [paymentMethod, setPaymentMethod] = useState<string>("");

  const handleFormatDateToday = () => {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = today.getMonth() + 1;
    const dd = today.getDate();

    return (
      yyyy + "-" + (mm < 10 ? "0" + mm : mm) + "-" + (dd < 10 ? "0" + dd : dd)
    );
  };
  const [test, setTest] = useState<string>("");
  console.log("test: ", test);
  const [dateStart, setDateStart] = useState<string>("");

  const [dateEnd, setDateEnd] = useState<string>("");

  const debounceHandleSearch = useMemo(() => {
    return debounce(
      (event: React.ChangeEvent<HTMLInputElement>) => {
        handleSetParams({
          search: event.target.value,
          activePage: 1,
        });
        searchParams.set("search", event.target.value);
        searchParams.set("activePage", "1");
        setSearchParams(searchParams);
      },
      500,
      { trailing: true }
    );
  }, [handleSetParams, searchParams, setSearchParams]);

  const handleChangeSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTextSearch(event.target.value);
    debounceHandleSearch(event);
  };

  const handleSetStatusOrder = (value: string) => {
    setStatusOrder(value);
  };

  const handleSetPaymentStatus = (value: string) => {
    setPaymentStatus(value);
  };

  const handleSetPaymentMethod = (value: string) => {
    setPaymentMethod(value);
  };

  const handleCompareAndSetDateTime = (
    dateChange: string,
    name: "start" | "end"
  ) => {
    const timeDateChange = new Date(dateChange).getTime();
    const timeDateStart = new Date(dateStart).getTime();
    const timeDateEnd = new Date(dateEnd).getTime();

    switch (name) {
      case "start":
        setDateStart(dateChange);
        if (timeDateChange > timeDateEnd || dateEnd === "") {
          setDateEnd(dateChange);
        }
        break;

      case "end":
        setDateEnd(dateChange);
        if (timeDateChange < timeDateStart || dateStart === "") {
          setDateStart(dateChange);
        }
        break;

      default:
        break;
    }
  };

  const handleSubmitFilter = () => {
    handleSetParams({
      search: textSearch,
      activePage: 1,
      statusOrder: statusOrder,
      paymentStatus,
      paymentMethod,
      dateStart: dateStart,
      dateEnd: dateEnd,
    });
    searchParams.set("search", textSearch);
    searchParams.set("activePage", "1");
    searchParams.set("statusOrder", statusOrder);
    searchParams.set("paymentStatus", paymentStatus);
    searchParams.set("paymentMethod", paymentMethod);
    searchParams.set("dateStart", dateStart);
    searchParams.set("dateEnd", dateEnd);
    setSearchParams(searchParams);
  };

  return (
    <div className="w-full p-5 bg-white rounded-sm filter-order shadow-shadow77">
      <h1 className="font-semibold">Tìm kiếm đơn hàng</h1>
      <div className="flex items-center justify-start w-full mt-2 gap-x-2">
        <Input
          type="text"
          name="search"
          id="search"
          value={textSearch}
          onChange={(event) => handleChangeSearch(event)}
          placeholder="Tìm kiếm theo mã đơn hàng"
          className={{
            input:
              "w-1/2 pl-10 outline-none text-base py-2 border-1 border-grayCa placeholder:text-grayCa ",
          }}
          autoComplete="off"
        >
          <div className="absolute text-black -translate-y-1/2 top-1/2 left-2">
            <IconSearch size={25}></IconSearch>
          </div>
        </Input>
        <Button
          onClick={handleOpenFilter}
          variant="outLine-flex"
          type="button"
          className="text-sm whitespace-nowrap"
        >
          <span>
            <IconFilter size={16}></IconFilter>
          </span>
          <span>Bộ lọc</span>
          <span className={`${openFilter ? "rotate-180" : ""}`}>
            <IconDown size={16}></IconDown>
          </span>
        </Button>
      </div>
      <div
        className={cn(
          "w-full flex flex-col mx-auto transition-all rounded-sm  gap-y-3 border-grayE5 ",
          !openFilter ? "h-0 " : "h-auto mt-5"
        )}
      >
        <div
          className={cn(
            "grid grid-cols-2 gap-y-5",
            openFilter ? "delay-200 transition-all " : "hidden"
          )}
        >
          <div className="flex items-center text-xs gap-x-2">
            <span className="whitespace-nowrap w-[150px]">
              Phương thức thanh toán:
            </span>
            <Dropdown
              title={"Tất cả"}
              options={ListOptionPaymentMethod}
              className={{
                wrap: "min-w-[200px]",
              }}
              handleSelect={handleSetPaymentMethod}
            ></Dropdown>
          </div>
          <div className="flex items-center text-xs gap-x-2">
            <span className="whitespace-nowrap w-[150px]">
              Trạng thái thanh toán:
            </span>
            <Dropdown
              title={"Tất cả"}
              options={ListOptionPaymentStatus}
              className={{
                wrap: "min-w-[200px]",
              }}
              handleSelect={handleSetPaymentStatus}
            ></Dropdown>
          </div>
          <div className="flex items-center text-xs gap-x-2">
            <span className="whitespace-nowrap w-[150px]">
              Trạng thái đơn hàng:
            </span>
            <Dropdown
              title={"Tất cả"}
              options={listOptionStatusOrder}
              className={{
                wrap: "min-w-[200px]",
              }}
              handleSelect={handleSetStatusOrder}
            ></Dropdown>
          </div>
          <div className="flex items-center text-xs gap-x-2">
            <span className="whitespace-nowrap">Từ ngày:</span>
            <Input
              ref={inputDateStart}
              type="date"
              name="dateTo"
              max={handleFormatDateToday()}
              value={dateStart}
              className={{
                input: "datetime-picker",
              }}
              onChange={(e) => {
                handleCompareAndSetDateTime(e.target.value, "start");
              }}
            ></Input>
            <span className="whitespace-nowrap">Đến ngày:</span>
            <Input
              ref={inputDateEnd}
              type="date"
              name="dateFrom"
              max={handleFormatDateToday()}
              value={dateEnd}
              onChange={(e) => {
                handleCompareAndSetDateTime(e.target.value, "end");
              }}
            ></Input>
          </div>
          <Button
            variant="default"
            type="button"
            onClick={handleSubmitFilter}
            className="col-span-2 row-start-3 row-end-4 mx-auto text-xs"
          >
            Lọc đơn hàng
          </Button>
          <Input
            ref={inputDateStart}
            type="text"
            name="dateTo"
            max={handleFormatDateToday()}
            value={test}
            className={{
              input: "datetime-picker",
            }}
            onFocus={(e) => {
              console.log(e.target.value);
            }}
            onChange={(e) => {
              console.log(e.target.value);
              setTest(e.target.value);
              e.target.showPicker();
            }}
          ></Input>
        </div>
      </div>
    </div>
  );
}

export default FilterOrder;
