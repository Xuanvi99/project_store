import { ModalNotification } from "@/components/modal";
import useTestContext from "@/hook/useTestContext";
import { CartContext, TCartProvider } from "./context.cart";
import { ProductSlideshow } from "@/components/product";
import { useNavigate } from "react-router-dom";
import LayoutMain from "@/layout/LayoutMain";
import { Button } from "@/components/button";
import Header from "./header.cart";
import Content from "./content.cart";
import Footer from "./footer.cart";

function Container() {
  const {
    openModal,
    handleOpenError,
    listProductActiveToCart,
    listProductInactiveToCart,
  } = useTestContext<TCartProvider>(
    CartContext as React.Context<TCartProvider>
  );
  return (
    <main className="flex flex-col items-center ">
      <ModalNotification
        isOpenModal={openModal}
        type={"error"}
        onClick={() => handleOpenError(false)}
        time={700}
        className={{
          content: "font-semibold",
        }}
      >
        <span>Lỗi xóa sản phẩm trong giỏ hàng</span>
      </ModalNotification>

      {listProductActiveToCart.length > 0 && (
        <LayoutMain>
          <h1 className="mt-10 text-2xl font-semibold">Giỏ hàng của bạn</h1>
          <Header></Header>
          <Content></Content>
          <Footer></Footer>
        </LayoutMain>
      )}

      {listProductActiveToCart.length === 0 &&
        listProductInactiveToCart.length === 0 && (
          <NoItemsToCart></NoItemsToCart>
        )}
      <ProductSlideshow></ProductSlideshow>
    </main>
  );
}
const NoItemsToCart = () => {
  const navigate = useNavigate();
  return (
    <LayoutMain className="flex items-center justify-center my-10">
      <div className="flex flex-col items-center justify-center gap-y-3 py-[100px]">
        <img alt="" loading="lazy" srcSet="/cart.png" className="w-[100px]" />
        <p>Giỏ hàng của bạn còn trống</p>
        <Button variant="default" onClick={() => navigate("/")}>
          MUA NGAY
        </Button>
      </div>
    </LayoutMain>
  );
};
export default Container;
