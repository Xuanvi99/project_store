import { TPropsMessage } from "../Message";
import { TMessageTypeBorder } from "../chat_View_Messages/DisplayMessages";
import MessageText from "./message/MessageText";
import MessageImages from "./message/MessageImages";
import MessageEmoji from "./message/MessageEmoji";
import MessageLike from "./message/MessageLike";

export default function MessageOfSend(props: TPropsMessage) {
  const {
    message,
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
        return "rounded-s-2xl rounded-se-2xl rounded-ee ";

      case "mid":
        return "rounded-s-2xl rounded-e";

      case "end":
        return "rounded-s-2xl rounded-se rounded-ee-2xl ";

      default:
        return "rounded-2xl ";
    }
  };

  return (
    <div
      data-message-type={messageType}
      data-border-type={isTypeBorder}
      className="flex flex-col items-end w-full"
    >
      {messageType === "text" && text && (
        <MessageText
          senderId={senderId._id}
          messageText={text}
          messageType={messageType}
          className={typeBorder(isTypeBorder)}
          createdAt={createdAt}
        >
          {!displayTimeSend && (
            <div className="flex justify-end w-full pb-1 text-[10px] font-semibold">
              {receiverSeen ? "Đã xem" : "Đã gửi"}
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
  );
}
