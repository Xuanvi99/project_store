import HeaderRoom from "./header";
import ListRoom from "./listRoom";
import SearchRoom from "./search";
import SideBarChat from "./sidebar";
function RoomChat() {
  return (
    <aside className="flex w-full h-full overflow-hidden bg-white rounded-lg basis-1/3">
      {/* <div className="basis-1/5 border-r-1 border-orange">
        <SideBarChat></SideBarChat>
      </div> */}
      <div className="flex flex-col w-full p-3 gap-y-2">
        <HeaderRoom></HeaderRoom>
        <SearchRoom></SearchRoom>
        <ListRoom></ListRoom>
      </div>
    </aside>
  );
}

export default RoomChat;
