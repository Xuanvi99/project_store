import { useLocation } from "react-router-dom";

import { useEffect, useState } from "react";
import { cn } from "@/utils";

type IProps = {
  children: React.ReactNode;
  handleSelectPathname?: (pathname: string) => string;
};

function HeaderChildren({ children, handleSelectPathname }: IProps) {
  const { pathname } = useLocation();

  const [scroll, setScroll] = useState<boolean>(false);

  useEffect(() => {
    const handleScrollHeader = () => {
      window.scrollY > 10 ? setScroll(true) : setScroll(false);
    };

    window.addEventListener("scroll", () => handleScrollHeader());

    return () => {
      window.removeEventListener("scroll", () => handleScrollHeader());
    };
  }, []);

  return (
    <header
      className={cn(
        "fixed z-40 top-[60px] left-[18%] w-[82%] flex items-center justify-between px-6 py-4 bg-white border-b-1 border-b-grayCa max-h-[50px] shadow-sm transition-all",
        scroll ? "top-[0px]" : ""
      )}
    >
      {handleSelectPathname && (
        <h1 className="text-lg font-semibold">
          {handleSelectPathname(pathname || "")}
        </h1>
      )}
      {children}
    </header>
  );
}

export default HeaderChildren;
