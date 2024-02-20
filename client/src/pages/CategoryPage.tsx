import { Fragment } from "react";
import { cn } from "../utils";
import "rc-slider/assets/index.css";
import LayoutMain from "../layout/LayoutMain";
import { BannerCommon } from "../components/banner";
import { Content, Header, Sidebar } from "../module/category";

function CategoryPage() {
  return (
    <Fragment>
      <BannerCommon
        heading="Danh mục sản phẩm"
        title="Sản phẩm tìm kiếm"
      ></BannerCommon>
      <LayoutMain>
        <Header></Header>
        <section className={cn("w-full grid grid-cols-[280px_900px] gap-x-5")}>
          <Sidebar></Sidebar>
          <Content></Content>
        </section>
      </LayoutMain>
    </Fragment>
  );
}

export default CategoryPage;
