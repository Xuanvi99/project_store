import { useHover } from "@/hook";
import { cn } from "@/utils";
import { useRef } from "react";

type THoverDropdownProps = {
  select: React.ReactNode;
  children: React.ReactNode;
  className?: {
    select?: string;
    content?: string;
  };
  place: "top" | "bottom" | "left" | "right";
  onClick?: () => void;
};
const Tooltip = ({
  select,
  children,
  className,
  onClick,
  place = "top",
}: THoverDropdownProps) => {
  const nodeRef = useRef<HTMLDivElement>(null);
  const { isHover } = useHover(nodeRef);

  const selectCssPlace = (place: string) => {
    switch (place) {
      case "top":
        return {
          select:
            " before:absolute before:hoverDropdown before:-top-[15px] before:left-1/2 before:-translate-x-1/2 before:border-l-transparent before:border-r-transparent before:border-b-transparent before:border-[15px] before:border-t-orange",
          content: "bottom-[calc(100%+15px)] left-1/2 -translate-x-1/2",
        };

      case "bottom":
        return {
          select:
            "before:absolute before:hoverDropdown before:-bottom-[15px] before:left-1/2 before:-translate-x-1/2 before:border-l-transparent before:border-r-transparent before:border-t-transparent before:border-[15px] before:border-b-orange ",
          content: "top-[calc(100%+15px)] left-1/2 -translate-x-1/2",
        };

      case "left":
        return {
          select:
            "before:absolute before:hoverDropdown before:-left-[20%] before:top-1/2 before:-translate-y-1/2 before:border-t-transparent before:border-r-transparent before:border-b-transparent before:border-[15px] before:border-l-orange",
          content: "right-[calc(100%+10px)] top-1/2 -translate-y-1/2",
        };

      case "right":
        return {
          select:
            "before:absolute before:hoverDropdown before:-right-[20%] before:top-1/2 before:-translate-y-1/2 before:border-t-transparent before:border-l-transparent before:border-b-transparent before:border-[15px] before:border-r-orange",
          content: "left-[calc(100%+10px)] top-1/2 -translate-y-1/2",
        };

      default:
        break;
    }
  };

  return (
    <div
      onClick={onClick}
      className={cn(
        "relative px-2 transition-all  cursor-pointer",
        isHover && selectCssPlace(place)?.select,
        className?.select
      )}
      ref={nodeRef}
    >
      {select}
      {isHover && (
        <div
          className={cn(
            "absolute transition-all border-2 rounded-lg z-50 hoverDropdown",
            "border-orange bg-white shadow-shadowButton",
            "flex flex-col p-2 gap-y-2",
            selectCssPlace(place)?.content,
            className?.content
          )}
        >
          {children}
        </div>
      )}
    </div>
  );
};

export default Tooltip;
