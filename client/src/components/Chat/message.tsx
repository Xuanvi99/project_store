import { cn } from "@/utils";
import { forwardRef } from "react";

type TProps = {
  message: {
    id: string;
    senderId: string;
    receiverId: string;
    messageType: string;
    text: string;
  };
  displayAvatar: boolean;
};

const selectMessageComponent = (props: TProps) => {
  const { message, displayAvatar } = props;
  if (message.senderId === "me") {
    return (
      <div className={"message flex w-full justify-end"}>
        <div
          className={cn(
            "max-w-[70%] min-w-[20%] bg-orangeFe px-[10px] py-1 text-[14px] rounded-lg flex flex-col relative text-white",
            "before:w-0 before:h-0 before:border-b-[20px] before:border-b-transparent before:border-l-[20px] before:border-l-orangeFe",
            "before:absolute before:-right-[10px] before:top-0 before:z-20"
          )}
        >
          <span className="text-start">{message.text}</span>
          <span className="text-[10px] text-end text-gray">7:00</span>
        </div>
        {/* <div
        className="image"
        style={{ backgroundImage: "url(" ")" }}
      /> */}
      </div>
    );
  }

  return (
    <div className="flex justify-start w-full message gap-x-2">
      <div
        className={cn(
          "flex flex-col justify-end h-full invisible",
          displayAvatar && "visible"
        )}
      >
        <span className="rounded-full w-7 h-7">
          <img alt="" srcSet="/logo.png" className="object-cover" />
        </span>
      </div>

      <div
        className={cn(
          "max-w-[70%] min-w-[20%] bg-white text-black px-[10px] py-1 text-[14px] rounded-lg flex flex-col relative"
        )}
      >
        <span className="text-start">{message.text}</span>
        <span className="text-[10px] text-end text-gray">7:00</span>
      </div>
    </div>
  );
};

const Message = forwardRef<HTMLDivElement, TProps>((props, ref) => {
  return (
    <div ref={ref} className="flex w-full p-1 message">
      {selectMessageComponent(props)}
    </div>
  );
});

export default Message;
