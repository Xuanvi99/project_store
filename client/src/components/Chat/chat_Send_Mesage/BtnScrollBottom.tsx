import { Button } from "@/components/button";
import { IconArrowDown } from "@/components/icon";
import { useSelectorAuthSlice, useSelectorChatSlice } from "@/hook";
import { useGetUnreadMessageQuery } from "@/stores/service/chat.service";
import { cn } from "@/utils";
import { useEffect, useState } from "react";

type TProps = {
  openBtnScrollDown: boolean;
  handleBtnScrollToBottom: () => void;
};
function BtnScrollBottom({
  openBtnScrollDown,
  handleBtnScrollToBottom,
}: TProps) {
  const { selectedConversation } = useSelectorChatSlice();
  const { user } = useSelectorAuthSlice();

  const [amountUnreadMessage, setAmountUnreadMessage] = useState<number>(0);

  const { data: dataUnreadMessage, status } = useGetUnreadMessageQuery(
    {
      conversationId: selectedConversation?._id || "",
      userId: user?._id || "",
    },
    { skip: !selectedConversation || !user }
  );

  useEffect(() => {
    if (dataUnreadMessage && status === "fulfilled") {
      setAmountUnreadMessage(dataUnreadMessage.amount);
    }
  }, [dataUnreadMessage, status]);

  return (
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
  );
}

export default BtnScrollBottom;
