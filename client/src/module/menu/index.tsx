import { useEffect, useState } from "react";
import LogoCart from "./LogoCart.menu";
import Profile from "./Profile.menu";
import Logo from "./Logo.menu";
import Search from "./Search.menu";
import { cn } from "@/utils";

function Menu() {
  const [scroll, setScroll] = useState<boolean>(false);

  useEffect(() => {
    const handleFixedMenu = () => {
      window.scrollY !== 0 ? setScroll(true) : setScroll(false);
    };

    window.addEventListener("scroll", handleFixedMenu);

    return () => {
      window.removeEventListener("scroll", handleFixedMenu);
    };
  }, []);

  return (
    <header className="absolute z-50 w-full">
      <menu
        className={cn(
          "menu w-[1200px] h-[80px] rounded-md absolute top-10 left-1/2 -translate-x-1/2 mt-auto bg-white shadow-[0_10px_25px_rgba(0,0,0,0.2)]",
          scroll ? "fixed w-full top-0 rounded-none" : ""
        )}
      >
        <div
          className={cn(
            "w-[1200px] m-auto h-full rounded-[5px] px-[45px] flex items-center "
          )}
        >
          <div className="flex items-center justify-between w-full menu">
            <Logo />
            <Search></Search>
            <div className="flex items-center gap-x-3">
              <LogoCart></LogoCart>
              <Profile></Profile>
            </div>
          </div>
        </div>
      </menu>
    </header>
  );
}

export default Menu;
