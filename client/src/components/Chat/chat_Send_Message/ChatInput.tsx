import { checkImageUrl, cn } from "@/utils";
import { useLayoutEffect, useRef, useState } from "react";
import Emoji from "./Emoji";
import { useSelectorChatSlice } from "@/hook";
import { emojiStyle } from "@/constant/common";
import { debounce } from "lodash";
import { TMessageEmojis } from "../chatSendMessage";

type TChatInput = {
  text: string;
  handleSendMessage: () => Promise<void>;
  onChange: (value: string) => void;
  onchangeEmojis: (value: TMessageEmojis) => void;
};

export type TInsertEmoji = { emoji: string; url: string };

function ChatInput({
  text,
  handleSendMessage,
  onChange,
  onchangeEmojis,
}: TChatInput) {
  const { selectedConversation } = useSelectorChatSlice();

  const inputRef = useRef<HTMLDivElement>(null);

  const rangeRef = useRef<Range | null>(null);

  const [isEmpty, setIsEmpty] = useState(true);

  const [history, setHistory] = useState<string[]>([""]);
  const [historyIndex, setHistoryIndex] = useState<number>(0);

  const createNodeEmoji = (url: string, alt: string) => {
    const emojiImg = document.createElement("img");
    emojiImg.className =
      "emoji inline-block object-cover mx-[1px] align-middle max-w-4 max-h-4";
    emojiImg.alt = alt || "";
    emojiImg.src = url;
    emojiImg.width = 16;
    emojiImg.height = 16;
    return emojiImg;
  };

  const saveHistory = (newContent: string) => {
    // Cắt bỏ các trạng thái sau historyIndex nếu có
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(newContent);
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  };

  const undo = () => {
    if (historyIndex > 0 && inputRef.current) {
      setHistoryIndex((prev) => prev - 1);
      inputRef.current.innerHTML = history[historyIndex - 1];
      setIsEmpty(!history[historyIndex - 1].trim());
      onChange(history[historyIndex - 1].trim());
    }
  };

  const redo = () => {
    if (historyIndex < history.length - 1 && inputRef.current) {
      setHistoryIndex((prev) => prev + 1);
      inputRef.current.innerHTML = history[historyIndex + 1];
      setIsEmpty(!history[historyIndex + 1].trim());
      onChange(history[historyIndex + 1].trim());
    }
  };

  const resetHistory = () => {
    setHistory([""]);
    setHistoryIndex(0);
  };

  const setMessageEmojis = () => {
    if (!inputRef.current) return;
    const emojis = inputRef.current.getElementsByTagName("img");
    const value: TMessageEmojis = [];
    for (let i = 0; i < emojis.length; i++) {
      value.push({ url: emojis[i].src, alt: `${emojis[i].alt}` });
    }
    if (emojis.length > 0) {
      onchangeEmojis(value);
    }
  };

  const insertEmojiAtCursor = ({ emoji, url }: TInsertEmoji) => {
    const selection = window.getSelection();
    if (!selection || !inputRef.current) return;
    if (selection.rangeCount > 0) {
      const range = rangeRef.current || selection.getRangeAt(0);
      range.deleteContents();

      const emojiImg = createNodeEmoji(url, emoji);

      range.insertNode(emojiImg);
      range.setStartAfter(emojiImg);
      range.collapse(true);
      selection.removeAllRanges();
      selection.addRange(range);
      setIsEmpty(false);
      saveHistory(inputRef.current.innerHTML);
      inputRef.current.focus();
      onChange(inputRef.current.innerHTML.trim());
      setMessageEmojis();
    }
  };

  const handlePaste = async (e: React.ClipboardEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (!inputRef.current) return;
    const clipboardData = e.clipboardData.getData("text/html"); // Lấy text thô

    const parser = new DOMParser();
    const doc = parser.parseFromString(clipboardData, "text/html");

    const nodes = doc.body.childNodes;

    const fragment = document.createDocumentFragment();

    // Hàm kiểm tra xem node hoặc node con có chứa emoji không
    const hasEmojiImage = (node: Node): boolean => {
      // Nếu node là ELEMENT_NODE và là thẻ <img>
      if (
        node.nodeType === Node.ELEMENT_NODE &&
        (node as HTMLElement).tagName === "IMG"
      ) {
        const imgElement = node as HTMLImageElement;
        // Kiểm tra dựa trên src hoặc alt (tùy theo tiêu chí của bạn)
        return (
          imgElement.src.includes("emoji") ||
          imgElement.alt.startsWith(":") || // Ví dụ: alt=":smile:"
          imgElement.className.includes("emoji") // Hoặc kiểm tra class
        );
      }

      // Nếu node không phải <img>, kiểm tra các node con của nó
      if (node.childNodes && node.childNodes.length > 0) {
        return Array.from(node.childNodes).some((child) =>
          hasEmojiImage(child)
        );
      }

      // Nếu không có node con hoặc không phải emoji, trả về false
      return false;
    };

    // Hàm đệ quy để xử lý Duyệt sâu để xử lý từng phần tử con node
    const processNode = async (currentNode: Node) => {
      if (
        currentNode.nodeType === Node.ELEMENT_NODE &&
        (currentNode as HTMLElement).tagName === "IMG" &&
        (currentNode as HTMLImageElement).src.includes("emoji")
      ) {
        const nameEmoji =
          (currentNode as HTMLImageElement).src.split("/").pop() || "";
        const urlEmoji = `https://cdn.jsdelivr.net/npm/emoji-datasource-${emojiStyle}/img/${emojiStyle}/64/${nameEmoji}`;

        try {
          const isValidUrl = await checkImageUrl(urlEmoji);
          if (isValidUrl) {
            const emojiImg = createNodeEmoji(
              urlEmoji,
              (currentNode as HTMLImageElement).alt
            );
            fragment.appendChild(emojiImg);
          } else {
            fragment.appendChild(
              document.createTextNode(
                (currentNode as HTMLImageElement).alt || ""
              )
            );
          }
        } catch (error) {
          console.error("Error checking emoji URL:", error);
          fragment.appendChild(
            document.createTextNode((currentNode as HTMLImageElement).alt || "")
          );
        }
      } else if (currentNode.nodeType === Node.ELEMENT_NODE) {
        // Nếu không phải <img> nhưng là element, tiếp tục duyệt các node con
        for (const child of Array.from(currentNode.childNodes)) {
          await processNode(child);
        }
      } else if (
        currentNode.nodeType === Node.TEXT_NODE &&
        currentNode.textContent?.trim()
      ) {
        fragment.appendChild(document.createTextNode(currentNode.textContent));
      }
    };

    for (const node of Array.from(nodes)) {
      if (node.nodeType === Node.TEXT_NODE && node.textContent?.trim()) {
        fragment.appendChild(document.createTextNode(node.textContent));
      }
      if (node.nodeType === Node.ELEMENT_NODE) {
        if (hasEmojiImage(node)) {
          await processNode(node);
        } else {
          fragment.appendChild(document.createTextNode(node.textContent || ""));
        }
      }
    }

    // Chèn fragment vào vị trí con trỏ
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      range.deleteContents();
      range.insertNode(fragment);
      if (fragment.lastChild) {
        range.setStartAfter(fragment.lastChild);
        range.setEndAfter(fragment.lastChild);
      }
      range.collapse(false);
      selection.removeAllRanges();
      selection.addRange(range);
      saveHistory(inputRef.current.innerHTML);
      setIsEmpty(false);
      setTimeout(() => {
        if (!inputRef.current) return;
        onChange(inputRef.current.innerHTML.trim());
        setMessageEmojis();
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

    if (e.ctrlKey && e.key === "z") {
      undo();
    }
    if (e.ctrlKey && e.key === "y") {
      redo();
    }
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
    debounce(() => {
      if (!inputRef.current) return;
      saveHistory(inputRef.current.innerHTML);
    }, 500);
    onChange(inputRef.current.innerHTML.trim());
  };

  useLayoutEffect(() => {
    const input = inputRef.current;
    if (input) {
      input.focus();
      input.innerText = "";
      setIsEmpty(true);
      resetHistory();
    }
  }, [selectedConversation]);

  useLayoutEffect(() => {
    const input = inputRef.current;
    if (input) {
      input.scrollTo({ top: input.scrollHeight, behavior: "smooth" });
      if (!text) {
        input.innerText = "";
        setIsEmpty(true);
      }
    }
  }, [text]);

  return (
    <div
      className={
        "relative w-[calc(100%-80px)] min-h-9 rounded-2xl bg-grayE5 py-2 pl-3 transition-all"
      }
    >
      <div
        ref={inputRef}
        contentEditable
        onInput={handleInput}
        onKeyDown={handleKeyDown}
        onPaste={handlePaste}
        onDragStart={handleDragStart}
        onClick={saveRange}
        className={cn(
          "w-[calc(100%-50px)] text-[15px] leading-5 overflow-y-auto border-none outline-none max-h-24 break-words whitespace-pre-wrap"
        )}
      />
      {isEmpty && (
        <div className="absolute text-[15px] -translate-y-1/2 pointer-events-none left-3 top-1/2 text-gray98">
          Nhập nội dung tin nhắn...
        </div>
      )}
      <Emoji insert={insertEmojiAtCursor} />
    </div>
  );
}

export default ChatInput;
