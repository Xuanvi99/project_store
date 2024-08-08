import CardSales from "@/components/card/Sale.card";
import { IconCLose, IconExpand } from "@/components/icon";
import Modal from "@/components/modal";
import SlideSwiper from "@/components/slideshows";
import { useToggle } from "@/hook";
import useTestContext from "@/hook/useTestContext";
import { cn } from "@/utils";
import { useState } from "react";
import { SwiperSlide } from "swiper/react";
import { DetailProductContext, IDetailProductProvide } from "../../context";
import { LazyLoadImage } from "react-lazy-load-image-component";

const ProductImages = () => {
  const { product } = useTestContext<IDetailProductProvide>(
    DetailProductContext as React.Context<IDetailProductProvide>
  );

  const { toggle: showModal, handleToggle: handleShowModal } = useToggle();
  const [slideSmallIndex, setSlideSmallIndex] = useState<number>(0);
  const [slideBigIndex, setSlideBigIndex] = useState<number>(0);

  const handleChangeSlide = (slide: "normal" | "zoom") => {
    switch (slide) {
      case "normal":
        {
          const slideActive = document.querySelector(
            ".slide-product_normal .swiper-slide-active"
          ) as HTMLElement;
          const ActiveIndex = slideActive?.dataset.swiperSlideIndex;
          setSlideSmallIndex(Number(ActiveIndex));
        }
        break;
      case "zoom":
        {
          const slideActive = document.querySelector(
            ".slide-product_zoom .swiper-slide-active"
          ) as HTMLElement;
          const ActiveIndex = slideActive?.dataset.swiperSlideIndex;
          ActiveIndex
            ? setSlideBigIndex(Number(ActiveIndex))
            : setSlideBigIndex(slideSmallIndex);
        }
        break;
      default:
        break;
    }
  };

  if (!product) {
    return;
  }

  return (
    <div className="max-w-[400px] basis-2/5 ">
      <Modal
        isOpenModal={showModal}
        onClick={handleShowModal}
        className={{ content: "absolute inset-0 z-50 w-full h-screen" }}
      >
        <div className="flex flex-col justify-between w-full h-full">
          <div className="h-[50px] flex justify-between items-center text-white px-5">
            <span className="text-2xl">
              {slideBigIndex + 1}/{product?.imageIds.length}
            </span>
            <span
              onClick={handleShowModal}
              className="cursor-pointer hover:text-orange"
            >
              <IconCLose size={30}></IconCLose>
            </span>
          </div>
          <div className="max-h-[calc(100%-100px)] overflow-hidden">
            <SlideSwiper
              optionSwiper={{
                initialSlide: slideSmallIndex,
                slidesPerView: 1,
                slidesPerGroup: 1,
                quantitySlide: 5,
                loop: product.imageIds.length > 5 ? true : false,
                onSlideNextTransitionEnd: () => handleChangeSlide("zoom"),
                onSlidePrevTransitionEnd: () => handleChangeSlide("zoom"),
              }}
              slideActions={"display"}
              className={{
                container: "h-full flex slide-product_zoom",
                btnLeft: "opacity-100",
                btnRight: "opacity-100",
              }}
            >
              {product?.imageIds.map((image, index) => {
                return (
                  <SwiperSlide key={index} onClick={handleShowModal}>
                    <div className="flex justify-center h-full">
                      <img alt="" loading="lazy" srcSet={image.url} />
                    </div>
                  </SwiperSlide>
                );
              })}
            </SlideSwiper>
          </div>
          <div className="w-full h-[50px] text-white relative">
            <span className="absolute inset-0 z-40 bg-black opacity-70"></span>
            <p className="absolute inset-0 z-50 flex items-center justify-center">
              {product.name}
            </p>
          </div>
        </div>
      </Modal>
      <div className="w-full h-[400px] relative">
        <SlideSwiper
          slideActive={slideSmallIndex}
          slideActions={"display"}
          optionSwiper={{
            grabCursor: true,
            slidesPerView: 1,
            slidesPerGroup: 1,
            lazyPreloadPrevNext: 1,
            quantitySlide: 6,
            loop: true,
            onSlideNextTransitionEnd: () => handleChangeSlide("normal"),
            onSlidePrevTransitionEnd: () => handleChangeSlide("normal"),
          }}
          className={{
            container: "slide-product_normal w-full h-full",
          }}
        >
          {product?.imageIds.map((image, index) => {
            return (
              <SwiperSlide key={index}>
                <LazyLoadImage
                  alt="Thumbnails"
                  placeholderSrc={image.url}
                  srcSet={image.url}
                  effect="blur"
                  className="object-cover rounded-md"
                  onClick={() => {
                    handleShowModal();
                  }}
                />
              </SwiperSlide>
            );
          })}
        </SlideSwiper>
        {product.is_sale && (
          <CardSales
            discount={Math.ceil(
              ((product.price - product.priceSale) * 100) / product.price
            )}
            className="-left-1 top-1"
          ></CardSales>
        )}
        <div
          onClick={() => {
            handleShowModal();
            handleChangeSlide("zoom");
          }}
          className={cn(
            "text-orange absolute bottom-2 left-2 z-20 w-10 h-10 rounded-full border-[1px] border-orange flex items-center justify-center cursor-pointer",
            "hover:bg-orangeLinear hover:text-white "
          )}
        >
          <IconExpand size={20}></IconExpand>
        </div>
      </div>
      <div className="w-full mt-5">
        <SlideSwiper
          optionSwiper={{
            grabCursor: true,
            slidesPerView: 5,
            spaceBetween: 10,
            slidesPerGroup: 1,
            lazyPreloadPrevNext: 5,
            quantitySlide: 5,
          }}
          slideActions={"hover"}
          slideActive={slideSmallIndex}
          className={{ btnLeft: "py-4", btnRight: "py-4" }}
        >
          {product?.imageIds.map((image, index) => {
            return (
              <SwiperSlide key={index} className="flex items-center">
                <LazyLoadImage
                  alt="slideItem"
                  placeholderSrc={image.url}
                  srcSet={image.url}
                  effect="blur"
                  className={cn(
                    "bg-white opacity-50 max-h-[150px] duration-300 hover:opacity-100 hover:scale-110 hover:border-none",
                    index === slideSmallIndex
                      ? "opacity-100 border-4 border-orange"
                      : ""
                  )}
                  onClick={() => setSlideSmallIndex(index)}
                  loading="lazy"
                />
              </SwiperSlide>
            );
          })}
        </SlideSwiper>
      </div>
    </div>
  );
};

export default ProductImages;
