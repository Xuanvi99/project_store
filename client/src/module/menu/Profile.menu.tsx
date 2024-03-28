import { Link } from "react-router-dom";
import { Button } from "../../components/button";
import { IconUser } from "../../components/icon";
import { cn } from "../../utils";
import HoverDropdown from "./HoverDropdown";
import { IUser } from "../../types/commonType";

type TProps = {
  isLogin: boolean | undefined;
  user: IUser | null;
  handleLogin?: () => void;
  handleLogOut?: () => void;
  displayName?: boolean;
};

function Profile({
  isLogin,
  user,
  handleLogin,
  handleLogOut,
  displayName,
}: TProps) {
  const avatar = user?.avatar || null;
  return (
    <>
      {!isLogin ? (
        <div className="relative cursor-pointer">
          <Button type="button" variant="default" onClick={handleLogin}>
            Đăng nhập
          </Button>
        </div>
      ) : (
        <HoverDropdown
          select={
            <div className="flex items-center h-10 tex-sm gap-x-3">
              {displayName && (
                <span className="font-semibold ">{user?.userName}</span>
              )}
              <span className="w-9 h-9 rounded-full overflow-hidden">
                <img
                  alt=""
                  srcSet={avatar?.url || user?.avatarDefault}
                  className="w-full h-full bg-cover"
                />
              </span>
            </div>
          }
        >
          <div
            className={cn(
              "absolute top-[130%] -right-5  w-[200px] z-50 ",
              "border-2 rounded-lg border-orange bg-white shadow-shadowButton px-2 py-3 font-medium leading-6"
            )}
          >
            <div className="flex text-xs text-slate-400 gap-x-2">
              <span>
                <IconUser size={12}></IconUser>:
              </span>
              <span>{user?.userName}</span>
            </div>
            <div className="flex flex-col gap-y-5">
              <Link
                to={"/user/account/"}
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
          </div>
        </HoverDropdown>
      )}
    </>
  );
}

export default Profile;
