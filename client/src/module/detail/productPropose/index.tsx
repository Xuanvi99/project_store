import { SwiperSlide } from "swiper/react";
import { useGetListProductQuery } from "@/stores/service/product.service";
import useTestContext from "@/hook/useTestContext";
import { IProductDetailProvide, PDetailContext } from "@/module/detail/context";
import LayoutProduct from "@/layout/LayoutProduct";
import SlideSwiper from "@/components/slideshows";
import CartSkeleton from "@/components/card/cart-skeleton";
import Card from "@/components/card";
import { cn } from "@/utils";

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
        <div className="relative flex items-center text-2xl gap-x-2">
          <span>Khám phá thêm</span>
        </div>
      </div>
      <SlideSwiper
        optionSwiper={{
          quantitySlide: resProduct?.data.length || 10,
          slidesPerView: 5,
          spaceBetween: 10,
          slidesPerGroup: 1,
          lazyPreloadPrevNext: 1,
          grabCursor: true,
          loop: resProduct?.data && resProduct?.data.length > 5 ? true : false,
          speed: 100,
        }}
        slideHover={
          resProduct?.data && resProduct?.data.length > 5 ? true : false
        }
        className={{ container: "mt-5" }}
      >
        {resProduct?.data.map((product, index) => {
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
