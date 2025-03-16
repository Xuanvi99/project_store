import { IconPlus, IconUploadImage } from "@/components/icon";
import Tooltip from "@/components/tooltip";
import { useClickOutSide } from "@/hook";
import { cn } from "@/utils";
import { ImageType } from "react-images-uploading";

type TProps = {
  handleSetOpenEditImages: (value: boolean) => void;
  onChangeImages: (images: ImageType[]) => void;
};
function ChatFile({ handleSetOpenEditImages, onChangeImages }: TProps) {
  const {
    show: openChatFile,
    handleShow: handleOpenChatFile,
    nodeRef,
  } = useClickOutSide<HTMLDivElement>();
  return (
    <div
      ref={nodeRef}
      className={cn("chat_file w-9 h-9 max-h-9 max-w-9 relative")}
    >
      <Tooltip
        place="top"
        className={{
          content:
            "z-40 text-[10px] whitespace-nowrap bg-black bg-opacity-80 text-white ",
        }}
        onClick={handleOpenChatFile}
        content={<p className="whitespace-nowrap">Mở chức năng khác</p>}
      >
        <div className="relative w-9 h-9 flex items-center justify-center group">
          <div
            className={cn(
              "w-5 h-5 rounded-full bg-orange flex justify-center items-center text-white cursor-pointer transition-all",
              "before:absolute before:w-9 before:h-9 before:-translate-x-1/2 before:-translate-y-1/2 before:rounded-full before:bg-opacity-30 before:left-1/2 before:top-1/2 before:bg-orange before:opacity-0 hover:before:opacity-100",
              openChatFile && "rotate-45 bg-red-500"
            )}
          >
            <IconPlus size={12} />
          </div>
        </div>
      </Tooltip>
      {openChatFile && (
        <div
          className={cn(
            "shadow-shadow_5 absolute -top-4 -translate-y-full -left-1 rounded-lg bg-white z-20"
          )}
        >
          <div
            className={cn(
              "relative min-w-[200px] h-auto p-1 z-20",
              "before:absolute before:hoverDropdown before:-bottom-[20px] before:left-5 before:-translate-x-1/2 before:border-l-transparent before:border-r-transparent before:border-b-transparent before:border-[10px] before:border-t-white before:z-30"
            )}
          >
            <div className="p-1 hover:bg-grayE5 rounded-lg">
              <input
                type="file"
                name="file"
                id="file"
                multiple
                className="hidden"
                accept=".jpg,.png"
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
                    handleOpenChatFile();
                  }
                }}
              />
              <label
                htmlFor="file"
                className="cursor-pointer text-blue flex items-center gap-x-2 font-bold group"
              >
                <IconUploadImage size={24} />
                <span className="text-black text-sm ">Tải ảnh lên</span>
              </label>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ChatFile;
