import { LazyLoadImage } from "react-lazy-load-image-component";
import { TPropsMessage } from "../Message";
import { cn, momentVi } from "@/utils";
import { TMessageTypeBorder } from "../chat_View_Messages/DisplayMessages";
import MessageItemImage from "./MessageItemImage";
import { marked } from "marked";

export default function MessageOfReceive(props: TPropsMessage) {
  const {
    message,
    displayAvatar,
    displayReceiverSeen,
    receiverInfo,
    checkMessageTypeBorder: isTypeBorder,
  } = props;

  const { messageType, imagesId: images } = message;

  const typeBorder = (type: TMessageTypeBorder) => {
    switch (type) {
      case "start":
        return "rounded-e-2xl rounded-ss-2xl rounded-es";

      case "mid":
        return "rounded-e-2xl rounded-s";

      case "end":
        return "rounded-e-2xl rounded-ss rounded-es-2xl";

      default:
        return "rounded-2xl";
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
    <div className="flex flex-col MessageOfReceiver">
      <div className="flex items-end justify-start w-full gap-x-2">
        <div
          className={cn(
            "flex flex-col justify-end h-full invisible",
            displayAvatar && "visible "
          )}
        >
          <span className="overflow-hidden rounded-full w-7 h-7">
            <LazyLoadImage
              alt="image"
              placeholderSrc={"/userName.png"}
              srcSet={receiverInfo?.avatar?.url || receiverInfo?.avatarDefault}
              effect="blur"
              className="object-cover w-full h-full"
              height={28}
              width={28}
              threshold={100}
            />
          </span>
        </div>
        <div
          role={messageType}
          data-type-border={isTypeBorder}
          className={cn(
            "relative min-w-[60px] max-w-[70%] bg-grayE5 text-black flex text-[14px] cursor-text transition-all",
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
                "Images_Group grid gap-1 w-full h-auto",
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
              "absolute bottom-0 text-[10px] font-semibold right-2 text-end text-gray z-30",
              message.messageType === "image" &&
                "absolute bottom-1 right-3 bg-opacity-50 bg-black px-1 rounded-md text-white"
            )}
          >
            {momentVi(message.createdAt).format("HH:mm")}
          </div>
        </div>
      </div>
      <div
        className={cn(
          "w-4 h-4 ml-auto transition-all",
          displayReceiverSeen ? "opacity-1" : " hidden opacity-0"
        )}
      >
        <LazyLoadImage
          alt="image_avatar"
          placeholderSrc={"/userName.png"}
          srcSet={receiverInfo?.avatar?.url || receiverInfo?.avatarDefault}
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
