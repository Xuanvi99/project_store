import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { IconChevronLeft } from "@/components/icon";
import { cn } from "@/utils";
import Chat from "../chat";
import { useAppSelector } from "@/hook";
import { RootState } from "@/stores";

function Footer() {
  const { isLogin } = useAppSelector((state: RootState) => state.authSlice);

  const [scroll, setScroll] = useState<boolean>(false);

  useEffect(() => {
    const handleFixedToTop = () => {
      window.scrollY !== 0 ? setScroll(true) : setScroll(false);
    };

    window.addEventListener("scroll", handleFixedToTop);
    return () => {
      window.removeEventListener("scroll", handleFixedToTop);
    };
  }, []);

  return (
    <footer className="w-full mt-5 bg-white border-t-4 border-t-orange">
      <div className="w-full max-w-[1200px] mx-auto  py-[30px] footer ">
        <div className="flex flex-col px-3 gap-y-5">
          <div className="flex flex-col justify-start gap-y-1">
            <h2 className="text-lg font-semibold">GIỚI THIỆU</h2>
            <span className="w-5 h-[2px] bg-gray"></span>
          </div>
          <div className="flex items-center cursor-pointer gap-x-2">
            <img alt="" srcSet="/logo.png" loading="lazy" className="w-10" />
            <span className="text-base font-bold whitespace-nowrap">
              XV Store
            </span>
          </div>
          <Link to={"#"} className="text-sm hover:text-blue ">
            <strong>XV Store</strong> nơi trao tặng các sản phẩm giày thời trang
            trẻ trung, phong cách, bắt trend cho giới trẻ.
          </Link>
          <div className="text-sm">
            <strong>Địa chỉ:</strong> xxxxxxx,xxxxxx,xxxxx
          </div>
        </div>
        <div className="flex flex-col px-3 gap-y-5">
          <div className="flex flex-col justify-start gap-y-1">
            <h2 className="text-lg font-semibold">CÁC CHÍNH SÁCH</h2>
            <span className="w-5 h-[2px] bg-gray"></span>
          </div>
          <ul className="flex flex-col justify-start text-sm gap-y-4">
            <li>Chính sách bảo mật của XV Store</li>
            <li>Chính sách bảo hành của XV Store</li>
            <li>Chính sách đổi trả hoàn tiền của XV Store</li>
            <li>Phương thức thanh toán của XV Store</li>
            <li>Chính sách vận chuyển của XV Store</li>
          </ul>
          <img src="" alt="" srcSet="/icon-footer.jpg" loading="lazy" />
        </div>
        <div className="flex flex-col px-3 gap-y-5">
          <div className="flex flex-col justify-start gap-y-1">
            <h2 className="text-lg font-semibold">HỖ TRỢ KHÁCH HÀNG</h2>
            <span className="w-5 h-[2px] bg-gray"></span>
          </div>
          <ul className="flex flex-col justify-start text-sm gap-y-4">
            <li>Giới thiệu</li>
            <li>Liên hệ</li>
            <li>Tác giả</li>
            <li>Google News Xvstore.com</li>
            <li>Mua hàng: ********* (7h30-22h) (Tất cả các ngày trong tuần)</li>
          </ul>
        </div>
        <div className="flex flex-col px-3 gap-y-5">
          <div className="flex flex-col justify-start gap-y-1">
            <h2 className="text-lg font-semibold">KẾT NỐI VỚI CHÚNG TÔI</h2>
            <span className="w-5 h-[2px] bg-gray"></span>
          </div>
          <ul className="flex flex-col justify-start text-sm gap-y-4">
            <li>
              <span className="font-bold">Hotline:</span> 03******
            </li>
            <li>
              <span className="font-bold">Email:</span> ******@gmail.com
            </li>
          </ul>
        </div>
      </div>
      <div className="mt-6 mb-[15px] text-center text-gray text-sm">
        Copyright 2024 © Team XV Store
      </div>
      <div
        className={cn(
          "fixed z-50 right-0 flex flex-col items-center justify-center cursor-pointer bottom-3 gap-y-3"
        )}
      >
        {scroll && (
          <div
            onClick={() => {
              window.scrollTo({ behavior: "smooth", top: 0 });
            }}
            className={cn(
              "flex items-center justify-center w-10 h-10 border-2 rounded-lg text-orange  border-orange",
              "hover:bg-orange hover:text-white ",
              "absolute right-2 bottom-14"
            )}
          >
            <span className="rotate-90">
              <IconChevronLeft size={20}></IconChevronLeft>
            </span>
          </div>
        )}
        {isLogin && <Chat></Chat>}
      </div>
    </footer>
  );
}

export default Footer;
