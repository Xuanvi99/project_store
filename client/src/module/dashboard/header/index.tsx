import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../../hook";
import Profile from "../../menu/Profile.menu";
import { logOut } from "../../../stores/reducer/authReducer";
import { useLogOutAuthMutation } from "../../../stores/service/auth.service";
import Search from "../../menu/Search.menu";

function Header() {
  const { user, isLogin } = useAppSelector((state) => state.authSlice);
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const redirectUrl = import.meta.env.VITE_DOMAIN_CLIENT + pathname;

  const [logOutAuth] = useLogOutAuthMutation();

  const handleLogin = async () => {
    const query = encodeURIComponent(redirectUrl);
    navigate("/auth/login?next=" + query);
  };

  const handleLogOut = async () => {
    dispatch(logOut());
    await logOutAuth()
      .unwrap()
      .then((res) => console.log("logout", res.message));
    const query = encodeURIComponent(redirectUrl);
    navigate("/auth/login?next=" + query);
  };
  return (
    <header className="w-full h-[80px] fixed top-0 left-0 bg-white z-50  flex justify-between items-center border-b-1 border-orange">
      <Link
        to={"/"}
        className="flex items-center justify-center cursor-pointer gap-x-2 basis-1/6"
      >
        <img alt="" srcSet="/logo.png" loading="lazy" width={30} />
        <span className="text-2xl font-bold whitespace-nowrap text-orange">
          XVStore
        </span>
      </Link>
      <Search></Search>
      <div className="flex items-center justify-center w-[20%] ">
        <Profile
          isLogin={isLogin}
          user={user}
          handleLogin={handleLogin}
          handleLogOut={handleLogOut}
          displayName={true}
        ></Profile>
      </div>
    </header>
  );
}

export default Header;
