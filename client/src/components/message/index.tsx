import { cn } from "@/utils";

type TProps = {
  messageByUser: boolean;
};

function Message({ messageByUser }: TProps) {
  const selectMessageComponent = (messageByUser: boolean) => {
    if (messageByUser) {
      return (
        <div className={"message_sender flex w-full justify-end"}>
          <div
            className={cn(
              "max-w-[70%] min-w-[20%] bg-message px-[10px] py-1 text-[14px] rounded-lg flex flex-col relative",
              "before:w-0 before:h-0 before:border-b-[20px] before:border-b-transparent before:border-l-[20px] before:border-l-message",
              "before:absolute before:-right-[10px] before:top-0 before:z-20"
            )}
          >
            <span className="text-start">CSS</span>
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
      <div className="message_receiver flex w-full justify-start gap-x-2">
        <div className=" flex flex-col justify-end h-full">
          <span className="w-7 h-7 rounded-full">
            <img alt="" srcSet="/logo.png" className="object-cover" />
          </span>
        </div>
        <div
          className={cn(
            "max-w-[70%] min-w-[20%] bg-white text-black px-[10px] py-1 text-[14px] rounded-lg flex flex-col relative"
          )}
        >
          <span className="text-start">
            Volatile events are events that will not be sent if the underlying
            connection is not ready (a bit like UDP, in terms of reliability).
          </span>
          <span className="text-[10px] text-end text-gray">7:00</span>
        </div>
      </div>
    );
  };

  return (
    <div className="message flex w-full p-1">
      {selectMessageComponent(messageByUser)}
    </div>
  );
}

export default Message;
