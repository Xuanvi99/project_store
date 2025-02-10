import { useAppDispatch, useSelectorChatSlice } from "@/hook";
import { useEffect, useState } from "react";
import { userApi } from "@/stores/service/user.service";
import { momentVi } from "@/utils";
import SkeletonHeader from "../skeleton/SkeletonHeader";
import { LazyLoadImage } from "react-lazy-load-image-component";
function HeaderView() {
  const dispatch = useAppDispatch();

  const { onlineUsers, receiverInfo, receiverId } = useSelectorChatSlice();

  const [timeOffline, setTimeOffline] = useState<string>("");

  useEffect(() => {
    dispatch(userApi.util.invalidateTags([{ type: "Users", id: receiverId }]));
  }, [onlineUsers, receiverId, dispatch]);

  useEffect(() => {
    let updateTimeOff = undefined;
    if (receiverInfo) {
      updateTimeOff = setInterval(() => {
        setTimeOffline(momentVi(receiverInfo.timeOffline).fromNow());
      }, 60000);
    }
    return () => {
      clearInterval(updateTimeOff);
    };
  }, [receiverInfo]);

  if (!receiverInfo) return <SkeletonHeader />;

  return (
    <div className="flex gap-x-3 items-center px-3 border-b-1 border-orange py-2 max-h-[50px]">
      <div className="relative">
        <div className="w-8 h-8 overflow-hidden rounded-full ">
          <LazyLoadImage
            alt="image"
            placeholderSrc={"/public/userName.png"}
            srcSet={receiverInfo.avatar?.url || receiverInfo.avatarDefault}
            effect="blur"
            className="object-cover max-w-full "
            height={32}
            width={32}
            threshold={100}
          />
        </div>
        {onlineUsers.includes(receiverId) && (
          <div className="absolute bottom-0 right-0 w-3 h-3 border-2 border-white rounded-full bg-green66"></div>
        )}
      </div>
      <div className="flex flex-col justify-start">
        <p className="text-[15px] font-semibold">{receiverInfo.userName}</p>
        <div>
          <p className="text-xs text-gray-500">
            {onlineUsers.includes(receiverId)
              ? "Đang hoạt động"
              : "Hoạt động " +
                (timeOffline
                  ? timeOffline
                  : momentVi(receiverInfo.timeOffline).fromNow())}
          </p>
        </div>
      </div>
    </div>
  );
}

export default HeaderView;
