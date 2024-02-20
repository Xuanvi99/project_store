import { ReactElement } from "react";
import { NavLink } from "react-router-dom";
import { cn } from "../../../utils";
type TNavItemProps = {
  data: {
    title: string;
    path: string;
    icon: ReactElement;
  };
};
const NavItem = ({ data }: TNavItemProps) => {
  const { title, path, icon } = data;
  return (
    <NavLink
      to={path}
      className={({ isActive }) =>
        (isActive ? "text-orange" : "") +
        " " +
        cn("flex items-center gap-x-2 text-lg hover:text-orange")
      }
    >
      <span>{icon}</span>
      <span>{title}</span>
    </NavLink>
  );
};

export default NavItem;
