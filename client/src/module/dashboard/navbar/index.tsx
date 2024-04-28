import { listNavBarItem } from "../../../constant/navbar.dashboard";
import NavbarItem from "./NavbarItem";

function Navbar() {
  return (
    <aside className="px-5 pt-10 fixed left-0 top-[80px] bg-white w-[230px] h-full shadow-[0_60px_60px_-15px_rgba(0,0,0,0.3)]">
      <div className="flex flex-col w-full text-sm font-semibold text-orange gap-y-5">
        {listNavBarItem &&
          listNavBarItem.map(
            (item, index): React.ReactElement => (
              <NavbarItem key={index} value={item}></NavbarItem>
            )
          )}
      </div>
    </aside>
  );
}

export default Navbar;
