import { useAppSelector } from "@/hook";
import { RootState } from "@/stores";
import useChatContext from "../context/useChatContext";
import { useEffect, useState } from "react";
import { IUser } from "@/types/user.type";
import { useLazyGetProfileQuery } from "@/stores/service/user.service";

function HeaderView() {
  const { selectedConversation, onlineUsers } = useAppSelector(
    (state: RootState) => state.chatSlice
  );

  const { checkConversation, selectedReceiverId } = useChatContext();

  const [getProfile] = useLazyGetProfileQuery();

  const [receiver, setReceiver] = useState<IUser>();
  console.log("receiver: ", receiver);

  useEffect(() => {
    const receiverId =
      checkConversation && selectedConversation
        ? selectedConversation._id
        : selectedReceiverId;
    if (checkConversation) {
      const handleGetMessages = async () => {
        await getProfile(receiverId)
          .unwrap()
          .then((res) => {
            setReceiver(res.user);
          });
      };
      handleGetMessages();
    }
  }, [checkConversation, getProfile, selectedConversation, selectedReceiverId]);

  return (
    <div className="flex gap-x-3 items-center px-3 border-b-1 border-orange py-2 max-h-[50px]">
      <div className="relative">
        {receiver && (
          <img
            alt=""
            srcSet={receiver?.avatar?.url || receiver.avatarDefault}
            className="w-8 h-8 overflow-hidden rounded-full "
          />
        )}
        {onlineUsers.includes("") && (
          <div className="absolute bottom-0 right-0 w-4 h-4 border-2 border-white rounded-full bg-green66"></div>
        )}
      </div>
      <div className="flex flex-col justify-start">
        <p className="text-sm font-semibold">Tin nhắn</p>
        <p className="text-xs text-gray-500">Đang hoạt động</p>
      </div>
    </div>
  );
}

export default HeaderView;
