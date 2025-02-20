import { useSelectorAuthSlice, useSelectorChatSlice } from "@/hook";
import { IMessage, IReqSendMessage } from "@/types/chat.type";
import { momentVi } from "@/utils";
import Message from "../Message";
import { IUser } from "@/types/user.type";

export type TMessageTypeBorder = "start" | "mid" | "end" | "basis";
const DisplayMessages = ({
  messages,
  receiverSeenCvs,
  waitMessages,
}: {
  messages: IMessage<IUser>[];
  receiverSeenCvs: boolean;
  waitMessages: IReqSendMessage[];
}) => {
  const { user } = useSelectorAuthSlice();

  const { receiverInfo } = useSelectorChatSlice();

  const checkDisplayAvatarReceiver = (index: number): boolean => {
    if (index + 1 < messages.length) {
      if (messages[index].senderId._id === messages[index + 1].senderId._id) {
        const time1 = messages[index].createdAt;
        const time2 = messages[index + 1].createdAt;
        return messages[index].receiverId._id ===
          messages[index + 1].receiverId._id &&
          momentVi(time1).isSame(time2, "day")
          ? false
          : true;
      } else {
        return true;
      }
    }
    return true;
  };

  const checkDisplayTimeSendMessage = (index: number): boolean => {
    if (waitMessages.length > 0) return false;
    if (user && index + 1 === messages.length) {
      return user._id === messages[index].senderId._id &&
        !messages[index].receiverSeen
        ? true
        : false;
    }
    return false;
  };

  const checkDisplayReceiverSeenMessage = () => {
    if (receiverSeenCvs) {
      return messages.length - 1;
    }
    if (user && messages.length > 0) {
      let index = -1;
      for (let i = 0; i < messages.length; i++) {
        if (
          messages[i].senderId._id === user._id &&
          messages[i].receiverSeen === true
        ) {
          index = i;
        }
        if (messages[i].senderId._id !== user._id) {
          index = i;
        }
      }
      return index;
    }
    return -1;
  };

  const displayDateMessage = (index: number): boolean => {
    if (index === 0) return true;
    if (index < messages.length) {
      const time1 = messages[index].createdAt;
      const time2 = messages[index - 1].createdAt;
      return momentVi(time1).isSame(time2, "day") ? false : true;
    }
    return false;
  };

  const checkMessageTypeBorder = (index: number): TMessageTypeBorder => {
    if (index === 0) {
      const timeCur = messages[index].createdAt;
      const timeNext = messages[index + 1].createdAt;
      if (
        messages[index].senderId._id === messages[index + 1].senderId._id &&
        momentVi(timeCur).isSame(timeNext, "day")
      ) {
        return "start";
      }
      return "basis";
    }
    if (index > 0 && index === messages.length - 1) {
      const timeCur = messages[index].createdAt;
      const timePre = messages[index - 1].createdAt;
      if (
        messages[index].senderId._id === messages[index - 1].senderId._id &&
        momentVi(timeCur).isSame(timePre, "day")
      ) {
        return "end";
      }
      return "basis";
    }
    const messagePreId = messages[index - 1].senderId._id;
    const messageCurId = messages[index].senderId._id;
    const messageNextId = messages[index + 1].senderId._id;
    const timePre = messages[index - 1].createdAt;
    const timeCur = messages[index].createdAt;
    const timeNext = messages[index + 1].createdAt;
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
  };

  if (!receiverInfo) return;

  return (
    <div className="flex flex-col mt-auto gap-y-[2px]">
      {messages.map((item, index) => {
        return (
          <Message
            key={item._id}
            message={item}
            receiverInfo={receiverInfo}
            displayAvatar={checkDisplayAvatarReceiver(index)}
            displayTimeSend={checkDisplayTimeSendMessage(index)}
            displayDateMessage={displayDateMessage(index)}
            displayReceiverSeen={
              checkDisplayReceiverSeenMessage() === index ? true : false
            }
            checkMessageTypeBorder={checkMessageTypeBorder(index)}
          />
        );
      })}
    </div>
  );
};

export default DisplayMessages;
