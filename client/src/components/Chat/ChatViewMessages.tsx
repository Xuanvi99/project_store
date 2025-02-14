import { IMessage, IReqSendMessageText } from "@/types/chat.type";
import { LoadingCallApi } from "../loading";
import { cn } from "@/utils";
import { useSelectorChatSlice } from "@/hook";
import { forwardRef } from "react";
import { IUser } from "@/types/user.type";
import DisplayMessages from "./chat_View_Messages/DisplayMessages";
import DisplayWaitMessages from "./chat_View_Messages/DisplayWaitMessages";
import DisplayTyping from "./chat_View_Messages/DisplayTyping";
import DisplayInfoReceiver from "./chat_View_Messages/DisplayInfoReceiver";

type TProps = {
  messages: IMessage<IUser>[];
  waitMessages: IReqSendMessageText[];
  isFetchingData: boolean;
  isDisplayTyping: boolean;
  receiverSeenCvs: boolean;
  openScrollY: boolean;
};

const ChatViewMessages = forwardRef<HTMLDivElement, TProps>(
  (props, containerRef) => {
    const { totalMessage } = useSelectorChatSlice();

    const {
      messages,
      isFetchingData,
      isDisplayTyping,
      receiverSeenCvs,
      waitMessages,
      openScrollY,
    } = props;

    const LoadingDataMessageOld = () => {
      return (
        messages.length > 0 &&
        messages.length < totalMessage &&
        isFetchingData && (
          <div className={cn("w-full max-h-16 flex justify-center")}>
            <div className="w-10 h-10">
              <LoadingCallApi />
            </div>
          </div>
        )
      );
    };

    const FetchingDataMessagesFirst = () => {
      return (
        messages.length === 0 &&
        isFetchingData && (
          <div
            className={cn("flex flex-col justify-center items-center h-full")}
          >
            <div className="w-10 h-10">
              <LoadingCallApi />
            </div>
          </div>
        )
      );
    };

    return (
      <div
        ref={containerRef}
        className={cn(
          "flex flex-col h-full px-3 pt-3 bg-white message_list ",
          openScrollY && "overflow-y-scroll"
        )}
      >
        <FetchingDataMessagesFirst />

        <LoadingDataMessageOld />

        {!isFetchingData && <DisplayInfoReceiver amountMsg={messages.length} />}

        <DisplayMessages
          messages={messages}
          waitMessages={waitMessages}
          receiverSeenCvs={receiverSeenCvs}
        />

        <DisplayWaitMessages waitMessages={waitMessages} />

        <DisplayTyping isDisplayTyping={isDisplayTyping} />
      </div>
    );
  }
);

export default ChatViewMessages;
