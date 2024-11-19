import { Link, Outlet, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { IconChevronRight } from "@/components/icon";
import { HeaderChildren } from "../../header";

const LayoutProductDashboard = () => {
  const { pathname, state } = useLocation();

  const handleSelectPathnameProduct = (pathname: string) => {
    if (pathname.includes("home")) {
      return "Danh Sách Sản Phẩm";
    } else if (pathname.includes("create")) {
      return "Thêm Sản Phẩm";
    } else if (pathname.includes("restore")) {
      return "Khôi Phục Sản Phẩm";
    } else if (pathname.includes("detail")) {
      return "Chi Tiết Sản Phẩm";
    } else {
      return "";
    }
  };

  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, []);
  return (
    <div>
      <HeaderChildren handleSelectPathname={handleSelectPathnameProduct}>
        {pathname.includes("home") === true && (
          <Link
            to={"/dashboard/product/create"}
            className="px-2 py-2 text-xs font-semibold text-white rounded-md bg-orangeFe"
          >
            +Thêm sản phẩm
          </Link>
        )}
        {pathname.includes("detail") === true && (
          <div className="flex items-center text-sm text-gray gap-x-1">
            <Link
              to={state ? state.redirectUrl : "/dashboard/product/list"}
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
      </HeaderChildren>
      <Outlet></Outlet>
    </div>
  );
};

export default LayoutProductDashboard;
