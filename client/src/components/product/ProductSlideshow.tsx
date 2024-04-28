import { SwiperSlide } from "swiper/react";
import { cn } from "../../utils";
import LayoutProduct from "../../layout/LayoutProduct";
import { Link } from "react-router-dom";
import CardItem from "../card";
import SlideSwiper from "../slideshows";
import { IconChevronRight } from "../icon";

interface IProps {
  name: string;
}

export default function ProductSlideshow({ name }: IProps) {
  return (
    <LayoutProduct>
      <div
        className={cn(
          "w-full flex justify-between items-center min-h-[50px] rounded-md p-[10px] font-bold",
          name === "sale"
            ? "text-red-800 bg-orangeLinear"
            : "bg-white text-orange"
        )}
      >
        <div className="relative flex items-center text-2xl gap-x-2">
          <i>
            {name == "sale"
              ? "Giá Sốc hôm nay"
              : name.charAt(0).toUpperCase() + name.slice(1)}
          </i>
          {name == "sale" && (
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
            name === "sale" ? "hover:text-white" : "hover:text-black"
          )}
        >
          <span>Xem thêm</span>
          <IconChevronRight size={14}></IconChevronRight>
        </Link>
      </div>
      <SlideSwiper
        optionSwiper={{
          quantitySlide: 10,
          slidesPerView: 5,
          spaceBetween: 10,
          slidesPerGroup: 5,
          lazyPreloadPrevNext: 5,
          grabCursor: true,
          loop: true,
          speed: 100,
        }}
        slideHover={true}
        className={{ container: "mt-5" }}
      >
        {Array(10)
          .fill(null)
          .map((_, index) => {
            return (
              <SwiperSlide key={index}>
                <CardItem type={name === "sale" ? "sale" : "normal"}></CardItem>
              </SwiperSlide>
            );
          })}
      </SlideSwiper>
    </LayoutProduct>
  );
}
