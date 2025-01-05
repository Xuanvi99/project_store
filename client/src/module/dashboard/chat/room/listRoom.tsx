import { SocketContext, TSocketProvider } from "@/context/SocketContext";
import { useAppSelector } from "@/hook";
import useTestContext from "@/hook/useTestContext";
import { RootState } from "@/stores";
import { IRoomChat } from "@/types/chat.type";
import { cn } from "@/utils";
import { useEffect, useRef, useState } from "react";
import { IUser } from "../../../../types/user.type";

function ListRoom() {
  const user = useAppSelector((state: RootState) => state.authSlice.user);

  const socketIo_client = useTestContext<TSocketProvider>(
    SocketContext as React.Context<TSocketProvider>
  );

  const [listRoomChat, setListRoomChat] = useState<IRoomChat<IUser>[]>([]);

  const listRoomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (socketIo_client) {
      socketIo_client.on("listRoomChat", (data) => {
        setListRoomChat(data as IRoomChat<IUser>[]);
      });
    }
  }, [socketIo_client]);

  return (
    <div
      ref={listRoomRef}
      className={cn(
        "w-full h-full flex flex-col gap-y-2 overflow-y-scroll mt-auto "
      )}
    >
      {user &&
        listRoomChat.length > 0 &&
        listRoomChat.map((roomChat) => {
          const { participants } = roomChat;
          let receiver: IUser | null = null;
          for (let index = 0; index < participants.length; index++) {
            if (participants[index].role === "buyer") {
              receiver = participants[index];
              break;
            }
          }
          return (
            <div
              key={roomChat._id}
              className="flex items-center space-x-2 min-h-[50px]  transition-all px-2 cursor-pointer"
            >
              <div className="w-10 h-10 overflow-hidden rounded-full">
                <img
                  alt=""
                  srcSet={receiver?.avatar?.url || receiver?.avatarDefault}
                />
              </div>
              <div className="text-xs">
                <span className="font-semibold">{receiver?.userName}</span>
              </div>
            </div>
          );
        })}
    </div>
  );
}

export default ListRoom;
