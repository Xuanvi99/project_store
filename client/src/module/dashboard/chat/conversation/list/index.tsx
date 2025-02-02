import { cn } from "@/utils";
import ConversationItem from "./ConversationItem";
import { useEffect, useRef, useState } from "react";
import useChatContext from "../../context/useChatContext";
import { useSelectorAuthSlice } from "@/hook";

function ConversationsList() {
  const { user } = useSelectorAuthSlice();

  const { conversations } = useChatContext();

  const conversationRef = useRef<HTMLDivElement>(null);

  const [openScroll, setOpenScroll] = useState<boolean>(false);

  useEffect(() => {
    if (conversationRef.current && conversations) {
      const height = conversationRef.current.offsetHeight;
      setOpenScroll(height / 70 < conversations.length ? true : false);
    }
  }, [conversations]);

  return (
    <div
      ref={conversationRef}
      className={cn(
        "w-full h-full flex flex-col mt-auto",
        openScroll && "overflow-y-scroll pr-2"
      )}
    >
      {user &&
        conversations &&
        conversations.length > 0 &&
        conversations.map((data) => {
          return (
            <ConversationItem
              key={data._id}
              conversation={data}
              currentUserId={user._id}
            />
          );
        })}
    </div>
  );
}

export default ConversationsList;
