import { cn, momentVi } from "@/utils";
import Tooltip from "@/components/tooltip";
import { useSelectorAuthSlice } from "@/hook";
import { Fragment, useState } from "react";

type TProps = {
  emojis: Array<{ url: string; alt: string }>;
  messageType: string;
  className: string;
  createdAt: Date;
  senderId: string;
  children?: React.ReactNode;
};
function MessageEmoji({
  emojis,
  messageType,
  className,
  createdAt,
  senderId,
  children,
}: TProps) {
  const { user } = useSelectorAuthSlice();

  const [openInfoMessage, setOpenInfoMessage] = useState<boolean>(false);

  if (messageType !== "emoji" || !emojis || emojis.length === 0) return;
  return (
    <Fragment>
      {openInfoMessage && (
        <div
          className={cn(
            "flex justify-center w-full text-xs transition-all pt-2"
          )}
        >
          {momentVi(createdAt).format(
            momentVi(createdAt).isSame(new Date(Date.now()), "day")
              ? "HH:mm"
              : "HH:mm, l"
          )}
        </div>
      )}
      <Tooltip
        place={senderId === user?._id ? "left" : "right"}
        className={{
          content: cn(
            "z-30 text-[10px] whitespace-nowrap font-semibold bg-black bg-opacity-80 text-white shadow-shadow1",
            senderId === user?._id ? "right-full" : "left-full"
          ),
          arrow: "hidden",
          container: cn(
            "max-w-[70%] w-fit cursor-default transition-all",
            className
          ),
        }}
        onClick={() => {
          setOpenInfoMessage(!openInfoMessage);
        }}
        content={
          <p className="whitespace-nowrap">
            {momentVi(createdAt).format(
              momentVi(createdAt).isSame(new Date(Date.now()), "day")
                ? "HH:mm"
                : "HH:mm, l"
            )}
          </p>
        }
      >
        <span className="flex items-center text-start gap-x-1">
          {emojis.map(({ url, alt }, index) => (
            <img key={index} srcSet={url} alt={alt} className="w-8 h-8" />
          ))}
        </span>
      </Tooltip>
      {openInfoMessage && <>{children}</>}
    </Fragment>
  );
}

export default MessageEmoji;
