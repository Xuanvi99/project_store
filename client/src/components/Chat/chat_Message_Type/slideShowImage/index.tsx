import { IconChevronRight, IconCLose } from "@/components/icon";
import { cn } from "@/utils";
import { useState } from "react";
import IconChevronLeft from "../../../icon/IconChevronLeft";
import SlideImages from "./SlideImages";

type TProps = {
  onClick: () => void;
  image: {
    _id?: string;
    url: string;
    width: number;
    height: number;
  };
};

function SlideShowImage({ onClick, image }: TProps) {
  const [loadedBg, setLoadedBg] = useState(false);
  const [loadedImgMain, setLoadedImgMain] = useState(false);
  if (!image) return;
  return (
    <div className="fixed top-0 left-0 z-50 w-screen h-screen bg-black group">
      <div
        className={cn("absolute inset-0 z-10 invisible", loadedBg && "visible")}
      >
        <img
          alt="background"
          srcSet={image.url}
          className="object-cover w-full h-full"
          onLoad={() => setLoadedBg(true)}
        />
        <div className="absolute inset-0 bg-black/70 backdrop-blur-lg"></div>
      </div>
      <div
        className="absolute z-30 flex items-center justify-center w-10 h-10 transition-all bg-white rounded-full text-grayDark left-5 top-2 hover:scale-110"
        onClick={onClick}
      >
        <IconCLose size={15} />
      </div>
      <div
        className={cn(
          "absolute inset-0 top-0 left-0 z-20 flex-col hidden",
          loadedBg && "flex"
        )}
      >
        <div className="relative flex-1 w-full h-[calc(100%-36px)] max-h-[calc(100%-36px)] py-2">
          <div
            className={cn(
              "flex items-center justify-center w-full h-full invisible",
              loadedImgMain && "visible"
            )}
          >
            <img
              alt="showImage"
              srcSet={image.url}
              className="object-cover w-auto max-h-full rounded-md"
              height={image.height}
              onLoad={() => setLoadedImgMain(true)}
            />
          </div>
          <div className="absolute inset-0 btnSlide">
            <div className="absolute top-0 left-0 flex items-center justify-center h-full px-5 transition-all delay-1000 -translate-x-full bg-black/5 group-hover:delay-0 group-hover:translate-x-0">
              <span className="flex items-center justify-center transition-all rounded-full w-9 h-9 bg-grayCa hover:bg-white hover:-translate-x-1">
                <IconChevronLeft size={20} />
              </span>
            </div>
            <div className="absolute top-0 right-0 flex items-center justify-center h-full px-5 transition-all delay-1000 translate-x-full bg-black/5 group-hover:delay-0 group-hover:translate-x-0">
              <span className="flex items-center justify-center transition-all rounded-full w-9 h-9 bg-grayCa hover:bg-white hover:translate-x-1">
                <IconChevronRight size={20} />
              </span>
            </div>
          </div>
        </div>
        <div className="w-full slideImage max-h-9 h-9 ">
          <SlideImages />
        </div>
      </div>
    </div>
  );
}

export default SlideShowImage;
