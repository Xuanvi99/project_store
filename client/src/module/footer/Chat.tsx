import { IconCLose, IconMessage } from "@/components/icon";
import { cn } from "@/utils";
import { useState } from "react";
import Conversation from "../../components/Chat/conversation";
import { useToggle } from "@/hook";

function ChatFooter() {
  const [firstLoad, setFirstLoad] = useState<boolean>(false);

  const { toggle: openChat, handleToggle: handleOpenChat } = useToggle();

  return (
    <div className={cn("fixed right-3 bottom-0 z-40")}>
      <div
        onClick={() => {
          handleOpenChat();
          setFirstLoad(true);
        }}
        className={cn(
          "absolute right-0 bottom-2 flex justify-center items-center transition-opacity gap-x-2 text-lg font-semibold ",
          "text-orange bg-white rounded-full p-3 border-1 border-orange cursor-pointer hover:text-white hover:bg-orange",
          openChat ? "opacity-0 hidden" : "delay-300 duration-200 opacity-100"
        )}
      >
        <span>
          <IconMessage size={30}></IconMessage>
        </span>
      </div>
      <div
        className={cn(
          "chat absolute right-0 bottom-0 rounded-t-md border-1 border-orange bg-grayE5 ",
          firstLoad
            ? openChat
              ? "w-[450px] h-[450px] opacity-1 "
              : "w-[0px] h-[0px] opacity-0 duration-300"
            : "hidden"
        )}
      >
        <div className="w-full h-full flex flex-col">
          <div className="flex items-center justify-between p-3 leading-5 max-h-[50px] bg-white rounded-t-md border-b-1 border-b-orange">
            <h1 className="text-lg font-semibold text-orangeFe flex items-center gap-x-2">
              <span>
                <IconMessage size={30}></IconMessage>
              </span>
              <span>Tin nhắn</span>
            </h1>
            <div
              onClick={handleOpenChat}
              className="cursor-pointer hover:text-orange"
            >
              <IconCLose size={15}></IconCLose>
            </div>
          </div>
          <div className="h-[400px] ">
            <Conversation />
          </div>
        </div>
      </div>
    </div>
  );
}

export default ChatFooter;
