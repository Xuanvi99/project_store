import { cn } from "@/utils";
import { useState } from "react";

type TProps = {
  srcSet: string;
  alt?: string;
  className?: {
    container?: string;
    img?: string;
  };
  children?: React.ReactNode;
  width?: number | string;
  height?: number | string;
  onClick?: () => void;
};
function ImageLazyLoad({
  alt,
  srcSet,
  className,
  children,
  width,
  height,
  onClick,
}: TProps) {
  const [loadingImages, setLoadingImages] = useState<boolean>(true);
  return (
    <div className={cn("relative w-full h-full", className?.container)}>
      {loadingImages && (
        <div className="absolute inset-0 rounded-full bg-grayCa animate-pulse" />
      )}
      <img
        alt={alt}
        srcSet={srcSet}
        className={cn("object-cover rounded-full w-full ", className?.img)}
        width={width}
        height={height}
        onLoad={() => {
          setLoadingImages(false);
        }}
        onClick={onClick}
      />
      {children}
    </div>
  );
}

export default ImageLazyLoad;
