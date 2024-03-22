import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../../hook";
import Profile from "../../menu/Profile.menu";
import { logOut } from "../../../stores/reducer/authReducer";
import { useLogOutAuthMutation } from "../../../stores/service/auth.service";

function Header() {
  const { user, isLogin } = useAppSelector((state) => state.authSlice);
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  // if (user && user.role === "buyer") {
  //   navigate("/", { replace: true });
  // }

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
    <header className="w-full h-[50px] px-10 leading-10 py-2 bg-white flex justify-between">
      <Link to={"/"} className="flex items-center cursor-pointer gap-x-2">
        <img alt="" srcSet="/logo.png" loading="lazy" width={30} />
        <span className="text-2xl font-bold whitespace-nowrap text-orange">
          XVStore
        </span>
      </Link>
      <Profile
        isLogin={isLogin}
        user={user}
        handleLogin={handleLogin}
        handleLogOut={handleLogOut}
        displayName={true}
      ></Profile>
    </header>
  );
}

export default Header;
