import { NavLink } from "react-router-dom";
import { cn } from "../../../utils";

type TProps = {
  value: { icon: React.ReactElement; title: string; path: string };
};

function NavbarItem({ value }: TProps) {
  const { icon, path, title } = value;
  return (
    <NavLink
      to={path}
      className={({ isActive }) =>
        cn(
          "flex items-center gap-x-5 justify-start px-3  py-2 rounded-lg ",
          isActive ? "bg-orangeLinear text-white" : ""
        )
      }
    >
      {icon}
      <span>{title}</span>
    </NavLink>
  );
}

export default NavbarItem;
