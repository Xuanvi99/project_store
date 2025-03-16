import { momentVi } from "@/utils";
import useChatContext from "../context/useChatContext";
import { TMessageTypeBorder } from "./DisplayMessages";
import { LoadingCallApi } from "../../loading/index";
import MessageText from "../chat_Message_Type/message/MessageText";
import MessageImages from "../chat_Message_Type/message/MessageImages";
import MessageEmoji from "../chat_Message_Type/message/MessageEmoji";
import MessageLike from "../chat_Message_Type/message/MessageLike";

function DisplayPreviewMessages() {
  const { previewMessages, messages } = useChatContext();

  const typeBorder = (type: TMessageTypeBorder) => {
    switch (type) {
      case "start":
        return "rounded-s-3xl rounded-se-3xl rounded-ee ";

      case "mid":
        return "rounded-s-3xl rounded-e";

      case "end":
        return "rounded-s-3xl rounded-se rounded-ee-3xl ";

      default:
        return "rounded-3xl ";
    }
  };

  const checkMessageTypeBorder = (index: number): TMessageTypeBorder => {
    if (messages.length === 0) return "basis";
    const timeCur = previewMessages[0].createdAt;
    const messageReal = messages[messages.length - 1];
    const timePre = messageReal.createdAt;
    const messagePreId = previewMessages[0].senderId;
    const messageCurId = messageReal.senderId._id;

    if (index === previewMessages.length - 1) {
      if (
        messageReal.senderId._id === previewMessages[index].senderId &&
        momentVi(timeCur).isSame(timePre, "day")
      ) {
        return "end";
      }
      return "basis";
    } else {
      const timeNext = previewMessages[index + 1].createdAt;
      const messageNextId = previewMessages[index + 1].senderId;
      const checkDayPre = momentVi(timeCur).isSame(timePre, "day");
      const checkDayNext = momentVi(timeCur).isSame(timeNext, "day");
      if (checkDayPre && checkDayNext) {
        if (messageCurId === messagePreId && messageCurId === messageNextId) {
          return "mid";
        } else if (
          messageCurId !== messagePreId &&
          messageCurId === messageNextId
        ) {
          return "start";
        } else if (
          messageCurId === messagePreId &&
          messageCurId !== messageNextId
        ) {
          return "end";
        } else {
          return "basis";
        }
      } else if (!checkDayPre && checkDayNext) {
        return "start";
      } else if (checkDayPre && !checkDayNext) {
        return "end";
      } else {
        return "basis";
      }
    }
  };

  const displayDateMessage = (index: number): boolean => {
    if (messages.length === 0) return true;
    if (index === 0) {
      const time1 = messages[messages.length - 1].createdAt;
      const time2 = previewMessages[0].createdAt;
      return momentVi(time1).isSame(time2, "day") ? false : true;
    }
    return false;
  };

  if (previewMessages.length === 0) return;

  return (
    <div className="flex flex-col mt-1 gap-y-1 DisplayPreviewMessages">
      {previewMessages.length > 0 &&
        previewMessages.map((message, index) => {
          const { messageType, text, emojis, images, senderId } = message;
          return (
            <div key={index} className="w-full preview_message">
              {displayDateMessage(index) && (
                <div className="flex justify-center items-center w-full py-3 text-[10px] font-medium">
                  <span className="px-2 py-1 font-semibold rounded-lg shadow-sm shadow-grayDark bg-grayCa text-gray">
                    {momentVi(message.createdAt).format("ddd, ll")}
                  </span>
                </div>
              )}
              <div className={"message flex flex-col w-full items-end"}>
                {messageType === "text" && text && (
                  <MessageText
                    messageText={text}
                    senderId={senderId}
                    messageType={messageType}
                    className={typeBorder(checkMessageTypeBorder(index))}
                    createdAt={message.createdAt}
                  />
                )}
                {messageType === "image" && images && images.length > 0 && (
                  <MessageImages
                    images={images}
                    messageType={messageType}
                    typeBorder={checkMessageTypeBorder(index)}
                    className={typeBorder(checkMessageTypeBorder(index))}
                    createdAt={message.createdAt}
                  />
                )}
                {messageType === "emoji" && emojis && emojis.length > 0 && (
                  <MessageEmoji
                    emojis={emojis}
                    senderId={senderId}
                    messageType={messageType}
                    createdAt={message.createdAt}
                    className={typeBorder(checkMessageTypeBorder(index))}
                  />
                )}
                {messageType === "like" && text && (
                  <MessageLike
                    messageText={text}
                    senderId={senderId}
                    messageType={messageType}
                    className={typeBorder(checkMessageTypeBorder(index))}
                    createdAt={message.createdAt}
                  />
                )}
              </div>
              {index === previewMessages.length - 1 && (
                <div className="float-right w-4 h-4">
                  <LoadingCallApi />
                </div>
              )}
            </div>
          );
        })}
    </div>
  );
}

export default DisplayPreviewMessages;
