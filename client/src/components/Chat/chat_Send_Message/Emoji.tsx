import Tooltip from "@/components/tooltip";
import { categoriesConfigEmoji } from "@/constant/chat.constant";
import { useClickOutSide } from "@/hook";
import { cn } from "@/utils";
import EmojiPicker from "emoji-picker-react";
import IconEmoji from "../../icon/IconEmoji";
import { TInsertEmoji } from "./ChatInput";
import { emojiStyle } from "@/constant/common";

type TProps = {
  insert: ({ emoji, url }: TInsertEmoji) => void;
};
function Emoji({ insert }: TProps) {
  const {
    show: openEmojiPicker,
    handleShow: handleOpenEmojiPicker,
    nodeRef,
  } = useClickOutSide<HTMLDivElement>();

  return (
    <div ref={nodeRef} className="absolute right-0 bottom-0">
      <Tooltip
        place="top"
        className={{
          content:
            "z-40 text-[10px] whitespace-nowrap bg-black bg-opacity-80 text-white ",
        }}
        onClick={handleOpenEmojiPicker}
        content={<p className="whitespace-nowrap">Chọn biểu tượng</p>}
      >
        <div
          className={cn(
            "text-orange cursor-pointer w-9 h-9 rounded-full flex justify-center items-center group"
          )}
        >
          <IconEmoji size={16} />
          <span className="absolute invisible z-20 w-9 h-9 transition-all -translate-x-1/2 -translate-y-1/2 rounded-full bg-opacity-30 left-1/2 top-1/2 bg-orange group-hover:visible"></span>
        </div>
      </Tooltip>
      <div
        className={cn(
          "emojiPicker shadow-shadow_5 w-auto absolute -top-4 -translate-y-full -right-5 z-30 rounded-xl"
        )}
      >
        <div
          className={cn(
            "relative w-full",
            openEmojiPicker &&
              "before:absolute before:z-40 before:hoverDropdown before:-bottom-7 before:right-6 before:border-l-transparent before:border-r-transparent before:border-b-transparent before:border-[15px] before:border-t-white"
          )}
        >
          <EmojiPicker
            open={openEmojiPicker}
            width={250}
            height={250}
            searchPlaceHolder="Tìm kiếm biểu tượng cảm xúc"
            className="pb-3"
            onEmojiClick={(data) => {
              insert({
                emoji: data.emoji,
                url: data.imageUrl,
              });
            }}
            emojiStyle={emojiStyle}
            lazyLoadEmojis={true}
            skinTonesDisabled={true}
            searchDisabled
            previewConfig={{ showPreview: false }}
            categories={categoriesConfigEmoji}
          />
        </div>
      </div>
    </div>
  );
}

export default Emoji;
