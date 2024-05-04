import { useRef, useState } from "react";
import AvatarEditor from "react-avatar-editor";
import Slider from "rc-slider";
import { useUpdateUserMutation } from "@/stores/service/user.service";
import LoadingSpinner from "@/components/loading";
import { Button } from "@/components/button";
import { Input } from "@/components/input";
import { cn } from "@/utils";
import { RootState } from "@/stores";
import { useAppSelector } from "@/hook";

function EditAvatar() {
  const user = useAppSelector((state: RootState) => state.authSlice.user);
  const cropRef = useRef<AvatarEditor>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const [src, setSrc] = useState<string>("");
  const [modalOpen, setModalOpen] = useState(false);
  const [slideValue, setSlideValue] = useState(10);

  const [updateUser, { isLoading }] = useUpdateUserMutation();

  const handleModalOpen = () => {
    setModalOpen(!modalOpen);
  };

  const handleImgChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.currentTarget.files as FileList;
    if (file && file.length > 0) {
      setSrc(URL.createObjectURL(file[0] as File));
      setModalOpen(true);
    }
  };

  const handleSave = async () => {
    if (cropRef && cropRef.current) {
      const canvas = cropRef.current.getImage();
      canvas.toBlob(
        async (blob: Blob | null) => {
          if (blob) {
            const dataUrl = canvas.toDataURL();
            const file = new File([blob], "avatar.jpg", { type: "image/jpeg" });
            setSrc(dataUrl);
            setModalOpen(false);
            const formData = new FormData();
            formData.append("avatar", file);
            if (user) {
              await updateUser({ id: user._id, body: formData }).unwrap();
            }
          }
        },
        "image/jpeg",
        0.95
      );
    }
  };

  return (
    <div className="flex flex-col items-center basis-2/5 gap-y-5 border-l-1 border-l-grayCa ">
      {!modalOpen ? (
        <div
          className={cn(
            "w-[160px] h-[160px] bg-auto rounded-full relative border-2 border-black overflow-hidden",
            isLoading &&
              "after:absolute after:bg-black after:inset-0 after:w-full after:h-full after:z-20 after:opacity-60"
          )}
        >
          <img
            alt=""
            srcSet={src ? src : user?.avatar?.url || user?.avatarDefault}
            className={"w-full h-full bg-cover absolute inset-0 z-10"}
          />
          {isLoading && (
            <div className="absolute z-30 w-10 h-10 -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2">
              <LoadingSpinner className="w-10 h-10 border-4 border-orangeFe border-r-transparent"></LoadingSpinner>
            </div>
          )}
        </div>
      ) : (
        <div className="flex flex-col gap-y-3">
          <AvatarEditor
            ref={cropRef}
            image={src}
            style={{ width: "190px", height: "190px" }}
            border={30}
            borderRadius={160}
            className="rounded-lg"
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
                handleModalOpen();
                setSrc("");
              }}
            >
              Hủy
            </Button>
            <Button
              type="button"
              variant="outLine"
              className="px-5 text-xs"
              onClick={() => handleSave()}
            >
              Lưu
            </Button>
          </div>
        </div>
      )}
      {!modalOpen && (
        <div className="flex flex-col items-center gap-y-4">
          <Input
            type="file"
            accept="image/*"
            name="avatar"
            ref={inputRef}
            onChange={(event) => handleImgChange(event)}
            className={{ input: "hidden" }}
          ></Input>
          <Button
            type="button"
            variant="outLine"
            className="px-5 text-xs max-w-[100px]"
            disabled={isLoading}
            onClick={() => {
              inputRef.current?.click();
            }}
          >
            Chọn ảnh
          </Button>
          <span className="text-xs text-gray">
            Định dạng: .JPG, .JPEG, .PNG
          </span>
        </div>
      )}
    </div>
  );
}

export default EditAvatar;
