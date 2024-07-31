import { SwiperSlide } from "swiper/react";
import { useGetListProductQuery } from "@/stores/service/product.service";
import useTestContext from "@/hook/useTestContext";
import { IProductDetailProvide, PDetailContext } from "@/module/detail/context";
import LayoutProduct from "@/layout/LayoutProduct";
import SlideSwiper from "@/components/slideshows";
import Card from "@/components/card";
import { cn } from "@/utils";
import CartSkeleton from "@/components/card/card-skeleton";
import { Link } from "react-router-dom";
import { IconChevronRight } from "@/components/icon";

export default function ProductPropose() {
  const { data } = useTestContext<IProductDetailProvide>(
    PDetailContext as React.Context<IProductDetailProvide>
  );

  const { data: resProduct, isFetching } = useGetListProductQuery({
    search: data?.brand || "",
    activePage: 1,
    limit: 10,
    productId: data?._id,
  });

  return (
    <LayoutProduct>
      <div
        className={cn(
          "w-full flex justify-between items-center min-h-[50px] rounded-md p-[10px] font-bold border-b-1 border-orange",
          "bg-white text-orange"
        )}
      >
        <span className="text-2xl">Khám phá thêm</span>
        <Link
          to={`/category/${data?.brand}?page=1`}
          className={cn(
            "flex items-center text-base duration-500 gap-x-1 hover:text-black"
          )}
        >
          <span>Xem thêm</span>
          <IconChevronRight size={14}></IconChevronRight>
        </Link>
      </div>
      <SlideSwiper
        optionSwiper={{
          quantitySlide: resProduct?.listProduct.length || 10,
          slidesPerView: 5,
          spaceBetween: 10,
          slidesPerGroup: 1,
          lazyPreloadPrevNext: 1,
          grabCursor: true,
          loop:
            resProduct?.listProduct && resProduct?.listProduct.length > 5
              ? true
              : false,
          speed: 100,
        }}
        slideHover={
          resProduct?.listProduct && resProduct?.listProduct.length > 5
            ? true
            : false
        }
        className={{ container: "mt-5" }}
      >
        {resProduct?.listProduct.map((product, index) => {
          return (
            <SwiperSlide key={index}>
              {isFetching ? (
                <CartSkeleton key={index}></CartSkeleton>
              ) : (
                <Card product={product}></Card>
              )}
            </SwiperSlide>
          );
        })}
      </SlideSwiper>
    </LayoutProduct>
  );
}
