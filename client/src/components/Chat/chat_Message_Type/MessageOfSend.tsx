import { cn, momentVi } from "@/utils";
import { TPropsMessage } from "../Message";
import { TMessageTypeBorder } from "../chat_View_Messages/DisplayMessages";
import MessageItemImage from "./MessageItemImage";
import { marked } from "marked";
import useChatContext from "../context/useChatContext";

export default function MessageOfSend(props: TPropsMessage) {
  const { message, checkMessageTypeBorder: isTypeBorder } = props;

  const { sizeChatView } = useChatContext();

  const { messageType, imagesId: images } = message;

  const typeBorder = (type: TMessageTypeBorder) => {
    switch (type) {
      case "start":
        return "rounded-s-2xl rounded-se-2xl rounded-ee ";

      case "mid":
        return "rounded-s-2xl rounded-e";

      case "end":
        return "rounded-s-2xl rounded-se rounded-ee-2xl ";

      default:
        return "rounded-2xl ";
    }
  };

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

  return (
    <div className="MessageOfSend">
      <div className="flex justify-end w-full">
        <div
          role={messageType}
          data-type-border={isTypeBorder}
          className={cn(
            "relative min-w-[60px] max-w-[70%] bg-orange cursor-text text-[14px] flex text-white transition-all",
            typeBorder(isTypeBorder),
            messageType === "image" &&
              `overflow-hidden h-fit bg-transparent cursor-pointer ${
                sizeChatView === "big" ? "max-w-[480px]" : "max-w-[60%]"
              } `
          )}
        >
          {messageType === "text" && (
            <span
              className="p-2 pb-3 text-start"
              dangerouslySetInnerHTML={{
                __html: marked.parse(message.text || ""),
              }}
            ></span>
          )}
          {messageType === "image" && images && images.length > 0 && (
            <div
              className={cn(
                "Images_Group grid gap-1 w-full",
                ImagesWithCSSGrid(images.length)
              )}
            >
              {images.map((image) => {
                return (
                  <MessageItemImage
                    key={image._id}
                    image={image}
                    imagesCount={images.length}
                  />
                );
              })}
            </div>
          )}
          <div
            className={cn(
              "absolute bottom-0 text-[10px] font-semibold right-2 text-grayF5 text-end z-30",
              message.messageType === "image" &&
                "absolute bottom-1 right-3 bg-opacity-50 bg-black px-1 rounded-md"
            )}
          >
            {momentVi(message.createdAt).format("HH:mm")}
          </div>
        </div>
      </div>
    </div>
  );
}
