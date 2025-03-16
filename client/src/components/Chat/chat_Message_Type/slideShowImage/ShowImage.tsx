import { useState } from "react";

type TProps = {
  onClick?: () => void;
  image: {
    _id?: string;
    url: string;
    width: number;
    height: number;
  };
};
function ShowImage({ onClick, image }: TProps) {
  const [loadingImages, setLoadingImages] = useState<boolean>(true);

  return (
    <div className="absolute inset-0 top-0 left-0 z-20 flex flex-col">
      <div className="relative flex-1 w-full max-h-[calc(100%-36px)] py-2">
        <div className="flex items-center justify-center w-full h-full ">
          <img
            alt="showImage"
            srcSet={image.url}
            className="object-cover h-full border-2 rounded-md border-orange"
            onLoad={() => {
              setLoadingImages(false);
            }}
          />
        </div>
        <div></div>
      </div>
    </div>
  );
}

export default ShowImage;
