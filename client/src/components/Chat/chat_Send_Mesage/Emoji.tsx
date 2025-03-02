import Tooltip from "@/components/tooltip";
import { categoriesConfigEmoji } from "@/constant/chat.constant";
import { useClickOutSide } from "@/hook";
import { cn } from "@/utils";
import EmojiPicker from "emoji-picker-react";
import IconEmoji from "./../../icon/IconEmoji";
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
    <div ref={nodeRef} className="relative">
      <Tooltip
        place="top-end"
        className={{
          content:
            "z-40 text-xs whitespace-nowrap bg-black bg-opacity-80 text-white ",
        }}
        onClick={handleOpenEmojiPicker}
        title={<p className="whitespace-nowrap">Chọn biểu tượng cảm xúc</p>}
      >
        <div
          className={cn(
            "text-orange cursor-pointer",
            openEmojiPicker &&
              "before:absolute before:z-50 before:hoverDropdown before:bottom-[10px] before:left-1/2 before:-translate-x-1/2 before:border-l-transparent before:border-r-transparent before:border-b-transparent before:border-[15px] before:border-t-white"
          )}
        >
          <IconEmoji size={20} />
        </div>
      </Tooltip>
      <div
        className={cn(
          "emojiPicker shadow-shadow2 w-auto absolute -top-4 -translate-y-full -right-10 z-40 overflow-hidden rounded-xl"
        )}
      >
        <EmojiPicker
          open={openEmojiPicker}
          width={300}
          height={350}
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
  );
}

export default Emoji;
