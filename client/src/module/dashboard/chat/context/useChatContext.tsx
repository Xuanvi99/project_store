import useTestContext from "@/hook/useTestContext";
import { ChatContext, TChatProvider } from "@/module/dashboard/chat/context";

export default function useChatContext() {
  return useTestContext<TChatProvider>(
    ChatContext as React.Context<TChatProvider>
  );
}
