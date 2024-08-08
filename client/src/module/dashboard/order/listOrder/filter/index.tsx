import { IconSearch } from "@/components/icon";
import { Input } from "@/components/input";
import { useRef, useState } from "react";
import Dropdown from "../../../../../components/dropdown/Dropdown";
import { Button } from "@/components/button";
import useTestContext from "@/hook/useTestContext";
import { IListOrderFilterProvider, ListOrderFilterContext } from "../context";
import { useSearchParams } from "react-router-dom";

// const ListOptionPaymentMethod = [
//   { id: 1, label: "Tất cả", value: "" },
//   { id: 2, label: "Thanh toán khi nhận hàng", value: "cod" },
//   { id: 3, label: "Thanh toán vnpay", value: "vnpay" },
// ];

// const ListOptionPaymentStatus = [
//   { id: 1, label: "Tất cả", value: "" },
//   { id: 2, label: "Chờ thanh toán", value: "pending" },
//   { id: 3, label: "Đã trả", value: "paid" },
//   { id: 4, label: "Thanh toán thất bại", value: "shipping" },
// ];

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

  const inputDateStart = useRef<HTMLInputElement | null>(null);
  const inputDateEnd = useRef<HTMLInputElement | null>(null);

  const [statusOrder, setStatusOrder] = useState<{
    label: string;
    value: string;
  }>({
    label: "Tất cả",
    value: "",
  });

  const handleFormatDateToday = () => {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = today.getMonth() + 1;
    const dd = today.getDate();

    return (
      yyyy + "-" + (mm < 10 ? "0" + mm : mm) + "-" + (dd < 10 ? "0" + dd : dd)
    );
  };

  const [dateStart, setDateStart] = useState<string>("");

  const [dateEnd, setDateEnd] = useState<string>("");

  const handleChangeSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTextSearch(event.target.value);
    // debounceHandleSearch(event);
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
      statusOrder: statusOrder.value,
      dateStart: dateStart,
      dateEnd: dateEnd,
    });
    searchParams.set("search", textSearch);
    searchParams.set("activePage", "1");
    searchParams.set("statusOrder", statusOrder.value);
    searchParams.set("dateStart", dateStart);
    searchParams.set("dateEnd", dateEnd);
    setSearchParams(searchParams);
  };

  const handleResetFilter = () => {
    setStatusOrder({
      label: "Tất cả",
      value: "",
    });
    setTextSearch("");
    setDateStart("");
    setDateEnd("");

    handleSetParams({
      search: "",
      activePage: 1,
      statusOrder: "",
      dateStart: "",
      dateEnd: "",
    });
    searchParams.set("search", "");
    searchParams.set("activePage", "1");
    searchParams.set("statusOrder", "");
    searchParams.set("dateStart", "");
    searchParams.set("dateEnd", "");
    setSearchParams(searchParams);
  };

  return (
    <div className="w-full p-5 bg-white rounded-sm filter-order shadow-shadow1">
      <h1 className="font-semibold">Tìm kiếm đơn hàng</h1>
      <div className="flex items-center justify-start w-full mt-2 gap-x-3">
        <Input
          type="text"
          name="search"
          id="search"
          value={textSearch}
          onChange={(event) => handleChangeSearch(event)}
          placeholder="Tìm kiếm theo mã đơn hàng"
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
        <div className="flex items-center text-xs gap-x-2">
          <span className="whitespace-nowrap">Trạng thái:</span>
          <Dropdown
            title={statusOrder.label}
            value={statusOrder.value}
            options={listOptionStatusOrder}
            className={{
              wrap: "min-w-[200px]",
            }}
            handleSelect={(option) => {
              setStatusOrder({ label: option.label, value: option.value });
            }}
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
      </div>
      <div className="flex justify-center w-full mt-4 text-xs gap-x-4 ">
        <Button variant="default" onClick={handleSubmitFilter}>
          Tìm kiém
        </Button>
        <Button
          variant="default"
          onClick={() => {
            handleResetFilter();
          }}
        >
          Làm mới
        </Button>
      </div>
    </div>
  );
}

export default FilterOrder;
