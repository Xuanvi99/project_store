import { Fragment } from "react";
import { BannerCommon } from "../components/banner";
import { useNavigate } from "react-router-dom";

function NotFoundPage() {
  const navigate = useNavigate();
  return (
    <Fragment>
      <BannerCommon heading="Không tìm thấy trang"></BannerCommon>
      <main className="py-[80px] flex flex-col items-center gap-y-10">
        <div className="flex flex-col items-center gap-y-5">
          <h1 className="text-6xl font-bold">404</h1>
          <p className="text-red-600 text-2xl font-semibold">
            Oops! Không tìm thấy trang
          </p>
        </div>
        <button
          onClick={() => navigate("/")}
          className="text-white bg-orangeLinear px-2 py-1 rounded-md text-2xl font-semibold"
        >
          Trang chủ
        </button>
      </main>
    </Fragment>
  );
}

export default NotFoundPage;
