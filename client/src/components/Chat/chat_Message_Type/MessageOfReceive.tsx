import { LazyLoadImage } from "react-lazy-load-image-component";
import { TPropsMessage } from "../Message";
import { cn, momentVi } from "@/utils";

export default function MessageOfReceive(props: TPropsMessage) {
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
}
