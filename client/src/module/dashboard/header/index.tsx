import { Link } from "react-router-dom";
import Profile from "../../menu/Profile.menu";

function Header() {
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
      <div className="w-full text-2xl font-semibold text-center">
        Quản Lý Cửa Hàng
      </div>
      <div className="flex items-center justify-center w-[20%] ">
        <Profile displayName={true}></Profile>
      </div>
    </header>
  );
}

export default Header;
