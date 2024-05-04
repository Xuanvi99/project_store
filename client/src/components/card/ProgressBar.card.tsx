import { cn } from "@/utils";

type TProps = {
  sold: number;
  quantity: number;
};

function ProgressBar({ sold, quantity }: TProps) {
  return (
    <div className="relative w-full h-[18px] rounded-lg bg-orangeLinearReverse">
      <div className="w-full h-full absolute inset-0 rounded-lg z-20 overflow-hidden">
        <div
          className={cn("bg-white opacity-40 h-full float-right")}
          style={{ width: `calc(100% - ` + (sold / quantity) * 100 + `%` }}
        ></div>
      </div>
      <img
        alt=""
        srcSet="./flash-sale-progress-bar-fire.png"
        height={18}
        width={21}
        className="absolute left-1 -top-[6px] z-30"
      />
      <div className=" text-white text-xs absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-30">
        Đã bán
        <strong className="ml-1">
          {sold}/{quantity}
        </strong>
      </div>
    </div>
  );
}

export default ProgressBar;
