import { useSelectorChatSlice } from "@/hook";
import { cn } from "@/utils";
import { LazyLoadImage } from "react-lazy-load-image-component";

function DisplayTyping({ isDisplayTyping }: { isDisplayTyping: boolean }) {
  const { receiverInfo } = useSelectorChatSlice();

  if (!isDisplayTyping || !receiverInfo) return;

  return (
    <div className="flex items-center justify-start w-full mt-1 message gap-x-2">
      <div className={cn("flex flex-col justify-center h-full")}>
        <span className="overflow-hidden rounded-full w-7 h-7">
          <LazyLoadImage
            alt="image_avatar"
            placeholderSrc={"/public/userName.png"}
            srcSet={receiverInfo.avatar?.url || receiverInfo?.avatarDefault}
            effect="blur"
            className="object-cover max-w-full "
            height={28}
            width={28}
            threshold={100}
          />
        </span>
      </div>
      <div
        className={cn(
          "typing-chat relative max-w-[70%] bg-grayE5 rounded-lg flex justify-center items-center gap-x-1 px-2 py-3"
        )}
      >
        <span className="typing__item"></span>
        <span className="typing__item"></span>
        <span className="typing__item"></span>
      </div>
    </div>
  );
}

export default DisplayTyping;
