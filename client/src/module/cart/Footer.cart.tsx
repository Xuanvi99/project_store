import { Button } from "@/components/button";
import { Input } from "@/components/input";
import { TCartItem } from "@/pages/CartPage";

type TFooterProps<T> = {
  listCheckCart: T[];
  listCart: T[];
  checkAll: boolean;
  handleCheckAll: (checked: boolean) => void;
};

function Footer({
  listCheckCart,
  listCart,
  checkAll,
  handleCheckAll,
}: TFooterProps<TCartItem>) {
  const totalMoney = () => {
    return listCheckCart.reduce((a, b) => {
      if (b.price.sale) {
        return a + parseInt(b.price.sale) * b.quantity;
      } else {
        return a + parseInt(b.price.main) * b.quantity;
      }
    }, 0);
  };

  return (
    <section className="footer w-full max-w-[1200px] mx-auto min-h-[60px]  shadow-sm shadow-grayCa  py-10 bg-white px-5 rounded-[3px] flex justify-between items-center">
      <div className="flex items-center w-1/3 gap-x-10">
        <Input
          type="checkbox"
          name="checkbox"
          onChange={(event) => {
            handleCheckAll(event.currentTarget.checked);
          }}
          className={{
            input: "w-5 h-5 cursor-pointer",
            wrap: "w-5 static",
          }}
          checked={checkAll}
        />
        <div className="cursor-pointer hover:text-red-600">
          Chọn Tất Cả ({listCart.length})
        </div>
        <div className="cursor-pointer hover:text-red-600">Xóa</div>
      </div>
      <div className="flex items-center justify-end w-2/3 gap-x-5">
        <div className="flex items-center gap-x-1">
          <span>Tổng thanh toán</span>
          <span>({listCheckCart.length} sản phẩm):</span>
          <span className="text-2xl text-red-600">
            ₫{new Intl.NumberFormat().format(totalMoney())}
          </span>
        </div>
        <Button
          variant="default"
          type="button"
          className="px-5"
          disabled={listCheckCart.length > 0 ? false : true}
        >
          Mua Hàng
        </Button>
      </div>
    </section>
  );
}

export default Footer;
