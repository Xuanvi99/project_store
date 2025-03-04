import { IconUploadImage } from "@/components/icon";
import { cn } from "@/utils";
import { ImageType } from "react-images-uploading";

type TProps = {
  openEditImages: boolean;
  handleSetOpenEditImages: (value: boolean) => void;
  onChangeImages: (images: ImageType[]) => void;
};
function ChatFileImg({
  openEditImages,
  handleSetOpenEditImages,
  onChangeImages,
}: TProps) {
  return (
    <div className={cn("Icon_upload_file", openEditImages && "hidden")}>
      <input
        type="file"
        name="file"
        id="file"
        multiple
        className="hidden"
        onChange={(e) => {
          if (e.target.files) {
            const files = e.target.files;
            const images: ImageType[] = [];
            for (const file of files) {
              const image = {
                data_url: URL.createObjectURL(file),
                file: file,
              };
              images.push(image);
            }
            onChangeImages(images);
            handleSetOpenEditImages(true);
          }
        }}
      />
      <label
        htmlFor="file"
        className="cursor-pointer text-blue hover:text-orange"
      >
        <IconUploadImage size={25} />
      </label>
    </div>
  );
}

export default ChatFileImg;
