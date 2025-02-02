import { cn } from "@/utils";
import TextareaAutosize from "react-textarea-autosize";
import Tooltip from "../tooltip";
import { IconSendMessage, IconArrowDown } from "../icon";
import { Button } from "../button";
import EmojiPicker from "emoji-picker-react";
import {
  useAppDispatch,
  useSelectorAuthSlice,
  useSelectorChatSlice,
  useToggle,
} from "@/hook";
import {
  chatApi,
  useSendMessageTextMutation,
} from "@/stores/service/chat.service";
import { IMessage, IReqSendMessageText } from "@/types/chat.type";
import { categoriesConfigEmoji } from "@/constant/chat.constant";
import useSocketIoContext from "@/context/socketIo/useSocketIoContext";
import { useEffect, useState } from "react";

type TProps = {
  textMessage: string;
  openBtnScrollDown: boolean;
  receiverJoinCvs: boolean;
  handleChangeTextMessage: (value: string) => void;
  handleBtnScrollToBottom: () => void;
  handleSenderMessage: (msg: IMessage) => void;
};
function ChatInput({
  textMessage,
  openBtnScrollDown,
  receiverJoinCvs,
  handleChangeTextMessage,
  handleBtnScrollToBottom,
  handleSenderMessage,
}: TProps) {
  const socketIo_client = useSocketIoContext();

  const { user } = useSelectorAuthSlice();

  const dispatch = useAppDispatch();

  const { selectedConversation } = useSelectorChatSlice();

  const [sendMessageText] = useSendMessageTextMutation();

  const { toggle: openEmojiPicker, handleToggle: handleOpenEmojiPicker } =
    useToggle();

  const [receiverId, setReceiverId] = useState<string>("");

  const [message, setMessage] = useState<string>("");

  const handleChangeMessage = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    handleChangeTextMessage(e.target.value);
    setMessage(e.target.value);
    if (socketIo_client) {
      socketIo_client.emit("typing", {
        receiverId,
        typing: e.target.value.length === 0 ? false : true,
      });
    }
  };

  const handleSendMessage = async () => {
    if (user && selectedConversation) {
      try {
        const receiverId = selectedConversation.participants.find(
          (r) => r !== user._id
        );
        if (socketIo_client) {
          socketIo_client.emit("typing", {
            receiverId,
            typing: false,
          });
        }
        if (receiverId) {
          const message: IReqSendMessageText = {
            conversationId: selectedConversation._id,
            senderId: user._id,
            receiverId: receiverId,
            text: textMessage,
            receiverSeen: receiverJoinCvs,
          };
          await sendMessageText(message)
            .unwrap()
            .then((res) => {
              handleSenderMessage(res);
              dispatch(chatApi.util.invalidateTags([{ type: "Conversation" }]));
            });
        }
      } catch (error) {
        console.log("error: ", error);
      }
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter") {
      handleSendMessage();
    }
  };

  useEffect(() => {
    if (selectedConversation && user) {
      const id = selectedConversation.participants.find((r) => r !== user._id);
      setReceiverId(id || "");
    }
  }, [selectedConversation, user]);

  useEffect(() => {
    let typingTimer = undefined;
    if (message && socketIo_client) {
      typingTimer = setTimeout(() => {
        socketIo_client.emit("typing", {
          receiverId,
          typing: false,
        });
      }, 5000);
    }
    return () => clearTimeout(typingTimer);
  }, [message, receiverId, socketIo_client]);

  return (
    <div className="relative w-full Message_input min-h-fit">
      <div className="relative z-40 flex flex-col justify-end w-full p-3 bg-white h-fit">
        <div className="flex items-center gap-x-2 ">
          <div
            className={
              "w-full p-2 rounded-xl flex bg-grayE5 items-end border-1 border-orange gap-x-2"
            }
          >
            <TextareaAutosize
              autoFocus
              minRows={1}
              maxRows={5}
              placeholder="Nhập nội dung tin nhắn"
              value={textMessage}
              onChange={handleChangeMessage}
              onKeyDown={handleKeyDown}
              className="w-full text-sm outline-none resize-none bg-grayE5"
            />
            <div className="relative">
              <Tooltip
                place="top"
                className={{
                  content:
                    "z-50 text-xs whitespace-nowrap bg-black bg-opacity-80 text-white ",
                }}
                onClick={handleOpenEmojiPicker}
                title={
                  <p className="whitespace-nowrap">Chọn biểu tượng cảm xúc</p>
                }
              >
                <div
                  className={cn(
                    "text-gray98 cursor-pointer",
                    openEmojiPicker &&
                      "before:absolute before:z-40 before:hoverDropdown before:bottom-[10px] before:left-1/2 before:-translate-x-1/2 before:border-l-transparent before:border-r-transparent before:border-b-transparent before:border-[15px] before:border-t-white"
                  )}
                >
                  <img
                    alt="😀"
                    srcSet="https://cdn.jsdelivr.net/npm/emoji-datasource-apple/img/apple/64/1f603.png"
                    width={20}
                  />
                </div>
              </Tooltip>
              <div
                className={cn(
                  "emojiPicker shadow-shadow2 w-auto absolute -top-4 -translate-y-full -right-10"
                )}
              >
                <EmojiPicker
                  open={openEmojiPicker}
                  width={300}
                  height={350}
                  searchPlaceHolder="Tìm kiếm biểu tượng cảm xúc"
                  className="pb-3"
                  onEmojiClick={(data) => {
                    console.log(data);
                  }}
                  skinTonesDisabled={true}
                  searchDisabled
                  previewConfig={{ showPreview: false }}
                  categories={categoriesConfigEmoji}
                />
              </div>
            </div>
          </div>
          <Button
            variant="outLine-border"
            type="button"
            onClick={handleSendMessage}
            className="flex items-center justify-center text-white rounded-full h-9 w-9 bg-orange hover:bg-white"
          >
            <IconSendMessage size={28} />
          </Button>
        </div>
      </div>
      <Button
        variant="outLine"
        className={cn(
          "absolute -top-20 left-1/2 -translate-x-1/2 transition-all duration-300 z-30",
          "w-10 h-10 rounded-full bg-grayF5 flex justify-center items-center text-orange shadow-sm shadow-gray98 cursor-pointer",
          !openBtnScrollDown && "top-0"
        )}
        onClick={handleBtnScrollToBottom}
      >
        <IconArrowDown size={30} />
      </Button>
    </div>
  );
}

export default ChatInput;
