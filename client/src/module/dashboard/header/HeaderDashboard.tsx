import Profile from "../../menu/Profile.menu";

function HeaderDashboard() {
  return (
    <header className="w-[calc(100%-250px)] h-[60px] fixed top-0 left-[250px] bg-white z-50  flex justify-between items-center border-b-1 border-orange">
      <div className="w-full text-xl font-semibold text-center">
        Quản Lý Cửa Hàng
      </div>
      <div className="flex items-center justify-center w-[20%] ">
        <Profile displayName={true}></Profile>
      </div>
    </header>
  );
}

export default HeaderDashboard;
