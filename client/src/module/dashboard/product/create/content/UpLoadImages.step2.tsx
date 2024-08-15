import { useEffect, useState } from "react";
import { Button } from "../../../../../components/button";
import useTestContext from "../../../../../hook/useTestContext";
import { CreateProductContext, ICreateProductProvide } from "../context";
import ImageUploading, { ImageListType } from "react-images-uploading";
import IconUploadImage from "../../../../../components/icon/IconUploadImage";
import { cn } from "../../../../../utils";
import { IconRemoveBtn } from "../../../../../components/icon";
import IconChevronRight from "../../../../../components/icon/IconChevronRight";
import IconChevronLeft from "../../../../../components/icon/IconChevronLeft";

function UpLoadImages() {
  const { handleActiveStep, handleSetData, uploadImage, handleSaveStep2 } =
    useTestContext<ICreateProductProvide>(
      CreateProductContext as React.Context<ICreateProductProvide>
    );

  const [thumbnail, setThumbnail] = useState<ImageListType>(
    uploadImage.thumbnail || []
  );

  const [listImages, setListImages] = useState<ImageListType>(
    uploadImage.listImages || []
  );

  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, []);

  const onChangeThumbnail = (imageList: ImageListType) => {
    handleSaveStep2({ thumbnail: imageList, listImages });
    setThumbnail(imageList);
  };

  const onChangeImage = (imageList: ImageListType) => {
    handleSaveStep2({ thumbnail, listImages: imageList });
    setListImages(imageList as never[]);
  };

  const handleSubmit = () => {
    const fileThumbnail = thumbnail[0].file;
    const fileImages = listImages.map((image) => image.file);
    handleSetData({ thumbnail: fileThumbnail, images: fileImages as File[] });
    handleActiveStep("3");
  };

  return (
    <div className="mt-7">
      <div className="flex flex-col items-start gap-y-2">
        <h1 className="font-semibold">Hình ảnh sản phẩm</h1>
        <p className="text-sm text-gray98">Tải lên hình ảnh sản phẩm</p>
      </div>
      <div className="flex mt-5 text-sm gap-y-5 w-[1000px] justify-center">
        <div className="flex flex-col gap-y-3 basis-1/3">
          <div className="font-semibold">
            Ảnh thumbnail<strong className="text-danger">*</strong> :
          </div>
          <ImageUploading
            value={thumbnail}
            onChange={onChangeThumbnail}
            maxNumber={1}
            acceptType={["png", "jpg", "jpeg"]}
            dataURLKey="data_url"
            resolutionType={"ratio"}
          >
            {({
              imageList,
              onImageUpload,
              onImageUpdate,
              onImageRemove,
              isDragging,
              dragProps,
            }) => (
              <div className="flex flex-col items-center gap-y-3">
                <div
                  className={cn(
                    "w-[230px] border-1 border-orange rounded-md ",
                    imageList.length > 0 ? "" : " border-dashed"
                  )}
                  style={isDragging ? { color: "red" } : undefined}
                  {...dragProps}
                >
                  {imageList.length === 0 ? (
                    <div
                      onClick={() => {
                        imageList.length === 0 && onImageUpload();
                      }}
                      className="w-full h-[230px] flex justify-center items-center text-blue flex-col gap-y-2 cursor-pointer"
                    >
                      <IconUploadImage size={50}></IconUploadImage>
                      <span className="p-3 text-xs font-semibold text-center">
                        Thả ảnh vào đây hoặc bấm vào để tải lên.
                      </span>
                    </div>
                  ) : (
                    <div className="w-full h-[230px] relative ">
                      <div className="w-full h-full overflow-hidden rounded-sm">
                        <img
                          srcSet={imageList[0]?.data_url}
                          alt=""
                          className="w-full h-full object-cover hover:scale-[1.1] duration-500"
                        />
                      </div>
                      <span
                        onClick={() => onImageRemove(0)}
                        className="absolute top-[-10px] right-[-10px] z-40 text-orange hover:text-red-600 cursor-pointer"
                      >
                        <IconRemoveBtn size={20}></IconRemoveBtn>
                      </span>
                    </div>
                  )}
                  <div className="bg-[#f8f9fa] flex flex-col flex-1 text-sm gap-y-2 p-[10px]">
                    <div className="flex items-center justify-start mt-auto font-semibold gap-x-2 text-gray ">
                      <span className="text-black"> Tên sản phẩm:</span>
                      <span>XXXXXX...</span>
                    </div>
                    <div className="flex items-center justify-start mt-auto font-semibold gap-x-2 text-gray ">
                      <span className="text-black">Giá:</span>
                      <span>X.XXX.XXX₫</span>
                    </div>
                    <div className="flex items-center justify-start mt-auto font-semibold gap-x-2 text-gray ">
                      <span className="text-black">Đã bán:</span>
                      <span>XXX</span>
                    </div>
                  </div>
                </div>
                {thumbnail.length > 0 && (
                  <div className="flex justify-center w-full gap-x-3">
                    <Button
                      variant="default"
                      className="max-w-[120px] text-xs"
                      onClick={() => onImageUpdate(0)}
                    >
                      Thay đổi
                    </Button>
                  </div>
                )}
              </div>
            )}
          </ImageUploading>
        </div>
        <div className="flex flex-col px-5 font-semibold basis-2/3 gap-y-5">
          <div className="flex items-center font-semibold gap-x-1">
            Ảnh chi tiết
            <span className="flex items-center">
              (<p className="text-orange">{listImages.length}</p>
              /10)<strong className="text-danger">*</strong>:
            </span>
            <span className="text-xs italic font-normal text-gray98">
              ( lưu ý: UpLoad ảnh tối thiểu 5 )
            </span>
          </div>

          <ImageUploading
            multiple
            value={listImages}
            onChange={onChangeImage}
            maxNumber={10}
            acceptType={["png", "jpg", "jpeg"]}
            dataURLKey="data_url"
          >
            {({ imageList, onImageUpload, onImageRemove }) => (
              <>
                {imageList.length >= 0 && (
                  <div className="grid grid-flow-row grid-cols-5 gap-5 gap-x-5">
                    {imageList.map((image, index) => {
                      return (
                        <div
                          key={index}
                          className="w-[100px] h-[100px] relative rounded-md border border-orange"
                        >
                          <img
                            alt=""
                            srcSet={image["data_url"]}
                            className="object-cover w-full h-full rounded-md"
                            loading="lazy"
                          />
                          <span
                            onClick={() => onImageRemove(index)}
                            className="absolute top-[-5px] right-[-5px] z-20 text-orange hover:text-red-600 cursor-pointer"
                          >
                            <IconRemoveBtn size={20}></IconRemoveBtn>
                          </span>
                        </div>
                      );
                    })}
                    {listImages.length < 10 && (
                      <div className="flex flex-col items-center justify-between w-full">
                        <div
                          onClick={onImageUpload}
                          className="flex flex-col items-center justify-center w-[100px] h-[100px] text-xs border-2 border-dashed rounded-md cursor-pointer border-grayCa gap-x-2 text-blue"
                        >
                          <IconUploadImage size={30}></IconUploadImage>
                          <span>Tải ảnh lên</span>
                          <span>{listImages.length}/10</span>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </>
            )}
          </ImageUploading>
        </div>
      </div>

      <div className="flex justify-end w-full mt-10 gap-x-3">
        <Button
          variant="default"
          onClick={() => handleActiveStep("1")}
          className="max-w-[120px] flex items-center text-sm"
        >
          <IconChevronLeft size={20}></IconChevronLeft>
          <span>Quay lại</span>
        </Button>
        <Button
          variant="default"
          disabled={
            thumbnail.length > 0 && listImages.length > 0 ? false : true
          }
          onClick={handleSubmit}
          className="max-w-[120px] flex items-center text-sm"
        >
          <span>Tiếp theo</span>
          <IconChevronRight size={20}></IconChevronRight>
        </Button>
      </div>
    </div>
  );
}

export default UpLoadImages;
