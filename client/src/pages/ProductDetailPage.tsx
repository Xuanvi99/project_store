import { Fragment, useEffect } from "react";
import { ProductSlideshow } from "../components/product";
import { BannerCommon } from "../components/banner";
import LayoutMain from "../layout/LayoutMain";
import {
  ProductDesc,
  ProductReviews,
  ProductSingle,
  ProductSummary,
} from "@/module/detail";

function ProductDetailPage() {
  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, []);
  return (
    <Fragment>
      <BannerCommon
        heading="Chi tiết sản phẩm"
        title=" Chi tiết sản phẩm"
      ></BannerCommon>
      <LayoutMain>
        <ProductSingle></ProductSingle>
        <ProductSummary></ProductSummary>
        <ProductDesc></ProductDesc>
        <ProductReviews></ProductReviews>
        <ProductSlideshow name="Khám phá thêm"></ProductSlideshow>
      </LayoutMain>
    </Fragment>
  );
}

export default ProductDetailPage;
