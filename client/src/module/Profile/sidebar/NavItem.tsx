import { ReactElement } from "react";
import { Link } from "react-router-dom";
import { cn } from "../../../utils";
type TNavItemProps = {
  data: {
    title: string;
    path: string;
    icon: ReactElement;
  };
  activePath: boolean;
};
const NavItem = ({ data, activePath }: TNavItemProps) => {
  const { title, path, icon } = data;
  return (
    <Link
      to={path}
      className={cn(
        activePath ? "text-orange" : "",
        "flex items-center gap-x-2 text-lg hover:text-orange"
      )}
    >
      <span>{icon}</span>
      <span>{title}</span>
    </Link>
  );
};

export default NavItem;
