import { checkImageUrl, cn } from "@/utils";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import Emoji from "./Emoji";
import { useSelectorChatSlice } from "@/hook";
import { emojiStyle } from "@/constant/common";

type TChatInput = {
  text: string;
  handleSendMessage: () => Promise<void>;
  onChange: (value: string) => void;
};

export type TInsertEmoji = { emoji: string; url: string };

function ChatInput({ text, handleSendMessage, onChange }: TChatInput) {
  const { selectedConversation } = useSelectorChatSlice();

  const inputRef = useRef<HTMLDivElement>(null);

  const rangeRef = useRef<Range | null>(null);

  const [isEmpty, setIsEmpty] = useState(true);

  const createNodeEmoji = (url: string, alt: string) => {
    const emojiImg = document.createElement("img");
    emojiImg.className =
      "inline-block object-cover mx-[1px] align-middle max-w-4 max-h-4";
    emojiImg.alt = alt || "";
    emojiImg.src = url;
    emojiImg.width = 16;
    emojiImg.height = 16;
    return emojiImg;
  };

  const insertEmojiAtCursor = ({ emoji, url }: TInsertEmoji) => {
    const selection = window.getSelection();
    if (!selection || !inputRef.current) return;
    if (selection.rangeCount > 0) {
      const range = rangeRef.current || selection.getRangeAt(0);
      range.deleteContents();

      const emojiImg = document.createElement("img");
      emojiImg.className =
        "inline-block object-cover mx-[1px] align-middle max-w-4 max-h-4";
      emojiImg.alt = emoji;
      emojiImg.src = url;
      emojiImg.width = 16;
      emojiImg.height = 16;

      range.insertNode(emojiImg);
      range.setStartAfter(emojiImg);
      range.collapse(true);
      selection.removeAllRanges();
      selection.addRange(range);
      setIsEmpty(false);
      inputRef.current.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (!inputRef.current) return;
    const clipboardData = e.clipboardData.getData("text/html"); // Lấy text thô

    const parser = new DOMParser();
    const doc = parser.parseFromString(clipboardData, "text/html");

    const nodes = doc.body.childNodes;

    const fragment = document.createElement("div");

    nodes.forEach(async (node) => {
      if (node.nodeType === Node.TEXT_NODE && node.textContent?.trim()) {
        fragment.appendChild(document.createTextNode(node.textContent));
      }
      if (node.nodeType === Node.ELEMENT_NODE) {
        if (
          (node as HTMLElement).tagName === "IMG" &&
          (node as HTMLImageElement).src.includes("emoji")
        ) {
          const nameEmoji =
            (node as HTMLImageElement).src.split("/").pop() || "";
          const urlEmoji = `https://cdn.jsdelivr.net/npm/emoji-datasource-${emojiStyle}/img/${emojiStyle}/64/${nameEmoji}`;

          const isValidUrl = await checkImageUrl(urlEmoji);
          if (isValidUrl) {
            const emojiImg = createNodeEmoji(
              urlEmoji,
              (node as HTMLImageElement).alt
            );

            fragment.appendChild(emojiImg);
          }
        } else {
          fragment.appendChild(document.createTextNode(node.textContent || ""));
        }
      }
    });
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      range.deleteContents();
      const htmlToInsert = fragment.innerHTML;
      document.execCommand("insertHTML", false, htmlToInsert);
      // range.insertNode(fragment);
      // if (fragment.lastChild) {
      //   range.setStartAfter(fragment.lastChild);
      //   range.setEndAfter(fragment.lastChild);
      // }
      // range.collapse(false);
      // selection.removeAllRanges();
      // selection.addRange(range);
      setIsEmpty(false);
      setTimeout(() => {
        if (!inputRef.current) return;
        onChange(inputRef.current.innerHTML.trim());
      }, 0);
      inputRef.current.focus();
    }
  };

  const cleanEmptyDiv = () => {
    if (!inputRef.current) return;

    if (inputRef.current.childNodes.length === 1) {
      const children = inputRef.current.firstChild;
      if ((children as HTMLElement).tagName === "BR") {
        inputRef.current.innerHTML = "";
        setIsEmpty(true);
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (!inputRef.current) return;
    if (e.key === "Enter" && inputRef.current.innerText.trim()) {
      e.preventDefault();
      handleSendMessage();
      inputRef.current.innerText = "";
      setIsEmpty(true);
    }
  };

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const saveRange = () => {
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
      rangeRef.current = selection.getRangeAt(0).cloneRange(); // Lưu range
    }
  };

  const handleInput = () => {
    if (!inputRef.current) return;
    const currentContent = inputRef.current.innerHTML.trim();
    if (!currentContent) {
      inputRef.current.innerText = "";
      setIsEmpty(true);
    } else {
      setIsEmpty(false);
    }
    cleanEmptyDiv();
    saveRange();
    onChange(inputRef.current.innerHTML.trim());
  };

  useLayoutEffect(() => {
    const input = inputRef.current;
    if (input) {
      input.focus();
      input.innerText = "";
      setIsEmpty(true);
    }
  }, [selectedConversation]);

  useEffect(() => {
    const input = inputRef.current;
    if (input) {
      input.scrollTo({ top: input.scrollHeight, behavior: "smooth" });
    }
  }, [text]);

  return (
    <div
      className={
        "relative w-[90%] justify-center items-center rounded-xl flex bg-grayE5 p-2 border-1 border-orange gap-x-2 transition-all"
      }
    >
      <div
        ref={inputRef}
        contentEditable
        onInput={handleInput}
        onKeyDown={handleKeyDown}
        onPaste={handlePaste}
        onDragStart={handleDragStart}
        onClick={() => {
          saveRange();
        }}
        className={cn(
          "w-full text-[15px] leading-5 overflow-auto border-none outline-none  max-h-24 "
        )}
      />
      {isEmpty && (
        <div className="absolute text-[15px] -translate-y-1/2 pointer-events-none left-2 top-1/2 text-gray98">
          Nhập nội dung tin nhắn...
        </div>
      )}
      <Emoji insert={insertEmojiAtCursor} />
    </div>
  );
}

export default ChatInput;
