import {
  useAppDispatch,
  useSelectorAuthSlice,
  useSelectorChatSlice,
} from "@/hook";
import {
  chatApi,
  useSendMessageImagesMutation,
  useSendMessageTextAndEmojiMutation,
} from "@/stores/service/chat.service";
import { IReqSendMessage } from "@/types/chat.type";
import useSocketIoContext from "@/context/socketIo/useSocketIoContext";
import { useEffect, useState } from "react";
import EditMessageImages from "./chat_Send_Message/EditMessageImages";
import { ImageType } from "react-images-uploading";
import { setChat } from "@/stores/reducer/chat.reducer";
import useChatContext from "./context/useChatContext";
import BtnScrollBottom from "./chat_Send_Message/BtnScrollBottom";
import ChatFile from "./chat_Send_Message/ChatFile";
import ChatInput from "./chat_Send_Message/ChatInput";
import BtnSendMessage from "./chat_Send_Message/BtnSendMessage";
import BtnSendLike from "./chat_Send_Message/BtnSendLike";

export type TMessageEmojis = { url: string; alt: string }[];
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
    handleSplicePreviewMessage,
  } = useChatContext();

  const [sendMessageTextAndEmoji] = useSendMessageTextAndEmojiMutation();

  const [sendMessageImages] = useSendMessageImagesMutation();

  const [messageText, setMessageText] = useState<string>("");

  const [messageImages, setMessageImages] = useState<ImageType[]>([]);

  const [messageEmojis, setMessageEmojis] = useState<TMessageEmojis>([]);

  const [openEditImages, setOpenEditImages] = useState<boolean>(false);

  const MessageIsOnlyEmoji = (text: string) => {
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = text;

    const nodes = tempDiv.childNodes;
    for (const node of nodes) {
      if (node.nodeType === Node.TEXT_NODE) {
        if (node.nodeValue && node.nodeValue.trim() !== "") {
          return false;
        }
      } else if (node.nodeType === Node.ELEMENT_NODE) {
        if (
          (node as HTMLElement).tagName !== "IMG" ||
          !(node as HTMLElement).classList.contains("emoji")
        ) {
          return false;
        }
      }
    }
    return nodes.length > 0;
  };

  const handleSetOpenEditImages = (value: boolean) => {
    setOpenEditImages(value);
    if (value === false) {
      setMessageImages([]);
    }
  };

  const onChangeImagesEditImages = (images: ImageType[]) => {
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
        setMessageImages(results as never[]);
      });
    }
  };

  const onChangeImagesInputFile = (images: ImageType[]) => {
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
        setMessageImages((images) => [...images, ...(results as never[])]);
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

  const onchangeMessageEmojis = (value: TMessageEmojis) => {
    setMessageEmojis(value);
  };

  const handleSendMessageTextOrEmoji = async () => {
    if (messageText.trim().length === 0 || !receiverId) return;

    if (socketIo_client && receiverId && user && selectedConversation) {
      socketIo_client.emit("typing", {
        receiverId: receiverId,
        typing: false,
      });
      let message: IReqSendMessage = {
        conversationId: selectedConversation._id,
        senderId: user._id,
        receiverId: receiverId,
        receiverSeen: receiverSeen,
        messageType: "text",
        createdAt: new Date(Date.now()),
      };
      if (MessageIsOnlyEmoji(messageText)) {
        message = { ...message, messageType: "emoji", emojis: messageEmojis };
      } else {
        message = {
          ...message,
          messageType: "text",
          text: messageText,
        };
      }

      handleSetPreviewMessages(message);
      setMessageText("");
      return await sendMessageTextAndEmoji(message).unwrap();
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
      const sendMessageText = handleSendMessageTextOrEmoji();
      const sendMessageImages = handleSendMessageImages();

      const containerDiv = containerDivRef.current;
      if (!containerDiv) return;
      const top = containerDiv.scrollHeight;

      await Promise.all([sendMessageText, sendMessageImages]).then((res) => {
        if (res[0]) {
          handleSetMessages(res[0].message);
          handleSplicePreviewMessage();
        }
        if (res[1]) {
          handleSetMessages(res[1].message);
          handleSplicePreviewMessage();
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

  const handleSendLike = async (text: string) => {
    if (!receiverId || !user || !selectedConversation) return;
    try {
      const containerDiv = containerDivRef.current;
      if (!containerDiv) return;
      const top = containerDiv.scrollHeight;

      const message: IReqSendMessage = {
        conversationId: selectedConversation._id,
        senderId: user._id,
        receiverId: receiverId,
        receiverSeen: receiverSeen,
        messageType: "like",
        text: text,
        createdAt: new Date(Date.now()),
      };
      handleSetPreviewMessages(message);
      handleScrollTo(top, "instant");
      await sendMessageTextAndEmoji(message)
        .unwrap()
        .then((res) => {
          handleSetMessages(res.message);
          handleSplicePreviewMessage();
          dispatch(
            setChat({
              totalMessage: res.totalMessage,
            })
          );
          dispatch(chatApi.util.invalidateTags([{ type: "Conversation" }]));
        })
        .catch((err) => {
          throw new Error(err);
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
    <div className="relative w-full Message_input min-h-fit">
      <div className="relative z-40 flex flex-col justify-end w-full max-w-full bg-white rounded-b-lg h-fit flex-nowrap">
        <EditMessageImages
          openEditImages={openEditImages}
          handleSetOpenEditImage={handleSetOpenEditImages}
          listImages={messageImages}
          onChangeImages={onChangeImagesEditImages}
        />
        <div className="flex items-end justify-center w-full px-2 py-3 gap-x-3 min-h-9">
          <ChatFile
            handleSetOpenEditImages={handleSetOpenEditImages}
            onChangeImages={onChangeImagesInputFile}
          />
          <ChatInput
            text={messageText}
            handleSendMessage={handleSendMessage}
            onChange={onChangeMessageText}
            onchangeEmojis={onchangeMessageEmojis}
          />
          <BtnSendMessage
            onClick={handleSendMessage}
            messageText={messageText}
            messageImages={messageImages}
          />
          <BtnSendLike
            onClick={handleSendLike}
            messageText={messageText}
            messageImages={messageImages}
          />
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
