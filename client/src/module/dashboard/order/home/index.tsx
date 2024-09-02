import StatisticsOrder from "./StatisticsOrder.home";
import ListOrder from "../listOrder";
import { Fragment } from "react";
import { HeaderChildren } from "../../header";
import { Link, useLocation } from "react-router-dom";
import { IconChevronRight } from "@/components/icon";

function HomeOrder() {
  const { pathname } = useLocation();

  const handleSelectPathnameOrder = (pathname: string): string => {
    if (pathname.includes("home")) {
      return "Tổng Hợp ";
    } else if (pathname.includes("detail")) {
      return "Chi Tiết Đơn Hàng";
    } else {
      return "";
    }
  };

  return (
    <Fragment>
      <HeaderChildren handleSelectPathname={handleSelectPathnameOrder}>
        {pathname.includes("home") !== true && (
          <div className="flex items-center text-sm text-gray gap-x-1">
            <Link
              to="/dashboard/order/home"
              className="font-semibold hover:text-blue hover:underline"
            >
              Đơn hàng
            </Link>
            <span>
              <IconChevronRight size={10}></IconChevronRight>
            </span>
            <span>{handleSelectPathnameOrder(pathname || "")}</span>
          </div>
        )}
      </HeaderChildren>
      <div className="home-order px-6 mt-[80px]">
        <StatisticsOrder></StatisticsOrder>
        <ListOrder></ListOrder>
      </div>
    </Fragment>
  );
}

export default HomeOrder;
