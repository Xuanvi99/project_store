import { IconNotification } from "@/components/icon";
import { cn } from "@/utils";
import Tooltip from "@/components/tooltip";

function Notification() {
  return (
    <Tooltip
      place="bottom"
      select={<IconNotification size={30} quantity={0}></IconNotification>}
      className={{
        content: "-translate-x-3/4",
      }}
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
    </Tooltip>
  );
}

export default Notification;
