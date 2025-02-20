import { IconCLose, IconUploadImage } from "@/components/icon";
import { cn } from "@/utils";
import { useEffect, useRef, useState } from "react";
import ImageUploading, { ImageType } from "react-images-uploading";

type TProps = {
  openEditImages: boolean;
  listImages: ImageType[];
  handleSetOpenEditImage: (value: boolean) => void;
  onChangeImages: (images: ImageType[]) => void;
};
export default function EditMessageImages(props: TProps) {
  const { openEditImages, onChangeImages, listImages, handleSetOpenEditImage } =
    props;

  const ImagesContainerRef = useRef<HTMLDivElement>(null);

  const [clientWidthImages, setClientWidthImages] = useState<number>(0);

  const [amountImage, setAmountImage] = useState<number>(0);

  useEffect(() => {
    if (ImagesContainerRef.current) {
      setClientWidthImages(ImagesContainerRef.current.clientWidth);
    }
  }, []);

  useEffect(() => {
    const ImagesRef = ImagesContainerRef.current;
    if (ImagesRef && listImages && listImages.length > amountImage) {
      setAmountImage(listImages.length);
      ImagesRef?.scrollTo({
        left: ImagesRef.scrollWidth,
        behavior: "smooth",
      });
    }
  }, [amountImage, listImages]);

  return (
    <ImageUploading
      multiple
      value={listImages}
      onChange={onChangeImages}
      acceptType={["png", "jpg", "jpeg"]}
      maxFileSize={25000000}
      dataURLKey="data_url"
    >
      {({ imageList, onImageUpload, onImageRemove }) => {
        return (
          <div
            className={cn("transition-all ", openEditImages ? "h-fit" : "h-0")}
          >
            <div
              className={cn(
                "upload__image-wrapper relative pt-2 px-5 w-full flex items-center gap-x-3 ",
                !openEditImages && "hidden"
              )}
            >
              <div
                className="absolute cursor-pointer Icon_close top-1 right-1"
                onClick={() => {
                  handleSetOpenEditImage(false);
                  onChangeImages([]);
                }}
              >
                <IconCLose size={12} />
              </div>
              <div
                onClick={onImageUpload}
                className="flex flex-col items-center justify-center w-12 h-12 border-2 border-dashed rounded-md cursor-pointer border-grayCa gap-x-2 text-blue"
              >
                <IconUploadImage size={25} />
              </div>
              <div
                ref={ImagesContainerRef}
                className={cn(
                  "w-full py-2",
                  clientWidthImages < imageList.length * 60 &&
                    "overflow-x-scroll"
                )}
              >
                <div
                  className="flex items-center gap-x-3"
                  style={{ width: 60 * imageList.length }}
                >
                  {imageList.map((image, index) => {
                    return (
                      <div key={index} className="relative w-12 h-12">
                        <img
                          alt="message_image"
                          srcSet={image["data_url"]}
                          className="object-cover w-12 h-12 overflow-hidden rounded-md"
                          loading="lazy"
                        />
                        <div
                          onClick={() => {
                            onImageRemove(index);
                            if (imageList.length === 1) {
                              handleSetOpenEditImage(false);
                            }
                          }}
                          className="absolute top-[-5px] right-[-5px] w-5 h-5 text-orange rounded-full bg-white flex justify-center items-center z-20  hover:bg-orange hover:text-white cursor-pointer border-1 border-orange"
                        >
                          <IconCLose size={7} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        );
      }}
    </ImageUploading>
  );
}
