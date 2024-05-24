import useTestContext from "@/hook/useTestContext";
import ProductDesc from "../productDesc";
import ProductPropose from "../productPropose";
import ProductReviews from "../productReviews";
import ProductSingle from "../productInfo";
import ProductSummary from "../productSummary";
import { IProductDetailProvide, PDetailContext } from "../context";
import { useNavigate } from "react-router-dom";
import LayoutMain from "@/layout/LayoutMain";
import LoadingSpinner from "../../../components/loading/index";

function DetailContent() {
  const { status, isFetching } = useTestContext<IProductDetailProvide>(
    PDetailContext as React.Context<IProductDetailProvide>
  );

  const navigate = useNavigate();

  if (status === "rejected") {
    return (
      <main className="py-[80px] flex flex-col items-center gap-y-10">
        <div className="flex flex-col items-center gap-y-5">
          <h1 className="text-6xl font-bold">404</h1>
          <p className="text-2xl font-semibold text-red-600">
            Rất tiếc! Không tìm thấy sản phẩm
          </p>
        </div>
        <button
          onClick={() => navigate("/")}
          className="px-2 py-1 text-lg font-medium text-white rounded-md bg-orangeLinear"
        >
          QUAY VỀ TRANG CHỦ
        </button>
      </main>
    );
  }

  if (status === "pending" && isFetching) {
    return (
      <LayoutMain className="flex items-center justify-center h-screen">
        <LoadingSpinner className="w-16 h-16 border-4 border-orangeFe border-r-transparent"></LoadingSpinner>
      </LayoutMain>
    );
  }

  return (
    <LayoutMain>
      <ProductSingle></ProductSingle>
      <ProductSummary></ProductSummary>
      <ProductDesc></ProductDesc>
      <ProductReviews></ProductReviews>
      <ProductPropose></ProductPropose>
    </LayoutMain>
  );
}

export default DetailContent;
