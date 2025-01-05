import { Link } from "react-router-dom";
import { listNavBarItem } from "../../../constant/sidebar.dashboard";
import SidebarItem from "./SidebarItem";

function Sidebar() {
  return (
    <aside className="px-5 fixed left-0 top-0 bg-grayDark w-[250px] border-r-1 border-r-orange h-full shadow-[0_20px_60px_-10px_rgba(0,0,0,0.3)]">
      <Link
        to={"/"}
        className="h-[60px] flex items-center justify-center cursor-pointer gap-x-2 basis-1/6"
      >
        <img alt="" srcSet="/logo.png" loading="lazy" width={30} />
        <span className="text-xl font-bold whitespace-nowrap text-orange">
          XVStore
        </span>
      </Link>
      <div className="flex flex-col w-full text-sm font-semibold text-orange gap-y-3 mt-4">
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
