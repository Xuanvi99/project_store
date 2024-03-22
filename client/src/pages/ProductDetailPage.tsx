import { Fragment } from "react";
import { ProductSlideshow } from "../components/product";
import { BannerCommon } from "../components/banner";
import LayoutMain from "../layout/LayoutMain";
import { ProductSingle, ProductDesc, ProductReviews } from "../module/detail";

function ProductDetailPage() {
  return (
    <Fragment>
      <BannerCommon
        heading="Chi tiết sản phẩm"
        title=" Chi tiết sản phẩm"
      ></BannerCommon>
      <LayoutMain>
        <ProductSingle></ProductSingle>
        <ProductDesc></ProductDesc>
        <ProductReviews></ProductReviews>
        <ProductSlideshow name="Khám phá thêm"></ProductSlideshow>
      </LayoutMain>
    </Fragment>
  );
}

export default ProductDetailPage;
