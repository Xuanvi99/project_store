import { useSelectorAuthSlice, useSelectorChatSlice } from "@/hook";
import { IMessage } from "@/types/chat.type";
import { IUser } from "@/types/user.type";
import { cn, momentVi } from "@/utils";
import { forwardRef, useEffect, useState } from "react";
import MessageOfSend from "./chat_Message_Type/MessageOfSend";
import MessageOfReceive from "./chat_Message_Type/MessageOfReceive";
import { TMessageTypeBorder } from "./chat_View_Messages/DisplayMessages";
import { LazyLoadImage } from "react-lazy-load-image-component";

export type TPropsMessage = {
  message: IMessage<IUser>;
  receiverInfo: IUser;
  displayAvatar: boolean;
  displayTimeSend: boolean;
  displayReceiverSeen: boolean;
  displayDateMessage: boolean;
  checkMessageTypeBorder: TMessageTypeBorder;
};

const Message = forwardRef<HTMLDivElement, TPropsMessage>((props, ref) => {
  const { user } = useSelectorAuthSlice();

  const { message, displayTimeSend, displayReceiverSeen, displayDateMessage } =
    props;

  const { receiverInfo } = useSelectorChatSlice();

  const [timeSender, setTimeSender] = useState<string>(
    momentVi(message.createdAt).fromNow() === "vài giây trước"
      ? ""
      : momentVi(message.createdAt).fromNow()
  );

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
    <div ref={ref} className="w-full Message">
      {displayDateMessage && (
        <div className="flex justify-center items-center w-full py-3 text-[10px] font-medium">
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
      {displayReceiverSeen && (
        <div className={cn("float-right w-4 h-4 transition-all mt-1")}>
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
      )}
      {displayTimeSend && !displayReceiverSeen && (
        <div className="pt-1 text-[10px] font-semibold text-gray text-end">
          Đã gửi {timeSender}
        </div>
      )}
    </div>
  );
});

export default Message;
