import { useAppSelector } from "@/hook";
import { RootState } from "@/stores";

function HeaderView() {
  const user = useAppSelector((state: RootState) => state.authSlice.user);
  return (
    <div className="flex gap-x-3 items-center px-3 border-b-1 border-orange py-2">
      <div className="relative">
        {user && (
          <img
            alt=""
            srcSet={user?.avatar?.url || user?.avatarDefault}
            className="overflow-hidden rounded-full w-8 h-8 "
          />
        )}
        <div className="h-3 w-3 rounded-full bg-green66 absolute bottom-0 right-0"></div>
      </div>
      <div className="flex flex-col justify-start">
        <p className="font-semibold text-sm">Tin nhắn</p>
        <p className="text-xs text-gray-500">Đang hoạt động</p>
      </div>
    </div>
  );
}

export default HeaderView;
