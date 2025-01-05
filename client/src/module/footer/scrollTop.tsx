import { IconChevronLeft } from "@/components/icon";
import { cn } from "@/utils";

function ScrollTop() {
  return (
    <div
      onClick={() => {
        window.scrollTo({ behavior: "smooth", top: 0 });
      }}
      className={cn(
        "fixed z-40 right-5 bottom-20 cursor-pointer",
        "flex items-center justify-center w-10 h-10 border-2 rounded-lg text-orange  border-orange",
        "hover:bg-orange hover:text-white "
      )}
    >
      <span className="rotate-90">
        <IconChevronLeft size={20}></IconChevronLeft>
      </span>
    </div>
  );
}

export default ScrollTop;
