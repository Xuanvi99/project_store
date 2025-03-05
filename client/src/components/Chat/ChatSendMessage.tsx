import { IconSendMessage } from "../icon";
import { Button } from "../button";
import {
  useAppDispatch,
  useSelectorAuthSlice,
  useSelectorChatSlice,
} from "@/hook";
import {
  chatApi,
  useSendMessageImagesMutation,
  useSendMessageTextMutation,
} from "@/stores/service/chat.service";
import { IReqSendMessage } from "@/types/chat.type";
import useSocketIoContext from "@/context/socketIo/useSocketIoContext";
import { useEffect, useState } from "react";
import EditMessageImages from "./chat_Send_Mesage/EditMessageImages";
import { ImageType } from "react-images-uploading";
import { setChat } from "@/stores/reducer/chat.reducer";
import useChatContext from "./context/useChatContext";
import BtnScrollBottom from "./chat_Send_Mesage/BtnScrollBottom";
import ChatFileImg from "./chat_Send_Mesage/ChatFileImg";
import ChatInput from "./chat_Send_Mesage/ChatInput";

function ChatSendMessage() {
  const socketIo_client = useSocketIoContext();

  const { user } = useSelectorAuthSlice();

  const dispatch = useAppDispatch();

  const { selectedConversation, receiverId } = useSelectorChatSlice();

  const {
    receiverSeen,
    containerDivRef,
    handleSetMessages,
    openBtnScrollDown,
    handleBtnScrollToBottom,
    handleScrollTo,
    handleSetPreviewMessages,
    checkScrollToBottom,
  } = useChatContext();

  const [sendMessageText] = useSendMessageTextMutation();

  const [sendMessageImages] = useSendMessageImagesMutation();

  const [messageText, setMessageText] = useState<string>("");

  const [messageImages, setMessageImages] = useState<ImageType[]>([]);

  const [openEditImages, setOpenEditImages] = useState<boolean>(false);

  const handleSetOpenEditImages = (value: boolean) => {
    setOpenEditImages(value);
    if (value === false) {
      setMessageImages([]);
    }
  };

  const onChangeImages = (images: ImageType[]) => {
    if (images.length > 0) {
      const imagePreviews = images.map((image) => {
        return new Promise((resolve) => {
          const img = new Image();
          img.src = image["data_url"] as string;
          img.onload = () => {
            resolve({
              data_url: image["data_url"],
              width: img.width,
              height: img.height,
              file: image.file,
            });
          };
        });
      });

      Promise.all(imagePreviews).then((results) => {
        console.log("results: ", results);
        setMessageImages(results as never[]);
      });
    }
  };

  const onChangeMessageText = (value: string) => {
    setMessageText(value);
    if (socketIo_client) {
      socketIo_client.emit("typing", {
        receiverId,
        typing: value.length === 0 ? false : true,
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
        receiverSeen: receiverSeen,
        messageType: "text",
        createdAt: new Date(Date.now()),
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
      formData.append("receiverSeen", receiverSeen.toString());

      const messageImage: IReqSendMessage = {
        conversationId: selectedConversation._id,
        senderId: user._id,
        receiverId: receiverId,
        receiverSeen: receiverSeen,
        messageType: "image",
        images: messageImages.map((image) => {
          return {
            url: image["data_url"],
            width: image["width"],
            height: image["height"],
          };
        }),
        createdAt: new Date(Date.now()),
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

      const containerDiv = containerDivRef.current;
      if (!containerDiv) return;
      const top = containerDiv?.scrollHeight;

      await Promise.all([sendMessageText, sendMessageImages]).then((res) => {
        if (res[0]) {
          handleSetMessages(res[0].message);
        }
        if (res[1]) {
          handleSetMessages(res[1].message);
        }

        handleScrollTo(top, "instant");

        dispatch(
          setChat({
            totalMessage: res[1] ? res[1].totalMessage : res[0]?.totalMessage,
          })
        );
        dispatch(chatApi.util.invalidateTags([{ type: "Conversation" }]));

        setMessageText("");
        setMessageImages([]);
      });
    } catch (error) {
      console.log("error: ", error);
    }
  };

  useEffect(() => {
    const container = containerDivRef.current;
    if (container && checkScrollToBottom) {
      const top = container.scrollHeight;
      handleScrollTo(top, "instant");
    }
  }, [
    checkScrollToBottom,
    messageText,
    messageImages,
    containerDivRef,
    handleScrollTo,
  ]);

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
          <ChatFileImg
            openEditImages={openEditImages}
            handleSetOpenEditImages={handleSetOpenEditImages}
            onChangeImages={onChangeImages}
          />
          <ChatInput
            text={messageText}
            handleSendMessage={handleSendMessage}
            onChange={onChangeMessageText}
          />
          <Button
            variant="outLine-border"
            type="button"
            onClick={handleSendMessage}
            className="flex items-center justify-center text-white rounded-full w-9 h-9 bg-orange hover:bg-white"
          >
            <IconSendMessage size={28} />
          </Button>
        </div>
      </div>
      <BtnScrollBottom
        openBtnScrollDown={openBtnScrollDown}
        handleBtnScrollToBottom={handleBtnScrollToBottom}
      />
    </div>
  );
}

export default ChatSendMessage;
