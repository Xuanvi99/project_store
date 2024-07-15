import { IconChevronLeft, IconChevronRight } from "@/components/icon";
import useTestContext from "@/hook/useTestContext";
import { Fragment } from "react";
import ReactPaginate from "react-paginate";
import { IListOrderFilterProvider, ListOrderFilterContext } from "../context";
import OrderItem from "./OrderItem";

function ShowListOrder() {
  const { res, status, handleSetParams, params } =
    useTestContext<IListOrderFilterProvider>(
      ListOrderFilterContext as React.Context<IListOrderFilterProvider>
    );
  const { data, totalPage, amountOrder } = res;

  if (data.length === 0 && status === "fulfilled") {
    return (
      <div className="rounded-sm min-h-[400px] mt-3 bg-white flex flex-col justify-center items-center gap-y-3">
        <img alt="" srcSet="/orderNull.png" className="w-40" />
        <p>Không có đơn hàng </p>
      </div>
    );
  }

  return (
    <Fragment>
      <div className="w-full listOrder">
        <div className="grid w-full bg-slate-100 font-semibold grid-cols-[70px_150px_200px_150px_200px_150px_auto] text-sm grid-rows-1 mt-5 ">
          <span className="flex items-center justify-center">STT</span>
          <span>Mã đơn hàng</span>
          <span>Người mua</span>
          <span>Ngày đặt mua</span>
          <span>Tình trạng đặt hàng</span>
          <span>Tổng tiền</span>
          <span>Hoạt động</span>
        </div>
        <div className="">
          {data.length > 0 &&
            data.map((order, index) => {
              return (
                <OrderItem
                  key={order._id}
                  data={order}
                  index={index + (params.activePage - 1) * 10}
                ></OrderItem>
              );
            })}
        </div>
      </div>
      <div className="flex items-center w-full py-6 border-t-1 border-t-grayCa">
        <span className="text-sm font-semibold basis-1/2 text-gray98">
          Hiển thị đơn hàng từ 1 đến 10 trên {amountOrder}
        </span>
        <div className="flex justify-end basis-1/2">
          <ReactPaginate
            breakLabel="..."
            nextLabel={<IconChevronRight size={12}></IconChevronRight>}
            onPageChange={(selectedItem) => {
              handleSetParams({ activePage: selectedItem.selected + 1 });
            }}
            pageRangeDisplayed={3}
            pageCount={totalPage}
            previousLabel={<IconChevronLeft size={12}></IconChevronLeft>}
            renderOnZeroPageCount={null}
            className="flex items-center text-sm gap-x-2"
            pageClassName="py-[6px] px-3"
            previousClassName={`${totalPage === 1 && "hidden"}`}
            nextClassName={`${totalPage === 1 && "hidden"}`}
            activeClassName="bg-orangeFe flex justify-center items-center rounded-full text-white text-sm font-semibold"
          />
        </div>
      </div>
    </Fragment>
  );
}

export default ShowListOrder;
