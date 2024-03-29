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
                <span className=" font-semibold">{user?.userName}</span>
              )}
              <span>
                <img
                  alt=""
                  srcSet={user?.avatar ? user.avatar : user?.avatarDefault}
                  className="w-9"
                />
              </span>
            </div>
          }
        >
          <div
            className={cn(
              "absolute top-[130%] right-0  min-w-[200px] z-50 ",
              "border-2 rounded-lg border-orange bg-white shadow-shadowButton px-2 py-3 font-medium"
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
                to={"/user/profile"}
                className="inline-block whitespace-nowrap hover:text-orange"
              >
                Tài khoản
              </Link>
              <Link
                to={""}
                className="inline-block whitespace-nowrap hover:text-orange"
              >
                Quản lí Store
              </Link>
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
