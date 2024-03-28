import { listNavBarItem } from "../../../constant/navbar.dashboard";
import NavbarItem from "./NavbarItem";

function Navbar() {
  return (
    <aside className="px-5 pt-10 bg-white basis-1/5">
      <div className="flex flex-col w-full text-lg font-semibold text-orange gap-y-5">
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
