import { cn } from "@/utils";
import React from "react";

type THeadingProps = {
  children: React.ReactNode;
  className?: string;
};

function Heading({ children, className }: THeadingProps) {
  return (
    <header className={cn(" border-b-1 border-grayCa h-[80px]", className)}>
      {children}
    </header>
  );
}

export default Heading;
