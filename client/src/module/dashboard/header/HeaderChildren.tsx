import { useLocation } from "react-router-dom";

import { useEffect, useState } from "react";
import { cn } from "@/utils";

type IProps = {
  children: React.ReactNode;
  handleSelectPathname: (pathname: string) => string;
};

function HeaderChildren({ children, handleSelectPathname }: IProps) {
  const { pathname } = useLocation();

  const [scroll, setScroll] = useState<boolean>(false);

  useEffect(() => {
    const handleScrollHeader = () => {
      window.scrollY !== 0 ? setScroll(true) : setScroll(false);
    };

    window.addEventListener("scroll", () => handleScrollHeader());

    return () => {
      window.removeEventListener("scroll", () => handleScrollHeader());
    };
  }, []);

  return (
    <header
      className={cn(
        "fixed z-40 top-[80px] left-[250px] w-[calc(100%-250px)] flex items-center justify-between px-6 py-4 bg-white border-b-1 border-b-grayCa max-h-[60px] shadow-[5px_5px_10px_rgba(0,0,0,0.2)] transition-all",
        scroll ? "top-[0px]" : ""
      )}
    >
      <h1 className="text-2xl font-semibold">
        {handleSelectPathname(pathname || "")}
      </h1>
      {children}
    </header>
  );
}

export default HeaderChildren;
