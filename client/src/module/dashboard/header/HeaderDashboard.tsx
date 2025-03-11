import Profile from "../../menu/Profile.menu";

function HeaderDashboard() {
  return (
    <header className="w-[82%] h-[60px] fixed top-0 left-[18%] bg-white z-50 flex justify-between items-center border-b-1 border-orange">
      <div className="w-full text-xl font-semibold text-center">
        Quản Lý Cửa Hàng
      </div>
      <div className="flex items-center justify-center w-[20%] ">
        <Profile displayName={true} />
      </div>
    </header>
  );
}

export default HeaderDashboard;
