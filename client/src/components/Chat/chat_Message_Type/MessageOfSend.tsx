import { cn, momentVi } from "@/utils";
import { TPropsMessage } from "../Message";
import { LazyLoadImage } from "react-lazy-load-image-component";

export default function MessageOfSend(props: TPropsMessage) {
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
}
