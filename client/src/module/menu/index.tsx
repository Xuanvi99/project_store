import { useEffect, useState } from "react";
import Cart from "./Cart.menu";
import Profile from "./Profile.menu";
import Logo from "./Logo.menu";
import Search from "./Search.menu";
import { cn } from "@/utils";
import Notification from "./Notification.menu";
import { useAppSelector } from "@/hook";
import { RootState } from "@/stores";

function Menu({ type }: { type: "scroll" | "normal" }) {
  const user = useAppSelector((state: RootState) => state.authSlice.user);
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
    <header className={`relative w-full ${type === "normal" && "h-[80px]"}`}>
      <menu
        className={cn(
          "menu w-[1200px] h-[80px] rounded-md bg-white shadow-[0_10px_25px_rgba(0,0,0,0.2)] absolute top-10 left-1/2 -translate-x-1/2 z-50",
          type === "normal" &&
            "absolute top-0 left-1/2 -translate-x-1/2 w-full shadow-none border-b-2 border-b-orange",
          scroll && type === "scroll" && "menu fixed w-full top-0 rounded-none"
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
              <Cart></Cart>
              {user && <Notification></Notification>}
              <Profile></Profile>
            </div>
          </div>
        </div>
      </menu>
    </header>
  );
}

export default Menu;
