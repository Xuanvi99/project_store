import { SwiperSlide } from "swiper/react";
import { cn } from "../../utils";
import LayoutProduct from "../../layout/LayoutProduct";
import { Link } from "react-router-dom";
import Card from "../card";
import SlideSwiper from "../slideshows";
import { IconChevronRight } from "../icon";
import { useGetListProductQuery } from "@/stores/service/product.service";
import CartSkeleton from "../card/card-skeleton";

interface IProps {
  name?: string;
}

export default function ProductSlideshow({ name = "" }: IProps) {
  const { data: resProduct, isLoading } = useGetListProductQuery({
    search: name,
    activePage: 1,
    limit: 10,
  });

  if ((!resProduct || resProduct.data.length === 0) && !isLoading) {
    return <></>;
  }

  return (
    <LayoutProduct>
      <div
        className={cn(
          "w-full flex justify-between items-center min-h-[50px] rounded-md p-[10px] font-bold border-b-1 border-orange",
          name === "sale"
            ? "text-red-800 bg-orangeLinear"
            : "bg-white text-orange"
        )}
      >
        <div className="relative flex items-center text-2xl gap-x-2">
          <span>
            {name === "sale" && "Giảm Giá Sốc"}
            {name === ""
              ? "Khám phá thêm"
              : "Giày " + name.charAt(0).toUpperCase() + name.slice(1)}
          </span>
          {name === "sale" && (
            <img
              alt=""
              loading="lazy"
              srcSet="/flashSales.png"
              className=" h-[50px] absolute left-[105%] top-1/2 -translate-y-1/2"
            />
          )}
        </div>
        <Link
          to={`/category/${name}`}
          className={cn(
            "flex items-center text-base duration-500 gap-x-1 ",
            name === "flashSale" ? "hover:text-white" : "hover:text-black"
          )}
        >
          <span>Xem thêm</span>
          <IconChevronRight size={14}></IconChevronRight>
        </Link>
      </div>
      {!isLoading && (
        <SlideSwiper
          optionSwiper={{
            quantitySlide: resProduct?.data.length || 10,
            slidesPerView: 5,
            spaceBetween: 10,
            slidesPerGroup: 1,
            lazyPreloadPrevNext: 1,
            grabCursor: true,
            loop: resProduct && resProduct?.data.length > 5 ? true : false,
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
                <Card product={product}></Card>
              </SwiperSlide>
            );
          })}
        </SlideSwiper>
      )}
      {isLoading && (
        <div className="flex w-full mt-5 gap-x-3">
          {Array(5)
            .fill(null)
            .map((_, index) => {
              return (
                <div key={index} className="basis-1/5">
                  <CartSkeleton></CartSkeleton>
                </div>
              );
            })}
        </div>
      )}
    </LayoutProduct>
  );
}
