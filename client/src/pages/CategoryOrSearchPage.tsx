import { Fragment, useEffect } from "react";
import { cn } from "../utils";
import LayoutMain from "../layout/LayoutMain";
import { BannerCommon } from "../components/banner";
import * as Category from "../module/category";
import { CategoryProvide } from "@/module/category/context";
import { useParams } from "react-router-dom";

function CategoryOrSearchPage() {
  const { slug } = useParams();

  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, []);

  return (
    <Fragment>
      <BannerCommon
        heading={slug ? "Danh mục sản phẩm" : "Tìm kiếm sản phẩm"}
        title={slug ? "Giày " + slug : "Tìm kiếm sản phẩm"}
      ></BannerCommon>
      <LayoutMain>
        <section className={cn("w-full grid grid-cols-[280px_900px] gap-x-5")}>
          <CategoryProvide>
            <Category.Sidebar></Category.Sidebar>
            <Category.Content></Category.Content>
          </CategoryProvide>
        </section>
      </LayoutMain>
    </Fragment>
  );
}

export default CategoryOrSearchPage;
