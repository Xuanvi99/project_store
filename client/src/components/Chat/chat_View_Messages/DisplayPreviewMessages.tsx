import { cn, momentVi } from "@/utils";
import useChatContext from "../context/useChatContext";
import { IImage } from "@/types/commonType";
import { TMessageTypeBorder } from "./DisplayMessages";

function DisplayPreviewMessages() {
  const { previewMessages } = useChatContext();
  console.log("previewMessages: ", previewMessages);

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
    console.log(imagesCount);
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
    console.log("index: ", index);
    return "basis";
  };

  return (
    <div className="flex flex-col mt-1 gap-y-1">
      {previewMessages.length > 0 &&
        previewMessages.map((message, index) => {
          return (
            <div key={index} className="w-full message">
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
                      <span className="text-start">{message.text}</span>
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
                                  className="object-cover w-full h-full"
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
                <div className="py-1 pr-2 text-xs text-gray text-end">{""}</div>
              )}
            </div>
          );
        })}
    </div>
  );
}

export default DisplayPreviewMessages;
