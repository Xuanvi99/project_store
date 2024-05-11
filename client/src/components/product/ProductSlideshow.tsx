import { SwiperSlide } from "swiper/react";
import { cn } from "../../utils";
import LayoutProduct from "../../layout/LayoutProduct";
import { Link } from "react-router-dom";
import Card from "../card";
import SlideSwiper from "../slideshows";
import { IconChevronRight } from "../icon";
import { useGetListProductQuery } from "@/stores/service/product.service";
import { useEffect, useState } from "react";
import { IProductRes } from "@/types/product.type";

interface IProps {
  name: string;
}

export default function ProductSlideshow({ name }: IProps) {
  const { data: resProduct } = useGetListProductQuery({
    search: name,
    activePage: 1,
    limit: 10,
  });

  const [listProduct, setListProduct] = useState<{
    data: IProductRes[];
    totalPage: number;
  }>();

  useEffect(() => {
    if (resProduct) {
      setListProduct(resProduct);
    }
  }, [name, resProduct]);

  return (
    <LayoutProduct>
      <div
        className={cn(
          "w-full flex justify-between items-center min-h-[50px] rounded-md p-[10px] font-bold border-b-1 border-orange",
          name === "flashSale"
            ? "text-red-800 bg-orangeLinear"
            : "bg-white text-orange"
        )}
      >
        <div className="relative flex items-center text-2xl gap-x-2">
          <span>
            {name === "flashSale"
              ? "Giá Sốc hôm nay"
              : "Giày " + name.charAt(0).toUpperCase() + name.slice(1)}
          </span>
          {name === "flashSale" && (
            <img
              src=""
              alt=""
              srcSet="/flashSales.png"
              className=" h-[50px] absolute left-[105%] top-1/2 -translate-y-1/2"
            />
          )}
        </div>
        <Link
          to={"#"}
          className={cn(
            "flex items-center text-base duration-500 gap-x-1 ",
            name === "flashSale" ? "hover:text-white" : "hover:text-black"
          )}
        >
          <span>Xem thêm</span>
          <IconChevronRight size={14}></IconChevronRight>
        </Link>
      </div>
      <SlideSwiper
        optionSwiper={{
          quantitySlide: listProduct?.data.length || 10,
          slidesPerView: 5,
          spaceBetween: 10,
          slidesPerGroup: 1,
          lazyPreloadPrevNext: 1,
          grabCursor: true,
          loop: true,
          speed: 100,
        }}
        slideHover={
          listProduct?.data && listProduct?.data.length > 5 ? true : false
        }
        className={{ container: "mt-5" }}
      >
        {listProduct?.data.map((product, index) => {
          return (
            <SwiperSlide key={index}>
              <Card name={name} type={product.is_sale} product={product}></Card>
            </SwiperSlide>
          );
        })}
      </SlideSwiper>
    </LayoutProduct>
  );
}
