type IProps = {
  totalPrice: number;
  discount: number;
};

function PromotionDetail({ totalPrice, discount }: IProps) {
  return (
    <div className="promotion-detail w-[450px] px-5 py-2 text-xs">
      <h2 className="text-lg font-medium ">Chi tiết khuyến mãi</h2>
      <div className="flex items-center justify-between py-3 mt-5 border-t-1 border-t-grayCa">
        <span>Tổng tiền hàng:</span>
        <span>₫{new Intl.NumberFormat().format(totalPrice)}</span>
      </div>
      <div className="flex items-center justify-between py-3 border-t-1 border-t-grayCa">
        <span>Giảm giá sản phẩm:</span>
        <span> -₫{new Intl.NumberFormat().format(discount)}</span>
      </div>
      <div className="flex flex-col justify-between py-3 border-t-1 border-t-grayCa gap-y-2">
        <div className="flex items-center justify-between">
          <span>Tiết kiệm:</span>
          <span className="text-red-600">
            -₫{new Intl.NumberFormat().format(discount)}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span>Tổng số tiền:</span>
          <span> ₫{new Intl.NumberFormat().format(totalPrice - discount)}</span>
        </div>
        <div className="text-end text-grayCa">Số tiền cuối cùng thanh toán</div>
      </div>
    </div>
  );
}

export default PromotionDetail;
