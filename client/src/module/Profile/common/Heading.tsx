import React from "react";
import { cn } from "../../../utils";

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
