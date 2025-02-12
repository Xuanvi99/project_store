import { IReqSendMessageText } from "@/types/chat.type";
import { cn, momentVi } from "@/utils";

function DisplayWaitMessages({
  waitMessages,
}: {
  waitMessages: IReqSendMessageText[];
}) {
  return (
    <div className="flex flex-col mt-1 gap-y-1">
      {waitMessages.length > 0 &&
        waitMessages.map((message, index) => {
          return (
            <div key={index} className="w-full p-1 message">
              <div className={"message flex flex-col w-full items-end gap-y-1"}>
                <div
                  className={cn(
                    "relative min-w-[75px] max-w-[70%] bg-orange cursor-text px-2 pt-2 pb-1 text-[14px] rounded-lg flex flex-col text-white"
                  )}
                >
                  <span className="text-start">{message.text}</span>{" "}
                  <span className="text-[10px] text-grayF5 text-end">
                    {momentVi(Date.now()).format("HH:mm")}
                  </span>
                </div>
              </div>
              <div className="pt-1 pr-2 text-xs text-gray text-end">{""}</div>
            </div>
          );
        })}
    </div>
  );
}

export default DisplayWaitMessages;
