import { Fragment, useEffect } from "react";
import Feature from "../module/home/feature";
import { ProductSlideshow } from "../components/product";
import { BannerHome } from "../components/banner";
import LayoutMain from "../layout/LayoutMain";

function HomePage() {
  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, []);
  return (
    <Fragment>
      <BannerHome></BannerHome>
      <LayoutMain>
        <Feature></Feature>
        <ProductSlideshow name="sale"></ProductSlideshow>
        <ProductSlideshow name="adidas"></ProductSlideshow>
        <ProductSlideshow name="adidas"></ProductSlideshow>
        <ProductSlideshow name="adidas"></ProductSlideshow>
        <ProductSlideshow name="adidas"></ProductSlideshow>
      </LayoutMain>
    </Fragment>
  );
}

export default HomePage;
