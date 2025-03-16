import { useHover } from "@/hook";
import { cn } from "@/utils";
import { Fragment, useRef } from "react";

type THoverDropdownProps = {
  content: React.ReactNode;
  children: React.ReactNode;
  className?: {
    container?: string;
    content?: string;
    arrow?: string;
  };
  onClick?: () => void;
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
};
const Tooltip = ({
  content,
  children,
  className,
  onClick,
  place = "top",
}: THoverDropdownProps) => {
  const nodeRef = useRef<HTMLDivElement>(null);
  const { isHover, setIsHover } = useHover(nodeRef);

  const selectCssPlace = (place: string) => {
    switch (place) {
      case "top":
        return {
          content: "bottom-[calc(100%+10px)] left-1/2 -translate-x-1/2 z-50",
          arrow:
            "before:absolute before:hoverDropdown before:-top-[10px] before:left-1/2 before:-translate-x-1/2 before:border-l-transparent before:border-r-transparent before:border-b-transparent before:border-[10px] before:border-t-orange before:z-30",
        };
      case "top-start":
        return {
          content: "bottom-[calc(100%+10px)] -left-5 z-40",
          arrow:
            "before:absolute before:hoverDropdown before:-top-[10px] before:left-1/2 before:-translate-x-1/2 before:border-l-transparent before:border-r-transparent before:border-b-transparent before:border-[10px] before:border-t-orange before:z-30",
        };
      case "top-end":
        return {
          content: "bottom-[calc(100%+10px)] -right-5 z-40",
          arrow:
            "before:absolute before:hoverDropdown before:-top-[10px] before:left-1/2 before:-translate-x-1/2 before:border-l-transparent before:border-r-transparent before:border-b-transparent before:border-[10px] before:border-t-orange before:z-30",
        };

      case "bottom":
        return {
          content: "top-[calc(100%+15px)] left-1/2 -translate-x-1/2 z-40",
          arrow:
            "before:absolute before:hoverDropdown before:-bottom-[15px] before:left-1/2 before:-translate-x-1/2 before:border-l-transparent before:border-r-transparent before:border-t-transparent before:border-[10px] before:border-b-orange before:z-30 ",
        };

      case "bottom-start":
        return {
          content: "top-[calc(100%+15px)] -left-5 z-40",
          arrow:
            "before:absolute before:hoverDropdown before:-bottom-[15px] before:left-1/2 before:-translate-x-1/2 before:border-l-transparent before:border-r-transparent before:border-t-transparent before:border-[10px] before:border-b-orange before:z-30",
        };
      case "bottom-end":
        return {
          content: "top-[calc(100%+15px)] -right-5 z-40",
          arrow:
            "before:absolute before:hoverDropdown before:-bottom-[15px] before:left-1/2 before:-translate-x-1/2 before:border-l-transparent before:border-r-transparent before:border-t-transparent before:border-[10px] before:border-b-orange before:z-30",
        };

      case "left":
        return {
          content: "right-[calc(100%+5px)] top-1/2 -translate-y-1/2 z-40",
          arrow:
            "before:absolute before:hoverDropdown before:-left-[20%] before:top-1/2 before:-translate-y-1/2 before:border-t-transparent before:border-r-transparent before:border-b-transparent before:border-[10px] before:border-l-orange before:z-30",
        };
      case "left-start":
        return {
          content: "right-[calc(100%+5px)] -top-5 z-40",
          arrow:
            "before:absolute before:hoverDropdown before:-left-[20%] before:top-1/2 before:-translate-y-1/2 before:border-t-transparent before:border-r-transparent before:border-b-transparent before:border-[10px] before:border-l-orange before:z-30",
        };
      case "left-end":
        return {
          content: "right-[calc(100%+5px)] -bottom-5 z-40",
          arrow:
            "before:absolute before:hoverDropdown before:-left-[20%] before:top-1/2 before:-translate-y-1/2 before:border-t-transparent before:border-r-transparent before:border-b-transparent before:border-[10px] before:border-l-orange before:z-30",
        };

      case "right":
        return {
          content: "left-[calc(100%+5px)] top-1/2 -translate-y-1/2 z-40",
          arrow:
            "before:absolute before:hoverDropdown before:-right-[20%] before:top-1/2 before:-translate-y-1/2 before:border-t-transparent before:border-l-transparent before:border-b-transparent before:border-[10px] before:border-r-orange before:z-30",
        };
      case "right-start":
        return {
          content: "left-[calc(100%+5px)] -top-5 z-40",
          arrow:
            "before:absolute before:hoverDropdown before:-right-[20%] before:top-1/2 before:-translate-y-1/2 before:border-t-transparent before:border-l-transparent before:border-b-transparent before:border-[10px] before:border-r-orange before:z-30",
        };
      case "right-end":
        return {
          content: "left-[calc(100%+5px)] -bottom-5 z-40",
          arrow:
            "before:absolute before:hoverDropdown before:-right-[20%] before:top-1/2 before:-translate-y-1/2 before:border-t-transparent before:border-l-transparent before:border-b-transparent before:border-[10px] before:border-r-orange before:z-30",
        };
      default:
        break;
    }
  };

  return (
    <div
      onClick={() => {
        if (onClick) {
          onClick();
          setIsHover(false);
        }
      }}
      className={cn(
        "relative transition-all cursor-pointer",
        className?.container
      )}
      ref={nodeRef}
    >
      {isHover && (
        <Fragment>
          <div
            className={cn(
              "absolute transition-all rounded-lg z-40 hoverDropdown shadow-shadow2",
              "flex flex-col p-2 gap-y-2 border-1 border-orange bg-white",
              selectCssPlace(place)?.content,
              className?.content
            )}
          >
            {content}
          </div>
          <div
            className={cn(
              "arrow before:z-50",
              selectCssPlace(place)?.arrow,
              className?.arrow
            )}
          />
        </Fragment>
      )}
      {children}
    </div>
  );
};

export default Tooltip;
