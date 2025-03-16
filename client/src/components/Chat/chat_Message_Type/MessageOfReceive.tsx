import { LazyLoadImage } from "react-lazy-load-image-component";
import { TPropsMessage } from "../Message";
import { cn } from "@/utils";
import { TMessageTypeBorder } from "../chat_View_Messages/DisplayMessages";
import MessageText from "./message/MessageText";
import MessageImages from "./message/MessageImages";
import MessageEmoji from "./message/MessageEmoji";
import MessageLike from "./message/MessageLike";

export default function MessageOfReceive(props: TPropsMessage) {
  const {
    message,
    displayAvatar,
    receiverInfo,
    checkMessageTypeBorder: isTypeBorder,
    displayTimeSend,
  } = props;

  const {
    messageType,
    imagesId: images,
    emojis,
    senderId,
    text,
    createdAt,
    receiverSeen,
  } = message;

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

  return (
    <div
      data-message-type={messageType}
      data-border-type={isTypeBorder}
      className="flex items-end justify-start w-full MessageOfReceiver gap-x-2"
    >
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
      <div className="flex flex-col justify-start w-full">
        {messageType === "text" && text && (
          <MessageText
            senderId={senderId._id}
            messageText={text}
            messageType={messageType}
            className={typeBorder(isTypeBorder)}
            createdAt={createdAt}
          >
            {!displayTimeSend && (
              <div className="flex justify-start w-full pb-1 text-[10px] font-semibold">
                {receiverSeen && "Đã xem"}
              </div>
            )}
          </MessageText>
        )}
        {messageType === "image" && images && images.length > 0 && (
          <MessageImages
            images={images}
            messageType={messageType}
            typeBorder={isTypeBorder}
            className={typeBorder(isTypeBorder)}
            createdAt={createdAt}
          />
        )}
        {messageType === "emoji" && emojis && emojis.length > 0 && (
          <MessageEmoji
            emojis={emojis}
            senderId={senderId._id}
            messageType={messageType}
            createdAt={message.createdAt}
            className={typeBorder(isTypeBorder)}
          >
            {!displayTimeSend && (
              <div className="flex justify-end w-full pb-1 text-[10px] font-semibold">
                {receiverSeen ? "Đã xem" : "Đã gửi"}
              </div>
            )}
          </MessageEmoji>
        )}
        {messageType === "like" && text && (
          <MessageLike
            messageText={text}
            senderId={senderId._id}
            messageType={messageType}
            className={typeBorder(isTypeBorder)}
            createdAt={createdAt}
          >
            {!displayTimeSend && (
              <div className="flex justify-end w-full pb-1 text-[10px] font-semibold">
                {receiverSeen ? "Đã xem" : "Đã gửi"}
              </div>
            )}
          </MessageLike>
        )}
      </div>
    </div>
  );
}
