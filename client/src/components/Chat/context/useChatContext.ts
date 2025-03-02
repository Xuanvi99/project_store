import useTestContext from "@/hook/useTestContext";
import React from "react";
import { ChatContext, TChatProvider } from ".";

export default function useChatContext() {
  return useTestContext<TChatProvider>(
    ChatContext as React.Context<TChatProvider>
  );
}
