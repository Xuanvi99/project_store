import RoomChat from "./room";
import ViewChat from "./view";

function Message() {
  return (
    <div className="w-full h-[calc(100vh-60px)] ">
      <div className="flex w-full h-full p-3 shadow-lg gap-x-3 bg-grayCa">
        <RoomChat></RoomChat>
        <ViewChat></ViewChat>
      </div>
    </div>
  );
}

export default Message;
