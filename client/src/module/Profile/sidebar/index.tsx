import { Link, useLocation } from "react-router-dom";
import NavItem from "./NavItem";
import { useEffect, useState } from "react";
import {
  IconAddress,
  IconPassword,
  IconProfile,
} from "@/components/icon/SidebarProfile";
import { useAppSelector } from "@/hook";
import { RootState } from "@/stores";
import { IconPurchase, IconWrite } from "@/components/icon";
import { LazyLoadImage } from "react-lazy-load-image-component";

const ListNavProfile = [
  {
    title: "Hồ sơ",
    path: "/user/account/profile",
    icon: <IconProfile size={20}></IconProfile>,
  },
  {
    title: "Địa chỉ",
    path: "/user/account/address",
    icon: <IconAddress size={20}></IconAddress>,
  },
  {
    title: "Đổi mật khẩu",
    path: "/user/account/password",
    icon: <IconPassword size={20}></IconPassword>,
  },
  {
    title: "Đơn mua",
    path: "/user/account/purchaseOrder",
    icon: <IconPurchase size={20}></IconPurchase>,
  },
];
function SidebarProfile() {
  const { pathname } = useLocation();

  const [checkPath, setCheckPath] = useState<boolean>(true);

  const user = useAppSelector((state: RootState) => state.authSlice.user);

  const avatar = user?.avatar || null;

  useEffect(() => {
    const check = (pathname: string) => {
      setCheckPath(ListNavProfile.some((nav) => pathname === nav.path));
    };
    check(pathname);
  }, [pathname, setCheckPath]);

  return (
    <aside className="max-w-[200px] w-full">
      <div className="py-[15px] flex items-center gap-x-4 border-b-1 border-grayCa">
        <Link
          to={"/user/profile/info"}
          className="w-12 h-12 overflow-hidden rounded-full cursor-pointer basis-12"
        >
          {/* <img
            alt="error"
            srcSet={avatar?.url || user?.avatarDefault}
            className={"w-full h-full bg-center"}
          /> */}
          <LazyLoadImage
            alt="avatar"
            placeholderSrc={avatar?.url || user?.avatarDefault}
            srcSet={avatar?.url || user?.avatarDefault}
            effect="blur"
            className={"w-full h-full bg-center"}
          />
        </Link>
        <div className="flex flex-col basis-32 line-clamp-1">
          <span className="font-bold">{user?.userName}</span>
          <Link
            to={"/user/account/profile"}
            className="flex text-sm cursor-pointer gap-x-1 text-gray hover:text-orange"
          >
            <IconWrite size={15} /> Sửa hồ sơ
          </Link>
        </div>
      </div>
      <div className="flex flex-col mt-5 gap-y-5 text-gray">
        {ListNavProfile.map((data, index) => {
          if (checkPath) {
            return (
              <NavItem
                key={index}
                data={data}
                activePath={data.path === pathname ? true : false}
              ></NavItem>
            );
          } else {
            if (data.path === "/user/account/profile") {
              return (
                <NavItem key={index} data={data} activePath={true}></NavItem>
              );
            } else {
              return (
                <NavItem key={index} data={data} activePath={false}></NavItem>
              );
            }
          }
        })}
      </div>
    </aside>
  );
}

export default SidebarProfile;
