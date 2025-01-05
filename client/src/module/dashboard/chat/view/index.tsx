import Conversation from "@/components/Chat/conversation";
import HeaderView from "./header";

function ViewChat() {
  return (
    <div className="flex flex-col w-full overflow-hidden bg-white rounded-md basis-2/3">
      <HeaderView></HeaderView>
      <Conversation></Conversation>
    </div>
  );
}

export default ViewChat;
