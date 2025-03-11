import { ChatProvider } from "./context";
import ChatViewMessages from "./ChatViewMessages";
import ChatSendMessage from "./chatSendMessage";

function ChatContainer() {
  return (
    <main className="flex flex-col justify-end h-[calc(100%-50px)] w-full conversation">
      <ChatProvider>
        <ChatViewMessages />
        <ChatSendMessage />
      </ChatProvider>
    </main>
  );
}

export default ChatContainer;
