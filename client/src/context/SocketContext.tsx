import { useAppSelector } from "@/hook";
import { RootState } from "@/stores";
import { createContext, useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";
const DOMAIN_SERVER = import.meta.env.VITE_DOMAIN_SERVER;

export type TSocketProvider = Socket | null;

const SocketContext = createContext<TSocketProvider>(null);

const SocketProvider = ({ children }: { children: React.ReactNode }) => {
  const { user, isLogin, accessToken } = useAppSelector(
    (state: RootState) => state.authSlice
  );

  const socketRef = useRef<TSocketProvider>(null);

  const [socketIo, setSocketIo] = useState<Socket | null>(null);

  useEffect(() => {
    if (user && isLogin) {
      socketRef.current = io(DOMAIN_SERVER, {
        transports: ["websocket"],
        withCredentials: true,
        auth: {
          accessToken: accessToken,
        },
      });

      socketRef.current.on("connect", () => {
        console.log("Connected to server");
      });

      socketRef.current.on("disconnect", () => {
        console.log("Disconnected to server");
      });

      setSocketIo(socketRef.current);
    } else {
      setSocketIo(null);
    }
    return () => {
      socketRef.current?.disconnect();
    };
  }, [accessToken, isLogin, user]);

  return (
    <SocketContext.Provider value={socketIo}>{children}</SocketContext.Provider>
  );
};

export { SocketContext, SocketProvider };
