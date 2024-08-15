import { listNavBarItem } from "../../../constant/sidebar.dashboard";
import SidebarItem from "./SidebarItem";

function Sidebar() {
  return (
    <aside className="px-5 pt-5 fixed left-0 top-[80px] bg-white w-[250px] border-r-1 border-r-grayE5 h-full shadow-[0_20px_60px_-10px_rgba(0,0,0,0.3)]">
      <div className="flex flex-col w-full text-sm font-semibold text-orange gap-y-3">
        {listNavBarItem &&
          listNavBarItem.map(
            (item, index): React.ReactElement => (
              <SidebarItem key={index} value={item}></SidebarItem>
            )
          )}
      </div>
    </aside>
  );
}

export default Sidebar;
