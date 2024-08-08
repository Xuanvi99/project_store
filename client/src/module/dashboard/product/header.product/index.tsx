import { Link, useLocation } from "react-router-dom";
import { IconChevronRight } from "@/components/icon";

function HeaderProductDB() {
  const { pathname } = useLocation();

  const handleSelectPathnameProduct = (pathname: string) => {
    if (pathname.includes("list")) {
      return "Danh Sách Sản Phẩm";
    } else if (pathname.includes("create")) {
      return "Tạo Sản Phẩm";
    } else if (pathname.includes("restore")) {
      return "Khôi Phục Sản Phẩm";
    } else if (pathname.includes("detail")) {
      return "Chi Tiết Sản Phẩm";
    } else {
      return "";
    }
  };
  return (
    <header className="fixed z-50 top-[80px] left-[250px] w-[calc(100%-250px)] flex items-center justify-between px-6 py-4 bg-white border-b-1 border-b-grayCa max-h-[60px] shadow-[5px_5px_10px_rgba(0,0,0,0.2)]">
      <h1 className="text-xl font-semibold">
        {handleSelectPathnameProduct(pathname || "")}
      </h1>
      {pathname.includes("list") === true ? (
        <Link
          to={"/dashboard/product/create"}
          className="px-2 py-2 text-xs font-semibold text-white rounded-md bg-orangeFe"
        >
          +Thêm sản phẩm
        </Link>
      ) : (
        <div className="flex items-center text-sm text-gray gap-x-1">
          <Link
            to="/dashboard/product/list"
            className="font-semibold hover:text-blue hover:underline"
          >
            Sản phẩm
          </Link>
          <span>
            <IconChevronRight size={10}></IconChevronRight>
          </span>
          <span>{handleSelectPathnameProduct(pathname || "")}</span>
        </div>
      )}
    </header>
  );
}

export default HeaderProductDB;
