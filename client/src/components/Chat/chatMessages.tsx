import { IMessage, IReqSendMessageText } from "@/types/chat.type";
import { LoadingCallApi } from "../loading";
import { cn } from "@/utils";
import { useSelectorChatSlice } from "@/hook";
import { forwardRef } from "react";
import { IUser } from "@/types/user.type";
import DisplayMessages from "./DisplayMessages";
import DisplayWaitMessages from "./DisplayWaitMessages";
import DisplayTyping from "./DisplayTyping";
import DisplayInfoReceiver from "./DisplayInfoReceiver";

type TProps = {
  messages: IMessage<IUser>[];
  waitMessages: IReqSendMessageText[];
  isFetchingData: boolean;
  isDisplayTyping: boolean;
  receiverSeenCvs: boolean;
};

const ChatMessages = forwardRef<HTMLDivElement, TProps>(
  (props, containerRef) => {
    const { selectedConversation, receiverInfo } = useSelectorChatSlice();

    const {
      messages,
      isFetchingData,
      isDisplayTyping,
      receiverSeenCvs,
      waitMessages,
    } = props;

    const LoadingDataMessageOld = () => {
      return (
        selectedConversation &&
        messages.length > 0 &&
        messages.length < selectedConversation.totalMessage &&
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

    if (!receiverInfo) return;

    return (
      <div
        ref={containerRef}
        className="flex flex-col justify-between h-full px-3 pt-3 overflow-y-scroll bg-white message_list "
      >
        <FetchingDataMessagesFirst />

        <LoadingDataMessageOld />

        <DisplayInfoReceiver amountMsg={messages.length} />

        <DisplayMessages
          messages={messages}
          receiverInfo={receiverInfo}
          waitMessages={waitMessages}
          receiverSeenCvs={receiverSeenCvs}
        />

        <DisplayWaitMessages waitMessages={waitMessages} />

        <DisplayTyping
          receiverInfo={receiverInfo}
          isDisplayTyping={isDisplayTyping}
        />
      </div>
    );
  }
);

export default ChatMessages;
