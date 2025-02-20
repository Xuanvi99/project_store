import { IImage } from "@/types/commonType";
import { cn } from "@/utils";
import { useState } from "react";
import { LazyLoadImage } from "react-lazy-load-image-component";

type TProps = {
  image: IImage;
  imagesCount: number;
};
function MessageItemImage({ image, imagesCount }: TProps) {
  const [loadingImages, setLoadingImages] = useState<boolean>(true);

  const ImageItemWithStyleCSS = (imagesCount: number) => {
    if (imagesCount === 0) return;
    if (imagesCount === 1 && image.height > image.width) {
      return {
        height: image.height,
        maxHeight: "350px",
      };
    }
    return { width: image.width, aspectRatio: "1/1" };
  };

  return (
    <div
      className={cn("ImageItem relative h-full max-w-full")}
      style={ImageItemWithStyleCSS(imagesCount)}
    >
      {loadingImages && (
        <div className="absolute inset-0 rounded-md bg-grayCa animate-pulse" />
      )}
      <LazyLoadImage
        alt="messageImage"
        src={image.url}
        effect="blur"
        className={cn(
          "object-cover rounded-md",
          imagesCount === 1 && "max-h-[350px]",
          imagesCount >= 2 && "aspect-square max-h-full"
        )}
        width="100%"
        onLoad={() => {
          setLoadingImages(false);
        }}
      />
    </div>
  );
}

export default MessageItemImage;
