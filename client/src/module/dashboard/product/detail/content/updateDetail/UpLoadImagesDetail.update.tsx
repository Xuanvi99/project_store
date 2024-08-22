import { Button } from "@/components/button";
import { IconRemoveBtn, IconRestore, IconUploadImage } from "@/components/icon";
import useTestContext from "@/hook/useTestContext";
import { cn } from "@/utils";
import { useEffect, useState } from "react";
import ImageUploading, { ImageListType } from "react-images-uploading";
import { DetailProductContext, IDetailProductProvide } from "../../context";
import { IImage } from "@/types/commonType";
import { toast } from "react-toastify";
import { useUpdateThumbnailAndImagesProductMutation } from "@/stores/service/product.service";
import IconDelete from "../../../../../../components/icon/IconDelete";
import { useToggle } from "@/hook";
import ModalVerify from "@/components/modal/ModalVerify";

function UpLoadImagesDetail() {
  const { product, setShowTab } = useTestContext<IDetailProductProvide>(
    DetailProductContext as React.Context<IDetailProductProvide>
  );

  const { toggle: isOpenModal, handleToggle: handleOpenModal } = useToggle();

  const [thumbnailPresent, setThumbnailPresent] = useState<IImage | null>(null);

  const [thumbnailNew, setThumbnailNew] = useState<ImageListType | []>([]);

  const [listImagesPresent, setListImagesPresent] = useState<IImage[]>([]);

  const [listImagesChange, setListImagesChange] = useState<IImage[]>([]);

  const [listFileUpLoadImages, setListFileUpLoadImages] = useState<
    ImageListType | []
  >([]);

  const [listImageDeleted, setListImageDeleted] = useState<IImage[]>([]);

  const [updateThumbnailAndImagesProduct, { isLoading: isLoadingUpdate }] =
    useUpdateThumbnailAndImagesProductMutation();

  const handleDeleteImagePresent = (image: IImage) => {
    const listImagesNewCopy = listImagesChange.filter(
      (item) => item._id !== image._id
    );
    setListImagesChange([...listImagesNewCopy]);
    setListImageDeleted([...listImageDeleted, image]);
  };

  const handleDeleteAllImagePresent = () => {
    setListImageDeleted([...listImagesPresent]);
    setListImagesChange([]);
  };

  const handleRestoreAllImagePresent = () => {
    setListImageDeleted([]);
    setListImagesChange([...listImagesPresent]);
  };

  const handleRestoreImageDeleted = (image: IImage) => {
    if (listFileUpLoadImages.length + listImagesChange.length < 10) {
      const listImageDeletedCopy = listImageDeleted.filter(
        (item) => item._id !== image._id
      );

      const indexImage = listImagesPresent.findIndex(
        (item) => item._id === image._id
      );

      const listImagesNewCopy = [...listImagesChange];
      listImagesNewCopy.splice(indexImage, 0, image);
      console.log("listImagesNewCopy: ", listImagesNewCopy);

      setListImagesChange([...listImagesNewCopy]);
      setListImageDeleted([...listImageDeletedCopy]);
    } else {
      toast("Khôi phục thất bại do đã đủ ảnh 10/10", { type: "warning" });
    }
  };

  const onChangeThumbnail = (imageList: ImageListType) => {
    setThumbnailNew(imageList);
  };

  const onChangeImage = (imageList: ImageListType) => {
    setListFileUpLoadImages(imageList as never[]);
  };

  const handleSubmit = async () => {
    if (listFileUpLoadImages.length + listImagesChange.length >= 5) {
      const formData = new FormData();

      if (thumbnailNew.length > 0) {
        const fileThumbnail = thumbnailNew[0].file;
        if (fileThumbnail) {
          formData.append("thumbnail", fileThumbnail);
        }
      }

      if (listFileUpLoadImages.length > 0) {
        const fileImages = listFileUpLoadImages.map((image) => image.file);
        for (const item of fileImages) {
          if (item) formData.append("images", item);
        }
      }

      if (listImageDeleted.length > 0) {
        const listIdImageDeleted = listImageDeleted.map((image) => image._id);
        formData.append(
          "listIdImageDeleted",
          JSON.stringify(listIdImageDeleted)
        );
      }
      if (product) {
        await updateThumbnailAndImagesProduct({
          productId: product?._id,
          body: formData,
        })
          .unwrap()
          .then(() => {
            setShowTab("info");
            window.scrollTo({ behavior: "smooth", top: 0 });
            setListFileUpLoadImages([]);
            setThumbnailNew([]);
            toast("Cập nhật hình ảnh thành công", { type: "success" });
          })
          .catch(() => toast("Cập nhật hình ảnh thất bại", { type: "error" }))
          .finally(() => {
            handleOpenModal();
          });
      }
    } else {
      toast("Số lượng ảnh sản phẩm lớn hơn 5", { type: "error" });
    }
  };

  useEffect(() => {
    if (product) {
      setThumbnailPresent(product.thumbnail);
      setListImagesPresent([...product.imageIds]);
      setListImagesChange([...product.imageIds]);
      setListImageDeleted([]);
    }
  }, [product]);

  return (
    <div className="flex flex-col w-full rounded-md shadow-md upLoadImagesDetail shadow-gray">
      <ModalVerify
        isOpenModal={isOpenModal}
        handleOpenModal={handleOpenModal}
        handleConfirm={handleSubmit}
        isLoading={isLoadingUpdate}
      >
        <p className="mt-3 text-sm">
          Bạn có chắc chắn muốn cập nhật
          <strong className="text-danger ml-1">hình ảnh</strong> sản phẩm ?
        </p>
      </ModalVerify>
      <div className="p-5 bg-white shadow-shadow1">
        <h1 className="text-lg font-semibold text-orange">2.Hình ảnh</h1>
        <div className="flex mt-5 text-sm gap-y-5">
          <div className="flex flex-col gap-y-3 basis-1/3">
            <h3 className="font-semibold">Ảnh thumbnail:</h3>
            <ImageUploading
              value={thumbnailNew}
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
                      "w-[230px] border-4 border-grayCa rounded-md ",
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
                        className="relative w-full h-[220px]"
                      >
                        <div className="w-full h-full overflow-hidden rounded-sm">
                          <img
                            srcSet={thumbnailPresent?.url}
                            alt="thumbnail"
                            loading="lazy"
                            className="w-full h-full object-cover hover:scale-[1.1] duration-500 opacity-90"
                          />
                        </div>
                        <div
                          className={cn(
                            "absolute inset-0 z-30 w-full h-full overflow-hidden rounded-sm cursor-pointer text-blue",
                            "flex flex-col items-center justify-center gap-y-2 ",
                            "hover:text-orange"
                          )}
                        >
                          <IconUploadImage size={50}></IconUploadImage>
                          <span className="p-3 text-xs font-semibold text-center">
                            Thả ảnh vào đây hoặc bấm vào để tải lên.
                          </span>
                        </div>
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
                          className="absolute top-[-5px] right-[-5px] z-40 text-orange hover:text-red-600 cursor-pointer"
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
                  {thumbnailNew.length > 0 && (
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
            <div>
              <div className="flex items-center gap-x-1">
                <h3>Ảnh sản phẩm</h3>
                <span className="flex items-center">
                  (
                  <p className="text-orange">
                    {listFileUpLoadImages.length + listImagesChange.length}
                  </p>
                  /10):
                </span>
              </div>
              <div className="grid grid-flow-row grid-cols-5 gap-5 mt-5 gap-x-5">
                {listImagesPresent.map((image, index) => {
                  const isCheckImageDeleted = listImageDeleted.includes(image);
                  return (
                    <div
                      key={index}
                      className={cn(
                        "w-[100px] h-[100px] border border-orange rounded-md relative"
                      )}
                    >
                      <img
                        alt="image"
                        srcSet={image.url}
                        className={cn(
                          "object-cover w-full h-full rounded-md",
                          isCheckImageDeleted && "opacity-40"
                        )}
                        loading="lazy"
                      />
                      {isCheckImageDeleted ? (
                        <span
                          onClick={() => handleRestoreImageDeleted(image)}
                          className="absolute z-30 rotate-90 -translate-x-1/2 -translate-y-1/2 cursor-pointer top-1/2 left-1/2 text-orange hover:text-danger"
                        >
                          <IconRestore size={35}></IconRestore>
                        </span>
                      ) : (
                        <span
                          onClick={() => handleDeleteImagePresent(image)}
                          className="absolute top-[-5px] right-[-5px] z-20 text-orange hover:text-red-600 cursor-pointer"
                        >
                          <IconRemoveBtn size={20}></IconRemoveBtn>
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
              <div className="flex items-center justify-end gap-x-2">
                <Button
                  variant="outLine-flex"
                  type="button"
                  className="px-3 py-1 mt-5"
                  onClick={handleRestoreAllImagePresent}
                >
                  <IconRestore size={14}></IconRestore>
                  <p>Khôi phục tất cả</p>
                </Button>
                <Button
                  variant="outLine-flex"
                  type="button"
                  className="px-3 py-1 mt-5"
                  onClick={handleDeleteAllImagePresent}
                >
                  <IconDelete size={14}></IconDelete>
                  <p>Xóa tất cả</p>
                </Button>
              </div>
            </div>
            <div>
              <h3>Ảnh Thêm hoặc thay thế:</h3>
              <ImageUploading
                multiple
                value={listFileUpLoadImages}
                onChange={onChangeImage}
                maxNumber={10}
                acceptType={["png", "jpg", "jpeg"]}
                dataURLKey="data_url"
              >
                {({ imageList, onImageUpload, onImageRemove }) => (
                  <div className="grid grid-flow-row grid-cols-5 gap-5 mt-5 gap-x-5">
                    {imageList.map((image, index) => {
                      return (
                        <div
                          key={index}
                          className="w-[100px] h-[100px] border border-orange rounded-md relative"
                        >
                          <img
                            alt=""
                            srcSet={image["data_url"]}
                            className="object-cover w-full h-full rounded-md"
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
                    {listFileUpLoadImages.length + listImagesChange.length <
                      10 && (
                      <div className="w-full h-[100px] p-[5px] flex flex-col justify-between items-center">
                        <span
                          onClick={onImageUpload}
                          className="flex flex-col items-center justify-center w-full h-full text-xs border-2 border-dashed rounded-md cursor-pointer border-grayCa gap-x-2 text-blue hover:text-orange"
                        >
                          <IconUploadImage size={30}></IconUploadImage>
                          <span>Tải ảnh lên</span>
                          <span>
                            {listFileUpLoadImages.length +
                              listImagesChange.length}
                            /10
                          </span>
                        </span>
                      </div>
                    )}
                  </div>
                )}
              </ImageUploading>
            </div>
          </div>
        </div>
        <div className="flex justify-end">
          <Button
            variant="default"
            type="submit"
            className="max-w-[120px] text-sm "
            onClick={handleOpenModal}
          >
            Cập nhật
          </Button>
        </div>
      </div>
    </div>
  );
}

export default UpLoadImagesDetail;
