import { Button } from "@/components/button";
import { IconDown, IconMessage, IconSendMessage } from "@/components/icon";
import { Input } from "@/components/input";
import Message from "@/components/message";
import Tooltip from "@/components/tooltip";
import { SocketContext, TSocketProvider } from "@/context/SocketContext";
import { useToggle } from "@/hook";
import useTestContext from "@/hook/useTestContext";
import { cn } from "@/utils";
import { useEffect, useState } from "react";

function Chat() {
  const socketIo_client = useTestContext<TSocketProvider>(
    SocketContext as React.Context<TSocketProvider>
  );

  const [firstLoad, setFirstLoad] = useState<boolean>(false);

  const { toggle: isOpenChat, handleToggle: handleOpenChat } = useToggle();

  const [message, setMessage] = useState<string>("");

  const handleChangeMessage = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessage(e.target.value);
  };

  useEffect(() => {
    if (socketIo_client) {
      socketIo_client.on("send_message", (data) => {
        console.log(data);
      });
    }
  }, [socketIo_client]);

  return (
    <div className={cn("absolute right-2 -bottom-4")}>
      <div
        onClick={() => {
          handleOpenChat();
          setFirstLoad(true);
        }}
        className={cn(
          "flex justify-center items-center transition-all gap-x-2 text-lg font-semibold text-orange bg-white",
          "rounded-t-md p-2 shadow-shadow1 border-1 border-orange",
          isOpenChat ? "opacity-0 hidden" : "opacity-100 delay-200 "
        )}
      >
        <span>
          <IconMessage size={30}></IconMessage>
        </span>
        <span>Chat</span>
      </div>
      <div
        className={cn(
          "chat rounded-t-md shadow-shadow1 border-1 border-orange bg-grayE5 ",
          firstLoad ? (isOpenChat ? "chat_open" : "chat_close") : "hidden"
        )}
      >
        <div className="w-full h-full">
          <div className="flex items-center justify-between p-3 leading-5 bg-white rounded-t-md border-b-1 border-b-gray98">
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
          <div className="flex flex-col flex-shrink-0 h-full ">
            <div className="message_list flex flex-col gap-y-1 px-2 max-h-[70%] overflow-y-scroll">
              <Message messageByUser={false}></Message>
              <Message messageByUser={true}></Message>
              <Message messageByUser={false}></Message>
              <Message messageByUser={true}></Message>
              <Message messageByUser={false}></Message>
              <Message messageByUser={true}></Message>
              <Message messageByUser={true}></Message>
              <Message messageByUser={true}></Message>
              <Message messageByUser={false}></Message>
              <Message messageByUser={false}></Message>
              <Message messageByUser={false}></Message>
              <Message messageByUser={true}></Message>
            </div>
            <div className="h-[30%] mt-auto bg-white border-t-1 border-t-gray98">
              <div className="flex flex-col h-full p-3">
                <div className="flex gap-x-2">
                  <Input
                    type="text"
                    name="message"
                    value={message}
                    onChange={(e) => handleChangeMessage(e)}
                    placeholder="Nhập nội dung tin nhắn"
                    className={{ input: "rounded-xl border-gray98" }}
                  ></Input>
                  <Button
                    variant="outLine-border"
                    type="button"
                    // disabled={message.length > 0 ? false : true}
                    onClick={() => socketIo_client?.emit("send_message", "abc")}
                    className="max-w-[40px] h-10 rounded-full text-white flex justify-center items-center bg-orange hover:bg-white"
                  >
                    <IconSendMessage size={20}></IconSendMessage>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Chat;
