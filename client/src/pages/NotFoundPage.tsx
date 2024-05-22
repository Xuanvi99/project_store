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
          <p className="text-2xl font-semibold text-red-600">
            Rất tiếc! trang bạn tìm không tồn tại
          </p>
        </div>
        <button
          onClick={() => navigate("/")}
          className="px-2 py-1 text-2xl font-semibold text-white rounded-md bg-orangeLinear"
        >
          Trang chủ
        </button>
      </main>
    </Fragment>
  );
}

export default NotFoundPage;
