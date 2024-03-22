import { useLocation, useNavigate } from "react-router-dom";
import { cn } from "../../utils";
import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../hook";
import { logOut } from "../../stores/reducer/authReducer";
import { updateCart } from "../../stores/reducer/cartReducer";
import { useLogOutAuthMutation } from "../../stores/service/auth.service";
import LogoCart from "./LogoCart.menu";
import Profile from "./Profile.menu";
import Logo from "./Logo.menu";
import Search from "./Search.menu";

function Menu() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const redirectUrl = import.meta.env.VITE_DOMAIN_CLIENT + pathname;

  const { user, isLogin } = useAppSelector((state) => state.authSlice);
  const cart = useAppSelector((state) => state.cartSlice.cart);

  const [logOutAuth] = useLogOutAuthMutation();

  const [scroll, setScroll] = useState<boolean>(false);
  const [textSearch, setTextSearch] = useState<string>("");

  const handleChangeSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTextSearch(event.target.value);
  };

  const handleSubmitSearch = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    navigate(`/category/?search=${textSearch}`);
  };

  const handleLogin = async () => {
    const query = encodeURIComponent(redirectUrl);
    navigate("/auth/login?next=" + query);
  };

  const handleLogOut = async () => {
    dispatch(logOut());
    dispatch(updateCart({ cart: null }));
    await logOutAuth()
      .unwrap()
      .then((res) => console.log("logout", res.message));
    const query = encodeURIComponent(redirectUrl);
    navigate("/auth/login?next=" + query);
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
            <Logo />
            <Search
              valueInput={textSearch}
              onChangeSearch={handleChangeSearch}
              onSubmitSearch={handleSubmitSearch}
            ></Search>
            <div className="flex items-center gap-x-3">
              <LogoCart pathname={pathname} cart={cart}></LogoCart>
              <Profile
                isLogin={isLogin}
                user={user}
                handleLogin={handleLogin}
                handleLogOut={handleLogOut}
              ></Profile>
            </div>
          </div>
        </div>
      </menu>
    </header>
  );
}

export default Menu;
