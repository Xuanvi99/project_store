import { Fragment, useEffect } from "react";
import { cn } from "../utils";
import LayoutMain from "../layout/LayoutMain";
import { BannerCommon } from "../components/banner";
import * as Category from "../module/category";
import { CategoryProvide } from "@/module/category/context";

function CategoryPage() {
  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, []);
  return (
    <Fragment>
      <BannerCommon
        heading="Danh mục sản phẩm"
        title="Sản phẩm tìm kiếm"
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

export default CategoryPage;
