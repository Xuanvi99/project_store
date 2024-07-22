import { Link, useLocation } from "react-router-dom";
import { IconChevronRight } from "@/components/icon";

function HeaderOrder() {
  const { pathname } = useLocation();

  const handleSelectPathnameOrder = (pathname: string) => {
    if (pathname.includes("home")) {
      return "Tổng Hợp ";
    } else if (pathname.includes("detail")) {
      return "Chi Tiết Đơn Hàng";
    }
  };
  return (
    <header className="flex items-center justify-between py-4 px-6 bg-white border-b-1 border-b-grayCa">
      <h1 className="text-2xl font-semibold">
        {handleSelectPathnameOrder(pathname || "")}
      </h1>
      {pathname.includes("home") !== true && (
        <div className="text-sm text-gray flex items-center gap-x-1">
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
    </header>
  );
}

export default HeaderOrder;
