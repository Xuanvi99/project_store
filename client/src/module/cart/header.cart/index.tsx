import { Input } from "@/components/input";
import useTestContext from "@/hook/useTestContext";
import { CartContext, TCartProvider } from "../context.cart";

function Header() {
  const { listProductActiveToCart, listCheckCart, handleCheckAllCart } =
    useTestContext<TCartProvider>(CartContext as React.Context<TCartProvider>);
  return (
    <section className="filter max-w-[1200px] w-full mx-auto mt-10 h-[60px] shadow-sm shadow-grayCa font-bold  bg-white px-5 rounded-[3px] flex justify-between items-center">
      <div className="flex items-center w-[500px] gap-x-[60px]">
        <Input
          type="checkbox"
          name="checkbox"
          onChange={(event) => handleCheckAllCart(event.currentTarget.checked)}
          checked={
            listCheckCart.length === listProductActiveToCart.length
              ? true
              : false
          }
          className={{
            input: "w-5 h-5 cursor-pointer",
            wrap: "w-5 static",
          }}
        />
        <span>Sản Phẩm</span>
      </div>
      <div className="grid w-[560px] grid-cols-3 text-center">
        <span>Đơn Giá</span>
        <span>Số Lượng</span>
        <span>Thành Tiền</span>
      </div>
      <div className="inline-block w-[100px] text-center">Thao Tác</div>
    </section>
  );
}

export default Header;
