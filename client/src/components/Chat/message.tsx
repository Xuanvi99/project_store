import { useSelectorAuthSlice } from "@/hook";
import { IMessage } from "@/types/chat.type";
import { IUser } from "@/types/user.type";
import { momentVi } from "@/utils";
import { forwardRef, useEffect, useState } from "react";
import MessageOfSend from "./chat_Message_Type/MessageOfSend";
import MessageOfReceive from "./chat_Message_Type/MessageOfReceive";

export type TPropsMessage = {
  message: IMessage<IUser>;
  receiverInfo: IUser;
  displayAvatar: boolean;
  displayTimeSend: boolean;
  displayReceiverSeen: boolean;
  displayDateMessage: boolean;
};

const Message = forwardRef<HTMLDivElement, TPropsMessage>((props, ref) => {
  const { user } = useSelectorAuthSlice();

  const { message, displayTimeSend, displayReceiverSeen, displayDateMessage } =
    props;

  const [timeSender, setTimeSender] = useState<string>("");

  useEffect(() => {
    let timeRefetchSender = undefined;
    if (displayTimeSend && message) {
      timeRefetchSender = setInterval(() => {
        setTimeSender(momentVi(message.createdAt).fromNow());
      }, 60000);
    }

    return () => clearInterval(timeRefetchSender);
  }, [displayTimeSend, message]);

  return (
    <div ref={ref} className="w-full p-1 message">
      {displayDateMessage && (
        <div className="flex justify-center items-center w-full py-1 text-[10px] font-medium">
          <span className="px-2 py-1 font-semibold rounded-lg shadow-sm shadow-grayDark bg-grayCa text-gray">
            {momentVi(message.createdAt).format("ddd, ll")}
          </span>
        </div>
      )}
      {message.senderId._id === user?._id ? (
        <MessageOfSend {...props} />
      ) : (
        <MessageOfReceive {...props} />
      )}
      {displayTimeSend && !displayReceiverSeen && (
        <div className="pt-1 pr-2 text-xs text-gray text-end">
          Đã gửi {timeSender}
        </div>
      )}
    </div>
  );
});

export default Message;
