import { Link } from "react-router-dom";
import { IconWrite } from "../../../components/icon";
import {
  IconAddress,
  IconProfile,
  IconPassword,
} from "../../../components/icon/SidebarProfile";
import NavItem from "./NavItem";

const ListNavProfile = [
  {
    title: "Hồ sơ",
    path: "/user/profile",
    icon: <IconProfile size={20}></IconProfile>,
  },
  // {
  //   title: "Ngân hàng",
  //   path: "/user/payment",
  //   icon: <IconPayment size={20}></IconPayment>,
  // },
  {
    title: "Địa chỉ",
    path: "/user/address",
    icon: <IconAddress size={20}></IconAddress>,
  },
  {
    title: "Đổi mật khẩu",
    path: "/user/password",
    icon: <IconPassword size={20}></IconPassword>,
  },
];
function SidebarProfile() {
  return (
    <aside className="max-w-[200px]  w-full">
      <div className="py-[15px] flex items-center gap-x-4 border-b-1 border-grayCa">
        <img src="" alt="" srcSet="/userName.png" className="w-12" />
        <div className="flex flex-col">
          <span className="font-bold">bui xuan vi</span>
          <Link
            to={"/user/profile"}
            className="flex text-sm cursor-pointer gap-x-1 text-gray hover:text-orange"
          >
            <IconWrite size={15}></IconWrite> Sửa hồ sơ
          </Link>
        </div>
      </div>
      <div className="flex flex-col mt-5 gap-y-5 text-gray">
        {ListNavProfile.map((data, index) => {
          return <NavItem key={index} data={data}></NavItem>;
        })}
      </div>
    </aside>
  );
}

export default SidebarProfile;
