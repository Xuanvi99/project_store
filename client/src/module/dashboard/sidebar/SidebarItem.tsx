import { Link, useLocation, useNavigate } from "react-router-dom";
import { cn } from "../../../utils";
import IconRightArrow from "@/components/icon/IconRightArrow";
import { useState } from "react";
import { IconDown } from "@/components/icon";

type TProps = {
  value: {
    icon: React.ReactElement;
    title: string;
    path: string;
    children: { title: string; path: string }[] | [];
  };
};

function SidebarItem({ value }: TProps) {
  const { icon, path, title, children } = value;
  const { pathname } = useLocation();
  const [active, setActive] = useState<boolean>(pathname.includes(path));
  const navigate = useNavigate();
  return (
    <>
      <div
        className={cn(
          "flex items-center justify-between px-3 py-2 rounded-lg cursor-pointer",
          pathname.includes(path) ? "bg-orangeLinear text-white" : ""
        )}
        onClick={() => {
          if (children.length > 0) {
            setActive(!active);
          } else {
            navigate(path);
          }
        }}
      >
        <div className="flex gap-x-2">
          <span>{icon}</span>
          <span>{title}</span>
        </div>
        {children.length !== 0 && (
          <span className={active ? "rotate-180" : "rotate-0"}>
            <IconDown></IconDown>
          </span>
        )}
      </div>
      {active && children && children.length > 0 && (
        <div className="flex flex-col gap-y-4 text-gray text-xs font-normal">
          {children.map((item, index) => {
            return (
              <Link
                to={item.path}
                key={index}
                className={cn(
                  "grid grid-cols-[20px_auto] gap-x-2 px-3 hover:text-orange hover:underline place-items-center",
                  pathname.includes(item.path) && "text-orange underline"
                )}
              >
                {pathname.includes(item.path) ? (
                  <span className="flex items-center">
                    <IconRightArrow size={14}></IconRightArrow>
                  </span>
                ) : (
                  <span className="w-1 h-1 rounded-full bg-gray"></span>
                )}
                <span className="w-full col-start-2 col-end-3">
                  {item.title}
                </span>
              </Link>
            );
          })}
        </div>
      )}
    </>
  );
}

export default SidebarItem;
