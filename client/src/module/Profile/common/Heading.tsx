import React from "react";
import { cn } from "../../../utils";

type THeadingProps = {
  children?: React.ReactNode;
  title: string;
  className?: string;
};

function Heading({ children, title, className }: THeadingProps) {
  return (
    <header className={cn(" border-b-1 border-grayCa h-[80px]", className)}>
      <h1 className="text-lg font-medium">{title}</h1>
      {children}
    </header>
  );
}

export default Heading;
