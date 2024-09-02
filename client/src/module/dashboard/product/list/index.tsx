import ProductFilter from "./content/ProductFilter";
import ProductContent from "./content";
import StatisticsProduct from "./content/StatisticsProduct";
import { ListProductProvider } from "./context";
import { useEffect } from "react";
import { HeaderChildren } from "../../header";
import { Link, useLocation } from "react-router-dom";
import { IconChevronRight } from "@/components/icon";

function HomeProduct() {
  const { pathname, state } = useLocation();

  const handleSelectPathnameProduct = (pathname: string) => {
    if (pathname.includes("home")) {
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

  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, []);

  return (
    <div className="Dashboard_product_List">
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
      <div className="w-full px-6 pb-10 mt-[80px]">
        <StatisticsProduct></StatisticsProduct>
        <div className="p-5 mt-5 bg-white rounded-md">
          <ListProductProvider>
            <ProductFilter></ProductFilter>
            <ProductContent></ProductContent>
          </ListProductProvider>
        </div>
      </div>
    </div>
  );
}

export default HomeProduct;
