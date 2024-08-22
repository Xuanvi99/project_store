import { IconDown, IconMessage } from "@/components/icon";
import Tooltip from "@/components/tooltip";
import { useToggle } from "@/hook";
import { cn } from "@/utils";
import { socket } from "@/utils/socket.io";
import { useEffect, useState } from "react";

function Chat() {
  const { toggle: isOpenChat, handleToggle: handleOpenChat } = useToggle();

  const [isConnected, setIsConnected] = useState(socket.connected);
  console.log("isConnected: ", isConnected);

  useEffect(() => {
    function onConnect() {
      setIsConnected(true);
    }

    function onDisconnect() {
      setIsConnected(false);
    }

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
    };
  }, []);

  return (
    <div className={cn("absolute right-2 -bottom-4")}>
      <div
        onClick={handleOpenChat}
        className={cn(
          "flex justify-center items-center transition-all gap-x-2 text-lg font-semibold text-orange bg-white",
          "rounded-t-md p-2 shadow-shadow1 border-1 border-orange",
          isOpenChat ? "opacity-0" : "opacity-100 delay-200"
        )}
      >
        <span>
          <IconMessage size={30}></IconMessage>
        </span>
        <span>Chat</span>
      </div>
      <div
        className={cn(
          "chat rounded-t-md shadow-shadow1 border-1 border-orange bg-grayF5 ",
          isOpenChat ? "chat_open" : "chat_close"
        )}
      >
        <div className="w-full h-full">
          <div className="flex leading-5 rounded-t-md p-3 justify-between items-center border-b-1 border-b-gray98 bg-white">
            <h1 className="text-xl font-semibold text-orangeFe ">Chat</h1>
            <Tooltip
              place="top"
              className={{ content: "z-50 text-xs whitespace-nowrap" }}
              onClick={handleOpenChat}
              select={
                <span className="text-gray98">
                  <IconDown size={15}></IconDown>
                </span>
              }
            >
              <span>Thu gọn</span>
            </Tooltip>
          </div>
          <div></div>
        </div>
      </div>
    </div>
  );
}

export default Chat;
