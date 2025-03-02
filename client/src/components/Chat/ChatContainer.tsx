import { ChatProvider } from "./context";
import ChatViewMessages from "./ChatViewMessages";
import ChatSendMessage from "./ChatSendMessage";

function ChatContainer() {
  return (
    <main className="flex flex-col justify-end w-full h-full conversation">
      <ChatProvider>
        <ChatViewMessages />
        <ChatSendMessage />
      </ChatProvider>
    </main>
  );
}

export default ChatContainer;
