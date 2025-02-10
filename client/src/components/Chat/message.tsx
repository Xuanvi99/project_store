import { useSelectorAuthSlice } from "@/hook";
import { IMessage } from "@/types/chat.type";
import { IUser } from "@/types/user.type";
import { cn, momentVi } from "@/utils";
import { forwardRef, useEffect, useState } from "react";
import { LazyLoadImage } from "react-lazy-load-image-component";

type TProps = {
  message: IMessage<IUser>;
  receiverInfo: IUser;
  displayAvatar: boolean;
  displayTimeSend: boolean;
  displayReceiverSeen: boolean;
  displayDateMessage: boolean;
};
const MessageOfSend = (props: TProps) => {
  const { message, displayReceiverSeen } = props;

  const { receiverId: receiver } = message;

  return (
    <div className={"message flex flex-col w-full items-end gap-y-1"}>
      <div
        className={cn(
          "relative min-w-[75px] max-w-[70%] bg-orange cursor-text px-2 pt-2 pb-1 text-[14px] rounded-lg flex flex-col text-white"
        )}
      >
        <span className="text-start">{message.text}</span>{" "}
        <span className="text-[10px] text-grayF5 text-end">
          {momentVi(message.createdAt).format("HH:mm")}
        </span>
      </div>
      {/*display receiver seen */}
      <div
        className={cn(
          "float-right w-4 h-4  transition-all",
          displayReceiverSeen ? "opacity-1" : " hidden opacity-0"
        )}
      >
        <LazyLoadImage
          alt="image_avatar"
          placeholderSrc={"/public/userName.png"}
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
};

const MessageOfReceive = (props: TProps) => {
  const { message, displayAvatar, displayReceiverSeen, receiverInfo } = props;

  return (
    <div className="flex flex-col">
      <div className="flex items-end justify-start w-full message gap-x-2">
        <div
          className={cn(
            "flex flex-col justify-end h-full invisible",
            displayAvatar && "visible"
          )}
        >
          <span className="overflow-hidden rounded-full w-7 h-7">
            <LazyLoadImage
              alt="image"
              placeholderSrc={"/public/userName.png"}
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
          className={cn(
            "min-w-[75px] max-w-[70%] bg-grayE5 text-black px-2 pt-2 pb-1 text-[14px] cursor-text rounded-lg flex flex-col "
          )}
        >
          <span className="text-start">{message.text}</span>
          <span className="text-[10px] text-end text-gray">
            {momentVi(message.createdAt).format("HH:mm")}
          </span>
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
          placeholderSrc={"/public/userName.png"}
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
};

const Message = forwardRef<HTMLDivElement, TProps>((props, ref) => {
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
