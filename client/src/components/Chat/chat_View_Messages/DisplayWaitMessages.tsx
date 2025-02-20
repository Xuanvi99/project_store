import { IReqSendMessage } from "@/types/chat.type";
import { cn, momentVi } from "@/utils";

type TProps = {
  waitMessages: IReqSendMessage[];
};

function DisplayWaitMessages({ waitMessages }: TProps) {
  return (
    <div className="flex flex-col mt-1 gap-y-1">
      {waitMessages.length > 0 &&
        waitMessages.map((message, index) => {
          return (
            <div key={index} className="w-full message">
              <div className={"message flex flex-col w-full items-end"}>
                <div
                  className={cn(
                    "relative min-w-[80px] max-w-[70%] bg-orange rounded-lg",
                    message.messageType === "text" &&
                      "px-2 pt-2 pb-1 cursor-text text-[14px] flex flex-col text-white",
                    message.messageType === "image" &&
                      "border-2 border-orange overflow-hidden flex flex-wrap gap-1 rounded-2xl max-w-[60%]"
                  )}
                >
                  <div className="Message_Content">
                    {message.messageType === "text" && (
                      <span className="text-start">{message.text}</span>
                    )}
                    {/* {message.messageType === "image" &&
                      message.images &&
                      images?.length > 0 && (
                        <ColumnsPhotoAlbum photos={images} columns={2} />
                      )} */}
                  </div>
                  <div
                    className={cn(
                      "text-xs text-grayF5 text-end font-semibold",
                      message.messageType === "image" &&
                        "absolute bottom-1 right-3 bg-opacity-50 bg-black px-1 rounded-md"
                    )}
                  >
                    {momentVi(Date.now()).format("HH:mm")}
                  </div>
                </div>
              </div>
              {index === waitMessages.length - 1 && (
                <div className="py-1 pr-2 text-xs text-gray text-end">{""}</div>
              )}
            </div>
          );
        })}
    </div>
  );
}

export default DisplayWaitMessages;
