import { IImage } from "@/types/commonType";
import { cn } from "@/utils";
import { useState } from "react";

type TProps = {
  image: IImage;
  imagesCount: number;
};
function MessageItemImage({ image, imagesCount }: TProps) {
  const [loadingImages, setLoadingImages] = useState<boolean>(true);

  const ImageItemWithStyleCSS = (imagesCount: number) => {
    if (imagesCount === 0) return;
    if (imagesCount === 1) {
      if (image.height > image.width) {
        const newWidth = Math.floor((image.width * 350) / image.height);
        return {
          height: image.height,
          maxHeight: "350px",
          width: newWidth + "px",
        };
      } else {
        return {
          width: image.width,
          maxHeight: "350px",
          aspectRatio: "16/9",
        };
      }
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

      <img
        alt="messageImage"
        srcSet={image.url}
        className={cn(
          "object-cover rounded-md w-full",
          imagesCount === 1 && "max-h-[350px]",
          imagesCount === 1 && image.height <= image.width && "aspect-video",
          imagesCount >= 2 && "aspect-square max-h-full",
          loadingImages && "invisible"
        )}
        onLoad={() => {
          setLoadingImages(false);
        }}
      />
    </div>
  );
}

export default MessageItemImage;
