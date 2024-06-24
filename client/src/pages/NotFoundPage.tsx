import { useNavigate } from "react-router-dom";

function NotFoundPage() {
  const navigate = useNavigate();
  return (
    <main className="h-[calc(100vh-80px)] flex flex-col justify-center items-center gap-y-10">
      <div className="flex flex-col items-center gap-y-5">
        <h1 className="text-6xl font-bold">404</h1>
        <p className="text-2xl font-semibold text-red-600">
          Rất tiếc! Trang bạn tìm không tồn tại
        </p>
      </div>
      <button
        onClick={() => navigate("/")}
        className="px-3 py-2 text-2xl font-semibold text-white rounded-md bg-orangeLinear"
      >
        Trở lại trang chủ
      </button>
    </main>
  );
}

export default NotFoundPage;
