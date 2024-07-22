import { Link, useLocation } from "react-router-dom";
import { IconChevronRight } from "@/components/icon";

function HeaderProductDB() {
  const { pathname } = useLocation();

  const handleSelectPathnameOrder = (pathname: string) => {
    if (pathname.includes("list")) {
      return "Danh Sách Sản Phẩm";
    } else if (pathname.includes("create")) {
      return "Tạo Sản Phẩm";
    } else {
      return "";
    }
  };
  return (
    <header className="flex items-center justify-between px-6 py-4 bg-white border-b-1 border-b-grayCa">
      <h1 className="text-xl font-semibold">
        {handleSelectPathnameOrder(pathname || "")}
      </h1>
      {pathname.includes("list") === true ? (
        <Link
          to={"/dashboard/product/create"}
          className="px-2 py-2 text-sm font-semibold text-white rounded-md bg-orangeFe"
        >
          +Thêm sản phẩm
        </Link>
      ) : (
        <div className="flex items-center text-sm text-gray gap-x-1">
          <Link
            to="/dashboard/order/home"
            className="font-semibold hover:text-blue hover:underline"
          >
            Sản phẩm
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

export default HeaderProductDB;
