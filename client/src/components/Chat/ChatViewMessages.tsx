import { LoadingCallApi } from "../loading";
import { cn } from "@/utils";
import {
  useAppDispatch,
  useSelectorAuthSlice,
  useSelectorChatSlice,
} from "@/hook";
import DisplayMessages from "./chat_View_Messages/DisplayMessages";
import DisplayTyping from "./chat_View_Messages/DisplayTyping";
import DisplayInfoReceiver from "./chat_View_Messages/DisplayInfoReceiver";
import useChatContext from "./context/useChatContext";
import { useCallback, useEffect, useState } from "react";
import { LIMIT_GET_MESSAGE } from "./context";
import DisplayPreviewMessages from "./chat_View_Messages/DisplayPreviewMessages";
import { chatApi } from "@/stores/service/chat.service";

const ChatViewMessages = () => {
  const dispatch = useAppDispatch();

  const { selectedConversation } = useSelectorChatSlice();

  const { user } = useSelectorAuthSlice();

  const { totalMessage } = useSelectorChatSlice();

  const {
    messages,
    containerDivRef,
    isFetchingData,
    paramsGetMessages,
    handleScrollTo,
    setOpenBtnScrollDown,
    handleSetParamsGetMessage,
    setCheckScrollToBottom,
    setSizeChatView,
  } = useChatContext();

  const [prevScrollHeight, setPrevScrollHeight] = useState<number>(0);

  const handleSetSeenMessage = useCallback(async () => {
    try {
      const container = containerDivRef.current;
      if (!container || !selectedConversation || !user) return;

      await dispatch(
        chatApi.endpoints.seenMessages.initiate({
          conversationId: selectedConversation._id,
          userId: user._id,
        })
      )
        .unwrap()
        .then(() => {
          dispatch(
            chatApi.util.invalidateTags([
              { type: "Message", id: messages[messages.length - 1]._id },
              { type: "Message", id: "CountUnreadMessage" },
            ])
          );
        })
        .catch((error) => {
          throw new Error(error);
        });
    } catch (error) {
      console.log("error: ", error);
    }
  }, [containerDivRef, dispatch, messages, selectedConversation, user]);

  const LoadingDataMessageOld = () => {
    return (
      messages.length > 0 &&
      messages.length < totalMessage && (
        <div className={cn("w-full max-h-16 flex justify-center")}>
          <div className="w-8 h-8">{isFetchingData && <LoadingCallApi />}</div>
        </div>
      )
    );
  };

  const FetchingDataMessagesFirst = () => {
    if (messages.length !== 0 || !isFetchingData) return;
    return (
      <div className={cn("flex flex-col justify-center items-center h-full")}>
        <div className="w-10 h-10">
          <LoadingCallApi />
        </div>
      </div>
    );
  };

  // add event scroll view
  useEffect(() => {
    const container = containerDivRef.current;
    const handleScrollView = async () => {
      if (container && messages.length > 0) {
        const scrollTop = container.scrollTop;
        const clientHeight = container.clientHeight;
        const scrollHeight = container.scrollHeight;
        setOpenBtnScrollDown(
          scrollTop + clientHeight < scrollHeight - 100 ? true : false
        );

        if (scrollTop === 0 && messages.length < totalMessage) {
          setPrevScrollHeight(scrollHeight);
          handleSetParamsGetMessage({
            skip: paramsGetMessages.skip + LIMIT_GET_MESSAGE,
          });
        }

        if (scrollTop + clientHeight === scrollHeight && messages.length > 0) {
          if (!messages[messages.length - 1].receiverSeen) {
            handleSetSeenMessage();
          }
          setCheckScrollToBottom(true);
        } else {
          setCheckScrollToBottom(false);
        }
      }
    };
    if (container) {
      container.addEventListener("scroll", handleScrollView);
    }
    return () => {
      if (container) {
        container.removeEventListener("scroll", handleScrollView);
      }
    };
  }, [
    containerDivRef,
    handleSetParamsGetMessage,
    handleSetSeenMessage,
    messages,
    paramsGetMessages.skip,
    setCheckScrollToBottom,
    setOpenBtnScrollDown,
    setPrevScrollHeight,
    totalMessage,
  ]);

  //set size chat view
  useEffect(() => {
    const container = containerDivRef.current;
    if (container) {
      setSizeChatView(container.clientWidth > 450 ? "big" : "mini");
    }
  }, [containerDivRef, setSizeChatView]);

  //load message older but keep scroll position
  useEffect(() => {
    const container = containerDivRef.current;
    if (!container) return;
    if (prevScrollHeight > 0 && container.scrollHeight > prevScrollHeight) {
      const top = container.scrollHeight - prevScrollHeight;
      setPrevScrollHeight(0);
      handleScrollTo(top, "instant");
    }
  }, [containerDivRef, handleScrollTo, prevScrollHeight, setPrevScrollHeight]);

  return (
    <section
      ref={containerDivRef}
      className={cn(
        "flex flex-col h-full px-3 pt-3 bg-white message_list overflow-auto"
      )}
    >
      <FetchingDataMessagesFirst />

      <LoadingDataMessageOld />

      <DisplayInfoReceiver />

      <DisplayMessages />

      <DisplayPreviewMessages />

      <DisplayTyping />
    </section>
  );
};

export default ChatViewMessages;
