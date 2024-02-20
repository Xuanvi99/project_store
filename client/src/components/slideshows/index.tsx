import { Swiper, SwiperRef } from "swiper/react";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { Autoplay } from "swiper/modules";
import { useEffect, useRef, useState } from "react";
import IconChevronLeft from "../icon/IconChevronLeft";
import IconChevronRight from "../icon/IconChevronRight";
import { cn } from "../../utils";

interface IOptionSwiperProps {
  optionSwiper: {
    initialSlide?: number;
    spaceBetween?: number | string;
    slidesPerGroup?: number;
    slidesPerView: number;
    lazyPreloadPrevNext?: number;
    quantitySlide: number;
    grabCursor?: boolean;
    loop?: boolean;
    autoPlay?: {
      delay: number;
      disableOnInteraction: boolean;
    };
    speed?: number;
    onSlideNextTransitionStart?: () => void;
    onSlidePrevTransitionStart?: () => void;
    onSlideNextTransitionEnd?: () => void;
    onSlidePrevTransitionEnd?: () => void;
  };
}

interface ISwiperProps extends IOptionSwiperProps {
  className?: {
    container?: string;
    btnLeft?: string;
    btnRight?: string;
  };
  children: React.ReactNode;
  slideActive?: number;
  slideHover?: boolean;
}

function SlideSwiper({
  children,
  className,
  slideActive,
  slideHover,
  optionSwiper,
}: ISwiperProps) {
  const sliderRef = useRef<SwiperRef>(null);
  const wrapSliderRef = useRef<HTMLDivElement>(null);
  const [showBtn, setShowBtn] = useState<boolean>(false);
  const [screenWidth, setScreenWidth] = useState<number>(window.innerWidth);

  const { quantitySlide, slidesPerView, autoPlay, ...option } = optionSwiper;

  const handlePrev = () => {
    if (!sliderRef.current) return;
    sliderRef.current.swiper.slidePrev(1000);
  };

  const handleNext = () => {
    if (!sliderRef.current) return;
    sliderRef.current.swiper.slideNext(1000);
  };

  useEffect(() => {
    if (slideActive === undefined) return;
    const handleCLickActiveSlide = (slideActive: number) => {
      if (!sliderRef.current) return;
      sliderRef.current.swiper.slideToLoop(slideActive, 1000);
    };
    handleCLickActiveSlide(slideActive);
  }, [slideActive]);

  useEffect(() => {
    const slider = wrapSliderRef.current;

    const handleSizeScreen = () => {
      setScreenWidth(window.innerWidth);
    };
    window.addEventListener("resize", handleSizeScreen);

    if (!slider || !slideHover || screenWidth < 1024) return;

    const handleOverSlider = () => {
      setShowBtn(true);
    };

    const handleOutSlider = () => {
      setShowBtn(false);
    };

    slider.addEventListener("mouseover", handleOverSlider);
    slider.addEventListener("mouseout", handleOutSlider);

    return () => {
      window.removeEventListener("resize", handleSizeScreen);
      slider.removeEventListener("mouseover", handleOverSlider);
      slider.removeEventListener("mouseout", handleOutSlider);
    };
  }, [screenWidth, slideHover]);

  return (
    <div
      className={cn("w-full relative", className?.container)}
      ref={wrapSliderRef}
    >
      <Swiper
        {...option}
        slidesPerView={slidesPerView}
        autoplay={autoPlay}
        modules={[Autoplay]}
        ref={sliderRef}
        className="swiper"
      >
        {children}
      </Swiper>
      {quantitySlide > slidesPerView && (
        <button
          type="button"
          onClick={handlePrev}
          className={cn(
            "absolute left-0 top-1/2 -translate-y-1/2 z-30 duration-700 shadow-sm shadow-slate-600 px-2 py-7 rounded-sm",
            "bg-white hover:bg-orangeLinear hover:text-white",
            showBtn
              ? "-translate-x-[100%] opacity-100"
              : "opacity-0 max-lg:opacity-100",
            className?.btnLeft
          )}
        >
          <IconChevronLeft size={20}></IconChevronLeft>
        </button>
      )}
      {quantitySlide > slidesPerView && (
        <button
          type="button"
          onClick={handleNext}
          className={cn(
            "absolute right-0 top-1/2 -translate-y-1/2 z-50 duration-700 shadow-sm shadow-slate-600 px-2 py-7 rounded-sm",
            "bg-white hover:bg-orangeLinear hover:text-white",
            showBtn
              ? "translate-x-[100%] opacity-100"
              : "opacity-0 max-lg:opacity-100",
            className?.btnRight
          )}
        >
          <IconChevronRight size={20}></IconChevronRight>
        </button>
      )}
    </div>
  );
}

export default SlideSwiper;
