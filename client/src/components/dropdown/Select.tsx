import { forwardRef } from "react";
import { cn } from "../../utils";

type TSelectProps = {
  children: React.ReactNode;
  className?: string;
  onClick: () => void;
};

type TSelectRef = HTMLUListElement;

const Select = forwardRef<TSelectRef, TSelectProps>(function Select(
  { children, className, ...props },
  ref
) {
  return (
    <ul
      ref={ref}
      {...props}
      className={cn(
        "flex items-center justify-between h-10 px-3  leading-10 cursor-pointer shadow-sm shadow-slate-500",
        className
      )}
    >
      {children}
    </ul>
  );
});

export default Select;
