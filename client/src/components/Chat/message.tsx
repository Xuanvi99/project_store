import { useAppSelector } from "@/hook";
import { useGetProfileQuery } from "@/stores/service/user.service";
import { IMessage } from "@/types/chat.type";
import { IUser } from "@/types/user.type";
import { cn, momentVi } from "@/utils";
import { forwardRef, useLayoutEffect, useState } from "react";

type TProps = {
  message: IMessage;
  displayAvatar: boolean;
  displayTimeSend: boolean;
};

const Message = forwardRef<HTMLDivElement, TProps>((props, ref) => {
  const { user } = useAppSelector((state) => state.authSlice);

  const { message, displayTimeSend } = props;

  const [timeSender, setTimeSender] = useState<string>("");

  useLayoutEffect(() => {
    let timeRefetchSender = undefined;
    if (displayTimeSend && message) {
      timeRefetchSender = setInterval(() => {
        setTimeSender(momentVi(message.createdAt).fromNow());
      }, 1000);
    }
    return () => clearInterval(timeRefetchSender);
  }, [displayTimeSend, message]);

  return (
    <div ref={ref} className="w-full p-1 message">
      {message.senderId === user?._id ? (
        <MessageOfSender {...props} />
      ) : (
        <MessageOfReceiver {...props} />
      )}
      {displayTimeSend && (
        <div className="pt-1 pr-2 text-xs text-gray text-end">
          Đã gửi{" "}
          {timeSender ? timeSender : momentVi(message.createdAt).fromNow()}
        </div>
      )}
    </div>
  );
});

const MessageOfSender = (props: TProps) => {
  const { message } = props;

  return (
    <div className={"message flex flex-col w-full items-end"}>
      <div
        className={cn(
          "relative min-w-[10%] max-w-[70%] bg-orangeFe p-2 text-[14px] rounded-lg flex flex-col text-white",
          "before:w-0 before:h-0 before:border-b-[20px] before:border-b-transparent before:border-l-[20px] before:border-l-orangeFe",
          "before:absolute before:-right-[7px] before:top-0 before:z-20"
        )}
      >
        <span className="text-start">{message.text}</span>{" "}
        <span className="text-[10px] text-grayF5 text-end">
          {momentVi(message.createdAt).format("HH:mm")}
        </span>
      </div>
    </div>
  );
};

const MessageOfReceiver = (props: TProps) => {
  const { message, displayAvatar } = props;

  const { data, status } = useGetProfileQuery(message.senderId);

  const [receiver, setReceiver] = useState<IUser>();

  useLayoutEffect(() => {
    if (data && status === "fulfilled") {
      setReceiver(data.user);
    }
  }, [data, status]);

  return (
    <div className="flex items-end justify-start w-full message gap-x-2">
      <div
        className={cn(
          "flex flex-col justify-end h-full invisible",
          displayAvatar && "visible"
        )}
      >
        <span className="overflow-hidden rounded-full w-7 h-7">
          <img
            alt="error"
            srcSet={receiver?.avatar?.url || receiver?.avatarDefault}
            className="object-cover"
          />
        </span>
      </div>
      <div
        className={cn(
          "min-w-[10%] max-w-[70%] bg-grayE5 text-black p-2 text-[14px] rounded-lg flex flex-col "
        )}
      >
        <span className="text-start">{message.text}</span>
        <span className="text-[10px] text-end text-gray">
          {momentVi(message.createdAt).format("HH:mm")}
        </span>
      </div>
    </div>
  );
};

export default Message;
