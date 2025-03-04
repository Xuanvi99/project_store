import { cn, momentVi } from "@/utils";
import { TPropsMessage } from "../Message";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { TMessageTypeBorder } from "../chat_View_Messages/DisplayMessages";
import MessageItemImage from "./MessageItemImage";
import { marked } from "marked";

export default function MessageOfSend(props: TPropsMessage) {
  const {
    message,
    displayReceiverSeen,
    checkMessageTypeBorder: isTypeBorder,
  } = props;

  const { receiverId: receiver, messageType, imagesId: images } = message;

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
    <div className={"MessageOfSend flex flex-col w-full items-end gap-y-1"}>
      <div
        role={messageType}
        className={cn(
          "relative min-w-[60px] max-w-[70%] bg-orange cursor-text text-[14px] flex text-white transition-all",
          typeBorder(isTypeBorder),
          messageType === "image" &&
            "overflow-hidden h-fit bg-transparent cursor-pointer max-w-[55%]"
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
      {/*display receiver seen */}
      <div
        className={cn(
          "float-right w-4 h-4 transition-all",
          displayReceiverSeen ? "opacity-1" : " hidden opacity-0"
        )}
      >
        <LazyLoadImage
          alt="image_avatar"
          placeholderSrc={"/userName.png"}
          srcSet={receiver?.avatar?.url || receiver?.avatarDefault}
          effect="blur"
          className="w-full h-full rounded-full"
          height={16}
          width={16}
          threshold={100}
        />
      </div>
    </div>
  );
}
