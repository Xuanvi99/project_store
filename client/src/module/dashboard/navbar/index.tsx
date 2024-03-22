import { IconNavBar } from "../../../components/icon";
import NavbarItem from "./NavbarItem";

const size = 30;
const listNavBarItem = [
  {
    icon: <IconNavBar.product size={size} />,
    title: "Sản phẩm",
    path: "/dashboard/product",
  },
  {
    icon: <IconNavBar.comment size={size} />,
    title: "Bình Luận",
    path: "/dashboard/comment",
  },
];

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
