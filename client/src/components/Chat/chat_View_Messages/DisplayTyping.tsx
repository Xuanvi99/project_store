import useSocketIoContext from "@/context/socketIo/useSocketIoContext";
import { useSelectorChatSlice } from "@/hook";
import { cn } from "@/utils";
import { useEffect, useState } from "react";
import { LazyLoadImage } from "react-lazy-load-image-component";
import useChatContext from "../context/useChatContext";

function DisplayTyping() {
  const socketIo_client = useSocketIoContext();

  const { selectedConversation, receiverId, receiverInfo } =
    useSelectorChatSlice();

  const [displayTyping, setDisplayTyping] = useState<boolean>(false);

  const { containerDivRef, checkScrollToBottom, handleScrollTo } =
    useChatContext();

  // scroll when typing and scroll to bottom
  useEffect(() => {
    const container = containerDivRef.current;
    if (container && displayTyping && checkScrollToBottom) {
      const top = container.scrollHeight;
      handleScrollTo(top, "smooth");
      console.log("typing");
    }
  }, [displayTyping, checkScrollToBottom, containerDivRef, handleScrollTo]);

  useEffect(() => {
    if (!socketIo_client || !selectedConversation || !receiverId) return;

    // lắng nghe typing to receiver
    socketIo_client.on(
      "displayTyping",
      (data: { typing: boolean; senderId: string }) => {
        if (data.senderId === receiverId) {
          setDisplayTyping(data.typing);
        }
      }
    );

    return () => {
      socketIo_client?.off("displayTyping");
    };
  }, [socketIo_client, selectedConversation, receiverId, receiverInfo]);

  if (!receiverInfo || !displayTyping) return;

  return (
    <div className="flex items-center justify-start w-full pb-2 mt-1 message gap-x-2">
      <div className={cn("flex flex-col justify-center h-full")}>
        <span className="overflow-hidden rounded-full w-7 h-7">
          <LazyLoadImage
            alt="image_avatar"
            placeholderSrc={"/userName.png"}
            srcSet={receiverInfo.avatar?.url || receiverInfo.avatarDefault}
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
          "typing-chat relative max-w-[70%] bg-grayE5 rounded-2xl flex justify-center items-center gap-x-1 px-2 py-3"
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
