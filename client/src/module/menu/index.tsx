import { Link, useLocation, useNavigate } from "react-router-dom";
import { cn } from "../../utils";
import { IconBag, IconSearch } from "../../components/icon";
import React, { useEffect, useRef, useState } from "react";
import { Button } from "../../components/button";
import { useHover } from "../../hook";
import { Input } from "../../components/input";

function Menu() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const [scroll, setScroll] = useState<boolean>(false);
  const [textSearch, setTextSearch] = useState<string>("");

  const handleChangeSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTextSearch(event.target.value);
  };

  const handleSubmitSearch = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    navigate(`/category/?search=${textSearch}`);
  };

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
            <Link to={"/"} className="flex items-center cursor-pointer gap-x-2">
              <img alt="" srcSet="/logo.png" loading="lazy" />
              <span className="text-xl font-bold whitespace-nowrap text-orange">
                XVStore
              </span>
            </Link>
            <form
              onSubmit={(event) => handleSubmitSearch(event)}
              className="w-[550px] p-[3px] flex rounded-[3px] bg-white border-[1px] border-orange items-center flex-shrink-1"
            >
              <Input
                type="text"
                name="search"
                id="search"
                value={textSearch}
                onChange={(event) => handleChangeSearch(event)}
                placeholder="Tìm kiếm nhanh sản phẩm...?"
                className={{
                  input:
                    "w-full px-[10px] outline-none text-sm py-2 border-none",
                }}
              />
              <Button variant="default" type="submit" className="px-5 py-2 ">
                <IconSearch></IconSearch>
              </Button>
            </form>
            <div className="flex items-center gap-x-3">
              {!pathname.includes("cart") && (
                <HoverDropdown
                  select={<IconBag size={30} quantity={0}></IconBag>}
                >
                  <div
                    className={cn(
                      "absolute top-[170%] left-2/4 transition-all -translate-x-3/4 min-w-[250px] min-h-[200px] border-2 rounded-lg z-50 hoverDropdown",
                      "border-orange bg-white shadow-shadowButton flex items-center justify-center"
                    )}
                  >
                    <div className="flex flex-col items-center justify-center w-full gap-y-2">
                      <p className="text-xs text-gray">
                        Chưa có sản phẩm trong giỏ hàng.
                      </p>
                    </div>
                  </div>
                </HoverDropdown>
              )}
              {true && (
                <div className="relative cursor-pointer">
                  <Button type="button" variant="default">
                    <Link to="/auth/login">Đăng nhập</Link>
                  </Button>
                </div>
              )}
              {false && (
                <HoverDropdown
                  select={
                    <div className="flex items-center h-10 tex-sm">
                      <span>
                        <img alt="" srcSet="/google.png" className="w-10" />
                      </span>
                      <span>User name</span>
                    </div>
                  }
                >
                  <div
                    className={cn(
                      "absolute top-[130%] right-0 transition-all min-w-[200px] z-50",
                      "border-2 rounded-lg border-orange bg-white shadow-shadowButton px-2 py-3 font-medium",
                      "flex flex-col gap-y-3"
                    )}
                  >
                    <Link
                      to={"/user/profile"}
                      className="inline-block whitespace-nowrap hover:text-orange"
                    >
                      Tài Khoản Của Tôi
                    </Link>
                    <Link
                      to={""}
                      className="inline-block whitespace-nowrap hover:text-orange"
                    >
                      Quản lí Store
                    </Link>
                    <Button type="button" variant="outLine">
                      Đăng xuất
                    </Button>
                  </div>
                </HoverDropdown>
              )}
            </div>
          </div>
        </div>
      </menu>
    </header>
  );
}

type THoverDropdownProps = {
  select: React.ReactNode;
  children: React.ReactNode;
  className?: {
    select?: string;
    option?: string;
  };
};
const HoverDropdown = ({
  select,
  children,
  className,
}: THoverDropdownProps) => {
  const nodeRef = useRef<HTMLDivElement>(null);
  const { isHover } = useHover(nodeRef);
  return (
    <div
      className={cn(
        "relative px-2 transition-all cursor-pointer ",
        isHover &&
          "before:absolute before:top-[60%] before:left-1/2 before:-translate-x-1/2 before:border-l-transparent before:border-r-transparent before:border-t-transparent before:border-[15px] before:border-b-orange before:hoverDropdown",
        className?.select
      )}
      ref={nodeRef}
    >
      {select}
      {isHover && children}
    </div>
  );
};

export default Menu;
