import { IconMessage } from "@/components/icon";

function NoConversation() {
  return (
    <div className="flex flex-col w-full overflow-hidden bg-white rounded-md basis-[70%] h-full justify-center items-center text-orange">
      <span>
        <IconMessage size={70} />
      </span>
      <span className="text-sm font-semibold text-center">
        Hãy chọn cuộc trò chuyện hoặc bắt đầu cuộc trò chuyện mới
      </span>
    </div>
  );
}

export default NoConversation;
