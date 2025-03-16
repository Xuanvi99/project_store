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
    <div ref={nodeRef} className="absolute bottom-0 right-0">
      <Tooltip
        place="top"
        className={{
          content:
            "z-50 text-[10px] whitespace-nowrap bg-black bg-opacity-80 text-white ",
        }}
        onClick={handleOpenEmojiPicker}
        content={<p className="whitespace-nowrap">Chọn biểu tượng</p>}
      >
        <div
          className={cn(
            "relative text-orange cursor-pointer w-9 h-9 rounded-full flex justify-center items-center group",
            "before:absolute before:w-9 before:h-9 before:-translate-x-1/2 before:-translate-y-1/2 before:rounded-full before:bg-opacity-30 before:left-1/2 before:top-1/2 before:bg-orange before:opacity-0 hover:before:opacity-100"
          )}
        >
          <IconEmoji size={16} />
        </div>
      </Tooltip>
      <div
        className={cn(
          "emojiPicker shadow-shadow_5 w-auto absolute -top-4 -translate-y-full -right-5 z-20 rounded-xl"
        )}
      >
        <div
          className={cn(
            "relative w-full",
            openEmojiPicker &&
              "before:absolute before:hoverDropdown before:-bottom-7 before:right-6 before:border-l-transparent before:border-r-transparent before:border-b-transparent before:border-[15px] before:border-t-white"
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
