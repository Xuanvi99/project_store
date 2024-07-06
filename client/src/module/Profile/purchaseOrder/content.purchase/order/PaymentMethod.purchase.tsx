import { IResOrder } from "@/types/order.type";

function PaymentMethod({ data }: { data: IResOrder }) {
  const { paymentMethod, codeBill, paymentStatus } = data;

  return (
    <div className="flex items-center justify-between py-3 border-dashed gap-y-2 border-b-1 border-b-grayCa">
      <div>
        <span>Phương thức thanh toán:</span>
        <span className=" text-danger">
          {paymentMethod === "vnpay"
            ? "Thanh toán qua thẻ (VNPAY)"
            : "Thanh toán khi nhận hàng (COD)"}
        </span>
      </div>
      {paymentMethod === "vnpay" && codeBill && (
        <div className="flex items-center justify-end p-2 gap-x-2 ">
          <span>Mã hóa đơn: </span>
          <span>{codeBill}</span>
        </div>
      )}
      {paymentMethod === "vnpay" && (
        <div className="flex items-center justify-end p-2 gap-x-2 text-danger">
          {paymentStatus === "paid" ? "(Đã thanh toán)" : "(Chưa thanh toán)"}
        </div>
      )}
    </div>
  );
}

export default PaymentMethod;
