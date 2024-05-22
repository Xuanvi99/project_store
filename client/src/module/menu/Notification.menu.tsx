import { IconNotification } from "@/components/icon";
import HoverDropdown from "./HoverDropdown";
import { cn } from "@/utils";

function Notification() {
  return (
    <HoverDropdown
      select={<IconNotification size={30} quantity={0}></IconNotification>}
    >
      <div
        className={cn(
          "absolute top-[160%] left-2/4 transition-all -translate-x-3/4 border-2 max-w-[420px] rounded-lg z-50 hoverDropdown",
          "border-orange bg-white shadow-shadowButton",
          "flex flex-col p-2 gap-y-2"
        )}
      >
        <div
          className={cn(
            "flex flex-col items-center max-h-[174px] justify-start w-full gap-y-3"
          )}
        >
          <div className="text-xs text-gray w-[200px] h-[200px] flex flex-col justify-center items-center gap-y-3">
            <img alt="" srcSet="/notify_notFound.png" className="w-10" />
            <p>Hiện không có thông báo nào</p>
          </div>
        </div>
      </div>
    </HoverDropdown>
  );
}

export default Notification;
