import { useSelectorAuthSlice, useSelectorChatSlice } from "@/hook";
import { useCallback, useLayoutEffect, useState } from "react";
import { IUser } from "@/types/user.type";
import { useLazyGetProfileQuery } from "@/stores/service/user.service";
import { momentVi } from "@/utils";
import SkeletonHeader from "../skeleton/SkeletonHeader";
function HeaderView() {
  const { user } = useSelectorAuthSlice();

  const { onlineUsers, selectedConversation } = useSelectorChatSlice();

  const [getProfile] = useLazyGetProfileQuery();

  const [receiver, setReceiver] = useState<IUser>();

  const handleGetReceiver = useCallback(async () => {
    if (selectedConversation && user) {
      try {
        const receiverId = selectedConversation?.participants.find(
          (r) => r !== user?._id
        );
        if (receiverId) {
          await getProfile(receiverId)
            .unwrap()
            .then((res) => {
              setReceiver(res.user);
            });
        }
      } catch (error) {
        console.log(error);
      }
    }
  }, [getProfile, selectedConversation, user]);

  useLayoutEffect(() => {
    handleGetReceiver();
  }, [handleGetReceiver]);

  if (!receiver) return <SkeletonHeader></SkeletonHeader>;

  return (
    <div className="flex gap-x-3 items-center px-3 border-b-1 border-orange py-2 max-h-[50px]">
      <div className="relative">
        {receiver && (
          <img
            alt=""
            srcSet={receiver.avatar?.url || receiver.avatarDefault}
            className="w-8 h-8 overflow-hidden rounded-full "
          />
        )}
        {onlineUsers.includes(receiver._id) && (
          <div className="absolute bottom-0 right-0 w-3 h-3 border-2 border-white rounded-full bg-green66"></div>
        )}
      </div>
      <div className="flex flex-col justify-start">
        <p className="text-[15px] font-semibold">{receiver.userName}</p>
        <div>
          <p className="text-xs text-gray-500">
            {onlineUsers.includes(receiver._id)
              ? "Đang hoạt động"
              : "Hoạt động " + momentVi(receiver.timeOffline).fromNow()}
          </p>
        </div>
      </div>
    </div>
  );
}

export default HeaderView;
