import { cn, momentVi } from "@/utils";
import useChatContext from "../context/useChatContext";
import { IImage } from "@/types/commonType";
import { TMessageTypeBorder } from "./DisplayMessages";
import { LoadingCallApi } from "../../loading/index";
import { marked } from "marked";

function DisplayPreviewMessages() {
  const { previewMessages, messages } = useChatContext();

  const ImagesWithCSSGrid = (imagesCount: number) => {
    switch (true) {
      case imagesCount === 1:
        return "grid-cols-1";

      case imagesCount === 2:
      case imagesCount === 4:
        return "grid-cols-2";

      case imagesCount > 2:
        return "grid-cols-3";

      default:
        return "";
    }
  };

  const ImageItemWithStyleCSS = (
    imagesCount: number,
    image: Pick<IImage, "url" | "width" | "height">
  ) => {
    if (imagesCount === 0) return;
    if (imagesCount === 1) {
      if (image.height > image.width) {
        const newWidth = Math.floor((image.width * 350) / image.height);
        return {
          height: image.height,
          maxHeight: "350px",
          width: newWidth + "px",
        };
      } else {
        return {
          width: image.width,
          maxHeight: "350px",
          aspectRatio: "16/9",
        };
      }
    }
    return { width: image.width, aspectRatio: "1/1" };
  };

  const typeBorder = (type: TMessageTypeBorder) => {
    switch (type) {
      case "start":
        return "rounded-s-2xl rounded-se-2xl rounded-ee ";

      case "mid":
        return "rounded-s-2xl rounded-e";

      case "end":
        return "rounded-s-2xl rounded-se rounded-ee-2xl ";

      default:
        return "rounded-2xl ";
    }
  };

  const checkMessageTypeBorder = (index: number): TMessageTypeBorder => {
    if (messages.length === 0) return "basis";
    const timeCur = previewMessages[0].createdAt;
    const messageReal = messages[messages.length - 1];
    const timePre = messageReal.createdAt;
    const messagePreId = previewMessages[0].senderId;
    const messageCurId = messageReal.senderId._id;

    if (index === previewMessages.length - 1) {
      if (
        messageReal.senderId._id === previewMessages[index].senderId &&
        momentVi(timeCur).isSame(timePre, "day")
      ) {
        return "end";
      }
      return "basis";
    } else {
      const timeNext = previewMessages[index + 1].createdAt;
      const messageNextId = previewMessages[index + 1].senderId;
      const checkDayPre = momentVi(timeCur).isSame(timePre, "day");
      const checkDayNext = momentVi(timeCur).isSame(timeNext, "day");
      if (checkDayPre && checkDayNext) {
        if (messageCurId === messagePreId && messageCurId === messageNextId) {
          return "mid";
        } else if (
          messageCurId !== messagePreId &&
          messageCurId === messageNextId
        ) {
          return "start";
        } else if (
          messageCurId === messagePreId &&
          messageCurId !== messageNextId
        ) {
          return "end";
        } else {
          return "basis";
        }
      } else if (!checkDayPre && checkDayNext) {
        return "start";
      } else if (checkDayPre && !checkDayNext) {
        return "end";
      } else {
        return "basis";
      }
    }
  };

  const displayDateMessage = (index: number): boolean => {
    if (messages.length === 0) return true;
    if (index === 0) {
      const time1 = messages[messages.length - 1].createdAt;
      const time2 = previewMessages[0].createdAt;
      return momentVi(time1).isSame(time2, "day") ? false : true;
    }
    return false;
  };

  return (
    <div className="flex flex-col mt-1 gap-y-1">
      {previewMessages.length > 0 &&
        previewMessages.map((message, index) => {
          return (
            <div key={index} className="w-full preview_message">
              {displayDateMessage(index) && (
                <div className="flex justify-center items-center w-full py-3 text-[10px] font-medium">
                  <span className="px-2 py-1 font-semibold rounded-lg shadow-sm shadow-grayDark bg-grayCa text-gray">
                    {momentVi(message.createdAt).format("ddd, ll")}
                  </span>
                </div>
              )}
              <div className={"message flex flex-col w-full items-end"}>
                <div
                  className={cn(
                    "relative min-w-[60px] max-w-[70%] bg-orange cursor-text text-[14px] flex text-white transition-all",
                    typeBorder(checkMessageTypeBorder(index)),
                    message.messageType === "image" &&
                      "overflow-hidden h-fit bg-transparent cursor-pointer max-w-[55%]"
                  )}
                >
                  <div className="Message_Content">
                    {message.messageType === "text" && (
                      <span
                        className="p-2 pb-3 text-start"
                        dangerouslySetInnerHTML={{
                          __html: marked.parse(message.text || ""),
                        }}
                      ></span>
                    )}
                    {message.messageType === "image" &&
                      message.images &&
                      message.images.length > 0 && (
                        <div
                          className={cn(
                            "Images_Group grid gap-1 w-full",
                            ImagesWithCSSGrid(message.images.length)
                          )}
                        >
                          {message.images.map((image, index) => {
                            return (
                              <div
                                key={index}
                                className={cn(
                                  "ImageItem relative h-full max-w-full"
                                )}
                                style={ImageItemWithStyleCSS(
                                  message.images?.length || 0,
                                  image
                                )}
                              >
                                <img
                                  key={index}
                                  alt="preview"
                                  srcSet={image.url}
                                  className={cn(
                                    "object-cover rounded-md",
                                    message.images?.length === 1 &&
                                      "max-h-[350px]",
                                    message.images?.length === 1 &&
                                      image.height <= image.width &&
                                      "aspect-video",
                                    message.images &&
                                      message.images.length >= 2 &&
                                      "aspect-square max-h-full"
                                  )}
                                />
                              </div>
                            );
                          })}
                        </div>
                      )}
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
              {index === previewMessages.length - 1 && (
                <div className="float-right w-4 h-4">
                  <LoadingCallApi />
                </div>
              )}
            </div>
          );
        })}
    </div>
  );
}

export default DisplayPreviewMessages;
