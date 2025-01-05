import { Button } from "@/components/button";
import { IconUploadImage } from "@/components/icon";
import { Input } from "@/components/input";
import { cn } from "@/utils";
import Slider from "rc-slider";
import { useRef, useState } from "react";
import AvatarEditor from "react-avatar-editor";

const EditImage = ({
  handleCheckImage,
}: {
  handleCheckImage: (file: File | null, checkFile: boolean) => void;
}) => {
  const cropRef = useRef<AvatarEditor>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const [src, setSrc] = useState<string>("");
  const [modalEditImage, setModalEditImage] = useState(false);
  const [slideValue, setSlideValue] = useState(10);

  const handleModalEditImage = () => {
    setModalEditImage(!modalEditImage);
  };

  const handleImgChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.currentTarget.files as FileList;
    if (file && file.length > 0) {
      setSrc(URL.createObjectURL(file[0] as File));
      setModalEditImage(true);
    }
  };

  const handleSaveImage = async () => {
    if (cropRef && cropRef.current) {
      const canvas = cropRef.current.getImage();
      canvas.toBlob(
        async (blob: Blob | null) => {
          if (blob) {
            const dataUrl = canvas.toDataURL();
            const file = new File([blob], "avatar.jpg", { type: "image/jpeg" });
            setSrc(dataUrl);
            setModalEditImage(false);
            handleCheckImage(file, file ? true : false);
          }
        },
        "image/jpeg",
        0.95
      );
    }
  };

  return (
    <div className="Edit Avatar">
      <Input
        type="file"
        accept="image/*"
        name="avatar"
        ref={inputRef}
        onChange={(event) => handleImgChange(event)}
        className={{ input: "hidden" }}
      ></Input>
      <div className="flex flex-col items-center gap-y-1">
        {!modalEditImage ? (
          src ? (
            <div className="flex flex-col items-center justify-center gap-y-3">
              <div
                className={cn(
                  "w-[160px] h-[160px] bg-auto rounded-full relative border-1 border-black overflow-hidden"
                )}
              >
                <img
                  alt="avatar brand"
                  srcSet={src}
                  className={"w-full h-full bg-cover absolute inset-0 z-10"}
                />
              </div>
              {!modalEditImage && src && (
                <Button
                  type="button"
                  variant="outLine"
                  className="px-5 text-xs max-w-[100px]"
                  onClick={() => {
                    inputRef.current?.click();
                  }}
                >
                  Thay đổi
                </Button>
              )}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-between w-full">
              <div
                onClick={() => {
                  inputRef.current?.click();
                }}
                className="flex flex-col items-center justify-center w-[160px] h-[160px] text-xs border-2 border-dashed rounded-full cursor-pointer border-blue gap-x-2 text-blue"
              >
                <IconUploadImage size={30}></IconUploadImage>
                <span>Tải ảnh lên</span>
              </div>
            </div>
          )
        ) : (
          <div className="flex flex-col gap-y-2">
            <AvatarEditor
              ref={cropRef}
              image={src}
              style={{ width: "160px", height: "160px" }}
              border={0}
              borderRadius={160}
              className="rounded-full"
              color={[0, 0, 0, 0.72]}
              scale={slideValue / 10}
              rotate={0}
            />
            <div className="flex text-xs gap-x-2">
              <span>Zoom:</span>
              <span style={{ height: "4px", width: "100%" }}>
                <Slider
                  onChange={(value) => {
                    setSlideValue(Number(value));
                  }}
                  min={10}
                  max={50}
                  defaultValue={10}
                  step={1}
                  className="w-full h-[4px] slider "
                />
              </span>
            </div>
            <div className="flex items-center justify-center gap-x-3">
              <Button
                type="button"
                variant="outLine"
                className="px-5 text-xs"
                onClick={() => {
                  handleModalEditImage();
                  setSrc("");
                }}
              >
                Hủy
              </Button>
              <Button
                type="button"
                variant="outLine"
                className="px-5 text-xs"
                onClick={() => handleSaveImage()}
              >
                Lưu
              </Button>
            </div>
          </div>
        )}
        <span className="mt-2 text-xs text-gray">
          Định dạng: .JPG, .JPEG, .PNG
        </span>
      </div>
    </div>
  );
};

export default EditImage;
