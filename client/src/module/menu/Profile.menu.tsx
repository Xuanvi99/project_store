import { Button } from "@/components/button";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { IconUser } from "@/components/icon";
import { useLogOutAuthMutation } from "@/stores/service/auth.service";
import { useAppDispatch, useAppSelector } from "@/hook";
import { RootState } from "@/stores";
import { logOut } from "@/stores/reducer/authReducer";
import { updateCart } from "@/stores/reducer/cartReducer";
import Tooltip from "@/components/tooltip";

type TProps = {
  displayName?: boolean;
};

function Profile({ displayName }: TProps) {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const redirectUrl = import.meta.env.VITE_DOMAIN_CLIENT + pathname;

  const { user, isLogin } = useAppSelector(
    (state: RootState) => state.authSlice
  );

  const [logOutAuth] = useLogOutAuthMutation();

  const handleLogin = async () => {
    const query = encodeURIComponent(redirectUrl);
    navigate("/auth/login?next=" + query, { state: { path: pathname } });
  };

  const handleLogOut = async () => {
    dispatch(logOut());
    dispatch(updateCart({ cart: null }));
    await logOutAuth()
      .unwrap()
      .then((res) => console.log("logout", res.message));
    const query = encodeURIComponent(redirectUrl);
    navigate("/auth/login?next=" + query, { state: { path: pathname } });
  };

  return (
    <>
      {!isLogin ? (
        <div className="relative cursor-pointer">
          <Button type="button" variant="default" onClick={handleLogin}>
            Đăng nhập
          </Button>
        </div>
      ) : (
        <Tooltip
          place="bottom"
          select={
            <div className="flex items-center h-9 tex-sm gap-x-3">
              <span className="overflow-hidden rounded-full w-9 h-9">
                <img
                  alt="err"
                  srcSet={user?.avatar?.url || user?.avatarDefault}
                  className="w-full h-full bg-cover"
                />
              </span>
              {displayName && (
                <div className="flex flex-col items-center justify-center text-sm">
                  <span className="font-semibold">{user?.userName}</span>
                  <span className="text-xs text-slate-600">
                    {user?.role === "admin" ? "Quản lí" : ""}
                  </span>
                </div>
              )}
            </div>
          }
          className={{
            content: "w-[200px] -translate-x-3/4",
          }}
        >
          <div className="flex text-xs text-slate-400 gap-x-2">
            <span>
              <IconUser size={12}></IconUser>:
            </span>
            <span>{user?.userName}</span>
          </div>
          <div className="flex flex-col gap-y-5">
            <Link
              to={"/user/account/profile"}
              className="inline-block whitespace-nowrap hover:text-orange"
            >
              Tài khoản
            </Link>
            <Link
              to={""}
              className="inline-block whitespace-nowrap hover:text-orange"
            >
              Đơn mua
            </Link>
            {user?.role === "admin" && (
              <Link
                to={"/dashboard/home"}
                className="inline-block whitespace-nowrap hover:text-orange"
              >
                Quản lí Store
              </Link>
            )}
            <Button type="button" variant="outLine" onClick={handleLogOut}>
              Đăng xuất
            </Button>
          </div>
        </Tooltip>
      )}
    </>
  );
}

export default Profile;
