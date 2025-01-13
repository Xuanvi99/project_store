import { Button } from "@/components/button";
import { IconDown, IconSendMessage } from "@/components/icon";
import {
  SocketContext,
  TSocketProvider,
} from "@/context/socketIo/SocketContext";
import useTestContext from "@/hook/useTestContext";
import { cn } from "@/utils";
import TextareaAutosize from "react-textarea-autosize";
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { LoadingCallApi } from "@/components/loading";
import Message from "./message";
import EmojiPicker, { Categories } from "emoji-picker-react";
import Tooltip from "../tooltip";
import { useToggle } from "@/hook";

function Conversation() {
  const socketIo_client = useTestContext<TSocketProvider>(
    SocketContext as React.Context<TSocketProvider>
  );

  const containerRef = useRef<HTMLDivElement>(null);

  const loadingRef = useRef<HTMLDivElement>(null);

  const messageItemRef = useRef<Record<string, HTMLDivElement>>({});

  const { toggle: openEmojiPicker, handleToggle: handleOpenEmojiPicker } =
    useToggle();

  const [conversationHeight, setConversationHeight] = useState<number>(0);

  const [conversationHeightOld, setConversationHeightOld] = useState<number>(0);

  const [openScrollDown, setOpenScrollDown] = useState<boolean>(false);

  const [openLoading, setOpenLoading] = useState<boolean>(false);

  const [senderMessage, setSenderMessage] = useState<boolean>(false);

  const [textMessage, setTextMessage] = useState<string>("");

  const [listMessage, setListMessage] = useState<
    {
      id: string;
      senderId: string;
      receiverId: string;
      messageType: string;
      text: string;
    }[]
  >([]);

  useLayoutEffect(() => {
    if (!containerRef.current) return;
    if (openLoading) {
      setTimeout(() => {
        const text = [
          {
            id: "" + listMessage.length + 1,
            senderId: "you",
            receiverId: "me",
            messageType: "moc" + listMessage.length + 1,
            text: "you" + listMessage.length + 1,
          },
          {
            id: "" + listMessage.length + 2,
            senderId: "you",
            receiverId: "me",
            messageType: "you",
            text: "you",
          },
          {
            id: "" + listMessage.length + 3,
            senderId: "you",
            receiverId: "me",
            messageType: "you",
            text: "you",
          },
          {
            id: "" + listMessage.length + 4,
            senderId: "you",
            receiverId: "me",
            messageType: "you",
            text: "you",
          },
          {
            id: "" + listMessage.length + 5,
            senderId: "me",
            receiverId: "you",
            messageType: "you",
            text: "you",
          },
        ];
        setListMessage([...text, ...listMessage]);
        setOpenLoading(false);
      }, 3000);
    } else {
      setConversationHeight(containerRef.current.scrollHeight);
    }
  }, [conversationHeight, listMessage, openLoading]);

  useEffect(() => {
    if (containerRef.current && conversationHeight > conversationHeightOld) {
      containerRef.current.scrollBy({
        top: conversationHeight - conversationHeightOld - 32,
        behavior: "instant",
      });
      setConversationHeightOld(containerRef.current.scrollHeight);
    }
  }, [conversationHeight, conversationHeightOld]);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTo({
        top: containerRef.current.scrollHeight,
        behavior: senderMessage ? "smooth" : "instant",
      });
      setConversationHeight(containerRef.current.scrollHeight);
      setConversationHeightOld(containerRef.current.scrollHeight);
      if (senderMessage) {
        setSenderMessage(false);
      }
    }
  }, [senderMessage]);

  const handleScrollView = useCallback(() => {
    const scrollView = containerRef.current;
    if (scrollView && listMessage) {
      setOpenScrollDown(
        scrollView.scrollTop + scrollView.clientHeight < conversationHeight - 20
          ? true
          : false
      );
      setOpenLoading(scrollView.scrollTop === 0 ? true : false);
    }
  }, [conversationHeight, listMessage]);

  useEffect(() => {
    const scrollView = containerRef.current;
    if (scrollView) {
      scrollView.addEventListener("scroll", handleScrollView);
    }
    return () => {
      scrollView?.removeEventListener("scroll", handleScrollView);
    };
  }, [handleScrollView]);

  const handleChangeMessage = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setTextMessage(e.target.value);
  };

  const handleRenderConversations = () => {
    return listMessage.map((item, index) => {
      let displayAvatar = true;
      if (index + 1 < listMessage.length) {
        if (listMessage[index].senderId === listMessage[index + 1].senderId) {
          displayAvatar =
            listMessage[index].receiverId === listMessage[index + 1].receiverId
              ? false
              : true;
        } else {
          displayAvatar = true;
        }
      }
      return (
        <Message
          key={item.id}
          ref={(el: HTMLDivElement) => (messageItemRef.current[item.id] = el)}
          message={item}
          displayAvatar={displayAvatar}
        ></Message>
      );
    });
  };

  return (
    <div className="flex flex-col justify-end w-full h-full conversation ">
      <div
        ref={containerRef}
        className="flex flex-col h-full px-3 py-3 overflow-y-scroll bg-white message_list gap-y-1"
      >
        {openLoading && (
          <div ref={loadingRef} className={cn("w-full max-h-7")}>
            <LoadingCallApi size={7}></LoadingCallApi>
          </div>
        )}
        {handleRenderConversations()}
      </div>
      <div className="relative mt-auto bg-white min-h-auto ">
        <div className="relative z-50 flex flex-col w-full h-full p-3 bg-white">
          <div className="flex items-center gap-x-2">
            <div
              className={cn("w-full p-2 rounded-xl flex bg-grayE5 items-end")}
            >
              <TextareaAutosize
                autoFocus
                minRows={1}
                maxRows={5}
                placeholder="Nhập nội dung tin nhắn"
                value={textMessage}
                onChange={handleChangeMessage}
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
                      src="https://cdn.jsdelivr.net/npm/emoji-datasource-apple/img/apple/64/1f603.png"
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
                    categories={[
                      {
                        category: Categories.SUGGESTED,
                        name: "Gần đây",
                      },
                      {
                        category: Categories.SMILEYS_PEOPLE,
                        name: "Cảm xúc",
                      },
                      {
                        category: Categories.ANIMALS_NATURE,
                        name: "Động vật",
                      },
                      {
                        category: Categories.FOOD_DRINK,
                        name: "Ẩm thực",
                      },
                      {
                        category: Categories.TRAVEL_PLACES,
                        name: "đi lại & địa điểm",
                      },
                      {
                        category: Categories.ACTIVITIES,
                        name: "Hoạt động",
                      },
                      {
                        category: Categories.OBJECTS,
                        name: "công việc",
                      },
                      {
                        category: Categories.SYMBOLS,
                        name: "Biểu tượng",
                      },
                      {
                        category: Categories.FLAGS,
                        name: "Cờ",
                      },
                    ]}
                  />
                </div>
              </div>
            </div>
            <Button
              variant="outLine-border"
              type="button"
              // disabled={message.length > 0 ? false : true}
              onClick={() => {
                const text = {
                  id: "" + listMessage.length + 1,
                  senderId: "you",
                  receiverId: "me",
                  messageType: "you",
                  text: "you",
                };
                setListMessage([...listMessage, text]);
                setSenderMessage(true);
              }}
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
            "w-10 h-10 rounded-full bg-grayF5 flex justify-center items-center text-orange shadow-md shadow-gray98 cursor-pointer",
            !openScrollDown && "top-0"
          )}
          onClick={() => {
            containerRef.current?.scrollTo({
              top: containerRef.current.scrollHeight,
              behavior: "smooth",
            });
          }}
        >
          <IconDown size={20}></IconDown>
        </Button>
      </div>
    </div>
  );
}

export default Conversation;
