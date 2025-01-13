import { useHover } from "@/hook";
import { cn } from "@/utils";
import { useRef } from "react";

type THoverDropdownProps = {
  title: React.ReactNode;
  children: React.ReactNode;
  className?: {
    container?: string;
    content?: string;
  };
  place:
    | "top"
    | "top-start"
    | "top-end"
    | "bottom"
    | "bottom-start"
    | "bottom-end"
    | "left"
    | "left-start"
    | "left-end"
    | "right"
    | "right-start"
    | "right-end";
  onClick?: () => void;
};
const Tooltip = ({
  title,
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
          content: "bottom-[calc(100%+15px)] left-1/2 -translate-x-1/2",
          arrow:
            "before:absolute before:hoverDropdown before:-top-[15px] before:left-1/2 before:-translate-x-1/2 before:border-l-transparent before:border-r-transparent before:border-b-transparent before:border-[15px] before:border-t-orange",
        };
      case "top-start":
        return {
          content: "bottom-[calc(100%+15px)] -left-5",
          arrow:
            "before:absolute before:hoverDropdown before:-top-[15px] before:left-1/2 before:-translate-x-1/2 before:border-l-transparent before:border-r-transparent before:border-b-transparent before:border-[15px] before:border-t-orange",
        };
      case "top-end":
        return {
          content: "bottom-[calc(100%+15px)] -right-5",
          arrow:
            "before:absolute before:hoverDropdown before:-top-[15px] before:left-1/2 before:-translate-x-1/2 before:border-l-transparent before:border-r-transparent before:border-b-transparent before:border-[15px] before:border-t-orange",
        };

      case "bottom":
        return {
          content: "top-[calc(100%+15px)] left-1/2 -translate-x-1/2",
          arrow:
            "before:absolute before:hoverDropdown before:-bottom-[15px] before:left-1/2 before:-translate-x-1/2 before:border-l-transparent before:border-r-transparent before:border-t-transparent before:border-[15px] before:border-b-orange ",
        };

      case "bottom-start":
        return {
          content: "top-[calc(100%+15px)] -left-5",
          arrow:
            "before:absolute before:hoverDropdown before:-bottom-[15px] before:left-1/2 before:-translate-x-1/2 before:border-l-transparent before:border-r-transparent before:border-t-transparent before:border-[15px] before:border-b-orange ",
        };
      case "bottom-end":
        return {
          content: "top-[calc(100%+15px)] -right-5",
          arrow:
            "before:absolute before:hoverDropdown before:-bottom-[15px] before:left-1/2 before:-translate-x-1/2 before:border-l-transparent before:border-r-transparent before:border-t-transparent before:border-[15px] before:border-b-orange ",
        };

      case "left":
        return {
          content: "right-[calc(100%+10px)] top-1/2 -translate-y-1/2",
          arrow:
            "before:absolute before:hoverDropdown before:-left-[20%] before:top-1/2 before:-translate-y-1/2 before:border-t-transparent before:border-r-transparent before:border-b-transparent before:border-[15px] before:border-l-orange",
        };
      case "left-start":
        return {
          content: "right-[calc(100%+10px)] -top-5",
          arrow:
            "before:absolute before:hoverDropdown before:-left-[20%] before:top-1/2 before:-translate-y-1/2 before:border-t-transparent before:border-r-transparent before:border-b-transparent before:border-[15px] before:border-l-orange",
        };
      case "left-end":
        return {
          content: "right-[calc(100%+10px)] -bottom-5",
          arrow:
            "before:absolute before:hoverDropdown before:-left-[20%] before:top-1/2 before:-translate-y-1/2 before:border-t-transparent before:border-r-transparent before:border-b-transparent before:border-[15px] before:border-l-orange",
        };

      case "right":
        return {
          content: "left-[calc(100%+10px)] top-1/2 -translate-y-1/2",
          arrow:
            "before:absolute before:hoverDropdown before:-right-[20%] before:top-1/2 before:-translate-y-1/2 before:border-t-transparent before:border-l-transparent before:border-b-transparent before:border-[15px] before:border-r-orange",
        };
      case "right-start":
        return {
          content: "left-[calc(100%+10px)] -top-5",
          arrow:
            "before:absolute before:hoverDropdown before:-right-[20%] before:top-1/2 before:-translate-y-1/2 before:border-t-transparent before:border-l-transparent before:border-b-transparent before:border-[15px] before:border-r-orange",
        };
      case "right-end":
        return {
          content: "left-[calc(100%+10px)] -bottom-5",
          arrow:
            "before:absolute before:hoverDropdown before:-right-[20%] before:top-1/2 before:-translate-y-1/2 before:border-t-transparent before:border-l-transparent before:border-b-transparent before:border-[15px] before:border-r-orange",
        };
      default:
        break;
    }
  };

  return (
    <div
      onClick={onClick}
      className={cn(
        "relative transition-all cursor-pointer ",
        className?.container
      )}
      ref={nodeRef}
    >
      {isHover && (
        <div
          className={cn(
            "absolute transition-all border-1 rounded-lg z-40 hoverDropdown shadow-shadowButton",
            "flex flex-col p-2 gap-y-2 border-orange bg-white",
            selectCssPlace(place)?.content,
            className?.content
          )}
        >
          {title}
        </div>
      )}
      {isHover && (
        <div
          className={cn("arrow before:z-50", selectCssPlace(place)?.arrow)}
        ></div>
      )}
      {}
      {children}
    </div>
  );
};

export default Tooltip;
