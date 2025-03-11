import { cn } from "@/utils";
import TextareaAutosize from "react-textarea-autosize";
import Tooltip from "../tooltip";
import { IconSendMessage, IconArrowDown, IconUploadImage } from "../icon";
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
  useGetUnreadMessageQuery,
  useSendMessageImagesMutation,
  useSendMessageTextMutation,
} from "@/stores/service/chat.service";
import { IMessage, IReqSendMessage } from "@/types/chat.type";
import { categoriesConfigEmoji } from "@/constant/chat.constant";
import useSocketIoContext from "@/context/socketIo/useSocketIoContext";
import { useEffect, useLayoutEffect, useState } from "react";
import { IUser } from "@/types/user.type";
import EditMessageImages from "./chat_Send_Mesage/EditMessageImages";
import { ImageType } from "react-images-uploading";
import { setChat } from "@/stores/reducer/chat.reducer";

type TProps = {
  openBtnScrollDown: boolean;
  receiverSeenCvs: boolean;
  handleChangeMessageText: (value: string) => void;
  handleBtnScrollToBottom: () => void;
  handleSetMessages: (msg: IMessage<IUser>) => void;
  handleSetPreviewMessages: (msg: IReqSendMessage) => void;
  handleSetImages: (images: ImageType[]) => void;
};
function ChatSendMessage({
  openBtnScrollDown,
  receiverSeenCvs,
  handleChangeMessageText,
  handleBtnScrollToBottom,
  handleSetMessages,
  handleSetPreviewMessages,
  handleSetImages,
}: TProps) {
  const socketIo_client = useSocketIoContext();

  const { user } = useSelectorAuthSlice();

  const dispatch = useAppDispatch();

  const { selectedConversation, receiverId } = useSelectorChatSlice();

  const [sendMessageText] = useSendMessageTextMutation();

  const [sendMessageImages] = useSendMessageImagesMutation();

  const { data: dataUnreadMessage, status } = useGetUnreadMessageQuery(
    {
      conversationId: selectedConversation?._id || "",
      userId: user?._id || "",
    },
    { skip: !selectedConversation || !user }
  );

  const { toggle: openEmojiPicker, handleToggle: handleOpenEmojiPicker } =
    useToggle();

  const [messageText, setMessageText] = useState<string>("");

  const [messageImages, setMessageImages] = useState<ImageType[]>([]);

  const [amountUnreadMessage, setAmountUnreadMessage] = useState<number>(0);

  const [openEditImages, setOpenEditImages] = useState<boolean>(false);

  const handleSetOpenEditImages = (value: boolean) => {
    setOpenEditImages(value);
    if (value === false) {
      setMessageImages([]);
      handleSetImages([]);
    }
  };

  const onChangeImages = (images: ImageType[]) => {
    setMessageImages(images as never[]);
    handleSetImages(images);
  };

  const onChangeMessageText = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    handleChangeMessageText(e.target.value);
    setMessageText(e.target.value);
    if (socketIo_client) {
      socketIo_client.emit("typing", {
        receiverId,
        typing: e.target.value.length === 0 ? false : true,
      });
    }
  };

  const handleSendMessageText = async () => {
    if (messageText.trim().length === 0 || !receiverId) return;

    if (socketIo_client && receiverId && user && selectedConversation) {
      socketIo_client.emit("typing", {
        receiverId: receiverId,
        typing: false,
      });
      setMessageText("");
      const message: IReqSendMessage = {
        conversationId: selectedConversation._id,
        senderId: user._id,
        receiverId: receiverId,
        text: messageText,
        receiverSeen: receiverSeenCvs,
        messageType: "text",
      };
      handleSetPreviewMessages(message);
      return await sendMessageText(message).unwrap();
    }
  };

  const handleSendMessageImages = async () => {
    if (messageImages.length === 0 || !receiverId) return;
    if (receiverId && user && selectedConversation) {
      handleSetOpenEditImages(false);
      const formData = new FormData();
      for (const item of messageImages as ImageType[]) {
        formData.append("images", item.file as File);
      }
      formData.append("senderId", user._id);
      formData.append("receiverId", receiverId);
      formData.append("receiverSeen", receiverSeenCvs.toString());

      const messageImage: IReqSendMessage = {
        conversationId: selectedConversation._id,
        senderId: user._id,
        receiverId: receiverId,
        receiverSeen: receiverSeenCvs,
        images: messageImages.map((image) => image["data_url"]),
        messageType: "image",
      };
      handleSetPreviewMessages(messageImage);
      return await sendMessageImages({
        conversationId: selectedConversation._id,
        data: formData,
      }).unwrap();
    }
  };

  const handleSendMessage = async () => {
    try {
      const sendMessageText = handleSendMessageText();
      const sendMessageImages = handleSendMessageImages();

      await Promise.all([sendMessageText, sendMessageImages]).then((res) => {
        if (res[0]) {
          handleSetMessages(res[0].message);
        }
        if (res[1]) {
          handleSetMessages(res[1].message);
        }
        dispatch(
          setChat({
            totalMessage: res[1] ? res[1].totalMessage : res[0]?.totalMessage,
          })
        );
        dispatch(chatApi.util.invalidateTags([{ type: "Conversation" }]));
      });
    } catch (error) {
      console.log("error: ", error);
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && messageText.trim().length > 0) {
      event.preventDefault();
      handleSendMessage();
      return false;
    }
  };

  useLayoutEffect(() => {
    if (dataUnreadMessage && status === "fulfilled") {
      setAmountUnreadMessage(dataUnreadMessage.amount);
    }
  }, [dataUnreadMessage, status]);

  useEffect(() => {
    let typingTimer = undefined;
    if (messageText && socketIo_client) {
      typingTimer = setTimeout(() => {
        socketIo_client.emit("typing", {
          receiverId,
          typing: false,
        });
      }, 5000);
    }
    return () => clearTimeout(typingTimer);
  }, [messageText, receiverId, socketIo_client]);

  return (
    <div className="relative w-full Message_input min-h-fit border-t-1 border-t-orange">
      <div className="relative z-40 flex flex-col justify-end bg-white h-fit">
        <EditMessageImages
          openEditImages={openEditImages}
          handleSetOpenEditImage={handleSetOpenEditImages}
          listImages={messageImages}
          onChangeImages={onChangeImages}
        />
        <div className="flex items-center p-3 gap-x-2">
          <div className={cn("Icon_upload_file", openEditImages && "hidden")}>
            <input
              type="file"
              name="file"
              id="file"
              multiple
              className="hidden"
              onChange={(e) => {
                if (e.target.files) {
                  const files = e.target.files;
                  const images: ImageType[] = [];
                  for (const file of files) {
                    const image = {
                      data_url: URL.createObjectURL(file),
                      file: file,
                    };
                    images.push(image);
                  }
                  onChangeImages(images);
                  handleSetOpenEditImages(true);
                }
              }}
            />
            <label
              htmlFor="file"
              className="cursor-pointer text-blue hover:text-orange"
            >
              <IconUploadImage size={25} />
            </label>
          </div>
          <div
            className={
              "w-full p-2 rounded-xl flex bg-grayE5 items-end border-1 border-orange gap-x-2 transition-all"
            }
          >
            <TextareaAutosize
              autoFocus
              minRows={1}
              maxRows={5}
              placeholder="Nhập nội dung tin nhắn"
              value={messageText}
              onChange={onChangeMessageText}
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
                content={
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
          "absolute -top-16 left-1/2 -translate-x-1/2 transition-all duration-300 z-30",
          "w-10 h-10 rounded-full bg-grayF5 flex justify-center items-center text-orange shadow-sm shadow-gray98 cursor-pointer",
          !openBtnScrollDown && "top-0"
        )}
        onClick={handleBtnScrollToBottom}
      >
        <IconArrowDown size={30} />
        {amountUnreadMessage > 0 && (
          <div className="absolute -right-1 top-0 text-[8px] w-4 h-4 bg-danger rounded-full text-white flex justify-center items-center">
            {amountUnreadMessage}
          </div>
        )}
      </Button>
    </div>
  );
}

export default ChatSendMessage;
