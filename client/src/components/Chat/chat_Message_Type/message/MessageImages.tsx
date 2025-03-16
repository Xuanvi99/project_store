import MessageItemImage from "./MessageItemImage";
import { cn, momentVi } from "@/utils";
import useChatContext from "../../context/useChatContext";
import { TMessageTypeBorder } from "../../chat_View_Messages/DisplayMessages";

type TProps = {
  images: Array<{
    _id?: string;
    url: string;
    width: number;
    height: number;
  }>;
  messageType: string;
  className: string;
  typeBorder: TMessageTypeBorder;
  createdAt: Date;
};
function MessageImages({
  images,
  messageType,
  className,
  typeBorder,
  createdAt,
}: TProps) {
  const { sizeChatView } = useChatContext();

  const ImagesWithCSSGrid = (imagesCount: number) => {
    switch (true) {
      case imagesCount === 1:
        return "grid-cols-1";

      case imagesCount === 2:
      case imagesCount === 4:
        return "grid-cols-2";

      case imagesCount > 2:
        return "grid-cols-3";

      default:
        return "";
    }
  };
  if (messageType !== "image" || !images || images.length === 0) return;
  return (
    <div
      role={messageType}
      data-type-border={typeBorder}
      className={cn(
        "relative transition-all overflow-hidden cursor-pointer",
        sizeChatView === "big" ? "max-w-[480px]" : "max-w-[60%]",
        className
      )}
    >
      <div
        className={cn(
          "Images_Group grid gap-1 w-full",
          ImagesWithCSSGrid(images.length)
        )}
      >
        {images.map((image, index) => {
          return (
            <MessageItemImage
              key={index}
              image={image}
              imagesCount={images.length}
            />
          );
        })}
      </div>
      <div
        className={cn(
          "absolute bg-opacity-50 bg-black px-1 text-[10px] rounded-md bottom-1 right-3 text-white z-30"
        )}
      >
        {momentVi(createdAt).format(
          momentVi(createdAt).isSame(new Date(Date.now()), "day")
            ? "HH:mm"
            : "HH:mm, l"
        )}
      </div>
    </div>
  );
}
export default MessageImages;
