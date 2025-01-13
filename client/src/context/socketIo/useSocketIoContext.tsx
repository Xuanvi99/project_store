import useTestContext from "@/hook/useTestContext";
import { SocketContext, TSocketProvider } from "./SocketContext";

export default function useSocketIoContext() {
  return useTestContext<TSocketProvider>(
    SocketContext as React.Context<TSocketProvider>
  );
}
