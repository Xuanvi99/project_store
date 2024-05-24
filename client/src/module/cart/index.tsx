import { ModalNotification } from "@/components/modal";
import useTestContext from "@/hook/useTestContext";
import { CartContext, TCartProvider } from "./context.cart";
import { IconError } from "@/components/icon";
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
    <main>
      <ModalNotification
        isOpen={openModal}
        onClick={() => handleOpenError(false)}
        time={700}
        className={{
          content:
            "bg-black w-[350px] h-[200px] rounded-md opacity-75 flex justify-center items-center gap-x-5 text-white font-semibold",
        }}
      >
        <div className="flex flex-col items-center justify-center gap-y-5">
          <span className={"text-danger"}>
            <IconError size={50}></IconError>
          </span>
          <span>Lỗi xóa sản phẩm trong giỏ hàng</span>
        </div>
      </ModalNotification>
      {listProductActiveToCart.length > 0 && (
        <LayoutMain>
          <Header></Header>
          <Content></Content>
          <Footer></Footer>
        </LayoutMain>
      )}
      {listProductActiveToCart.length === 0 &&
        listProductInactiveToCart.length === 0 && (
          <NoItemsToCart></NoItemsToCart>
        )}
      <ProductSlideshow name=""></ProductSlideshow>
    </main>
  );
}
const NoItemsToCart = () => {
  const navigate = useNavigate();
  return (
    <LayoutMain className="flex items-center justify-center">
      <div className="flex flex-col items-center justify-center gap-y-3 py-[100px]">
        <img alt="" srcSet="/cart.png" className="w-[100px]" />
        <p>Giỏ hàng của bạn còn trống</p>
        <Button variant="default" onClick={() => navigate("/")}>
          MUA NGAY
        </Button>
      </div>
    </LayoutMain>
  );
};
export default Container;
