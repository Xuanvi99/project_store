import { useRef } from "react";
import { useHover } from "../../hook";
import { cn } from "../../utils";

type THoverDropdownProps = {
  select: React.ReactNode;
  children: React.ReactNode;
  className?: {
    select?: string;
    option?: string;
  };
};
const HoverDropdown = ({
  select,
  children,
  className,
}: THoverDropdownProps) => {
  const nodeRef = useRef<HTMLDivElement>(null);
  const { isHover } = useHover(nodeRef);
  return (
    <div
      className={cn(
        "relative px-2 transition-all cursor-pointer ",
        isHover &&
          "before:absolute before:top-[60%] before:left-1/2 before:-translate-x-1/2 before:border-l-transparent before:border-r-transparent before:border-t-transparent before:border-[15px] before:border-b-orange before:hoverDropdown",
        className?.select
      )}
      ref={nodeRef}
    >
      {select}
      {isHover && children}
    </div>
  );
};

export default HoverDropdown;
