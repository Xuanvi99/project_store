import { Fragment, useEffect } from "react";
import { BannerCommon } from "../components/banner";
import { ProductDetailProvide } from "@/module/detail/context";
import DetailContent from "@/module/detail/content";
import { useParams } from "react-router-dom";

function ProductDetailPage() {
  const { slug } = useParams();
  useEffect(() => {
    if (slug) {
      window.scrollTo({ top: 0 });
    }
  }, [slug]);
  return (
    <Fragment>
      <BannerCommon
        heading="Chi tiết sản phẩm"
        title=" Chi tiết sản phẩm"
      ></BannerCommon>
      <ProductDetailProvide>
        <DetailContent></DetailContent>
      </ProductDetailProvide>
    </Fragment>
  );
}

export default ProductDetailPage;
