import { useSelectorChatSlice } from "@/hook";

import { momentVi } from "@/utils";

function DisplayInfoReceiver({ amountMsg = -1 }: { amountMsg: number }) {
  const { selectedConversation, receiverInfo } = useSelectorChatSlice();

  if (!receiverInfo || !selectedConversation || amountMsg > 30) {
    return null;
  }

  return (
    <div className="flex flex-col items-center py-2">
      <div className="w-16 h-16 overflow-hidden rounded-full">
        <img
          alt="error"
          srcSet={receiverInfo.avatar?.url || receiverInfo.avatarDefault}
          className="object-cover"
        />
      </div>
      <div className="flex flex-col items-center mt-2 gap-y-1">
        <span className="text-lg font-semibold">{receiverInfo.userName}</span>
        {receiverInfo.email && (
          <span className="text-xs text-gray-500">
            Email: <span className="font-semibold">{receiverInfo.email}</span>
          </span>
        )}
        {receiverInfo.phone && (
          <span className="text-xs text-gray-500">
            SĐT: <span className="font-semibold">{receiverInfo.phone}</span>
          </span>
        )}
        <span className="text-xs text-gray-500">
          Ngày đăng ký:{" "}
          <span className="font-semibold">
            {momentVi(receiverInfo.createdAt).format("L")}
          </span>
        </span>
      </div>
    </div>
  );
}

export default DisplayInfoReceiver;
