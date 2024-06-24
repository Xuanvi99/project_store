import { Button } from "@/components/button";
import { IconSuccess } from "@/components/icon";
import LoadingSpinner from "@/components/loading";
import {
  useCreatePaymentMutation,
  useVnPayIpnQuery,
} from "@/stores/service/vnpay.service";
import { cn, formatPrice } from "@/utils";
import {
  Fragment,
  useEffect,
  useLayoutEffect,
  useCallback,
  useState,
} from "react";
import IconError from "../components/icon/IconError";
import {
  Link,
  useLocation,
  useParams,
  useSearchParams,
} from "react-router-dom";
import { NotificationVnpay } from "@/constant/order.constant";
import { useLazyGetOrderDetailQuery } from "@/stores/service/order.service";

function PaymentPage() {
  const { codeOrder } = useParams();
  const { state, search } = useLocation();
  const [searchParams] = useSearchParams();

  const { data: resData, status } = useVnPayIpnQuery(
    { codeOrder: codeOrder, params: search },
    {
      skip:
        !search || !codeOrder || searchParams.get("vnp_ResponseCode") !== "00",
    }
  );
  console.log(resData);

  const [createPayment] = useCreatePaymentMutation();

  const [getOrderDetail] = useLazyGetOrderDetailQuery();

  const [error, setError] = useState<{ status: boolean; message: string }>({
    status: false,
    message: "",
  });

  const handleSetMessage = (code: string) => {
    const index = NotificationVnpay.findIndex((item) => item.code === code);
    if (index > -1) {
      return NotificationVnpay[index].message;
    } else {
      return "Lỗi giao dịch thanh toán";
    }
  };

  const handlePostCreatePayment = useCallback(async () => {
    if (state && codeOrder) {
      await createPayment({
        totalPricePayment: state.totalPricePayment,
        bankCode: "",
        language: "vn",
        codeOrder: codeOrder,
      })
        .unwrap()
        .then((res) => {
          if (res) window.location.href = res.vnpUrl;
        });
    }
  }, [codeOrder, createPayment, state]);

  const handleRepayment = async () => {
    if (codeOrder) {
      await getOrderDetail(codeOrder)
        .unwrap()
        .then(async (res) => {
          await createPayment({
            totalPricePayment: res.data.total,
            bankCode: "",
            language: "vn",
            codeOrder: codeOrder,
          })
            .unwrap()
            .then((res) => {
              if (res) window.location.href = res.vnpUrl;
            });
        })
        .catch((error) => {
          if (error.status === 403) {
            setError({
              status: true,
              message: "Đã xảy ra lỗi trong quá trình thanh toán đơn hàng",
            });
          } else if (error.status === 404) {
            setError({
              status: true,
              message: "Không tìm thấy đơn hàng của bạn",
            });
          }
        });
    }
  };

  useLayoutEffect(() => {
    handlePostCreatePayment();
  }, [handlePostCreatePayment]);

  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, []);

  if (!resData && !searchParams.get("vnp_ResponseCode"))
    return (
      <div
        className={cn(
          "relative w-full min-h-[600px] ",
          "before:absolute before:left-1/2 before:top-1/2  before:-translate-x-1/2 before:-translate-y-1/2 before:w-16  before:h-16 before:border-grayCa before:rounded-full before:border-4  before:z-20"
        )}
      >
        <span className="absolute z-30 w-16 h-16 -translate-x-1/2 -translate-y-1/2 rounded-full left-1/2 top-1/2">
          <LoadingSpinner className="w-16 h-16 border-4 left-1/2 top-1/2 border-r-orange border-l-transparent border-t-transparent border-b-transparent"></LoadingSpinner>
        </span>
      </div>
    );

  if (error.status) {
    return (
      <main className="w-full min-h-[500px] flex justify-center items-center">
        <div className="w-[400px] rounded-sm my-10 mx-auto bg-white min-h-[300px] p-5 flex flex-col gap-y-5 justify-center items-center ">
          <IconError size={50}></IconError>
          <h1 className="text-lg font-semibold">Thông báo</h1>
          <p className="text-center">{error.message}</p>
          <div className="text-sm flex gap-x-2">
            <Link
              to={`/user/account/purchaseOrder?keyword=${codeOrder}`}
              replace={true}
              onClick={() => {
                setError({
                  status: false,
                  message: "",
                });
              }}
            >
              <Button variant="default">Xem đơn hàng</Button>
            </Link>
          </div>
        </div>
      </main>
    );
  }

  if (!resData && searchParams.get("vnp_ResponseCode") === "24") {
    return (
      <main className="w-full min-h-[500px] flex justify-center items-center">
        <div className="w-[400px] rounded-sm my-10 mx-auto bg-white min-h-[300px] p-5 flex flex-col gap-y-5 justify-center items-center ">
          <IconError size={50}></IconError>
          <h1 className="text-lg font-semibold">Thông báo</h1>
          <p className="text-center">Giao dịch thanh toán đã hủy</p>
          <div className="text-sm flex gap-x-2">
            <Button variant="default" onClick={handleRepayment}>
              Thanh toán lại
            </Button>
          </div>
        </div>
      </main>
    );
  }

  if (resData && status === "fulfilled" && resData.RspCode !== "00") {
    return (
      <main className="w-full min-h-[500px] flex justify-center items-center">
        <div className="w-[400px] rounded-sm my-10 mx-auto bg-white min-h-[300px] p-5 flex flex-col gap-y-5 justify-center items-center ">
          <IconError size={50}></IconError>
          <h1 className="text-lg font-semibold">Thông báo</h1>
          <p className="text-center">{handleSetMessage(resData.RspCode)}</p>
          <div className="text-sm flex gap-x-2">
            {resData.RspCode !== "02" && (
              <Button variant="default" onClick={handleRepayment}>
                Thanh toán lại
              </Button>
            )}
            <Link to={`/user/account/purchaseOrder?keyword=${codeOrder}`}>
              <Button variant="default">xem đơn hàng</Button>
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <Fragment>
      <main className="w-full">
        <div className="w-[600px] rounded-sm my-10 mx-auto bg-white min-h-[600px] p-5 flex flex-col gap-y-3">
          <h1 className="flex text-green66 items-center justify-center gap-x-1 text-xl font-semibold">
            <IconSuccess size={30}></IconSuccess>Đặt hàng thành công
          </h1>
          <p className="text-sm py-2">
            Cảm ơn Anh/Chị đã mua hàng bên XVStore. Vui lòng theo dõi đơn hàng
            bằng cách bấm vào{" "}
            <Link
              to={"/user/account/purchaseOrder"}
              className="underline text-green"
            >
              Đơn Mua
            </Link>
          </p>
          <h2 className="text-lg font-semibold bg-neutral-100 pl-2 py-1 rounded-sm">
            Đơn hàng
          </h2>
          <div className="flex flex-col justify-start gap-y-2">
            <div>
              <span>Người nhận: </span>
              <span className="font-semibold">
                {resData?.data.customer.name}
              </span>
            </div>
            <div>
              <span>Số điện thoại: </span>
              <span className="font-semibold">
                {resData?.data.customer.phone}
              </span>
            </div>
            <div>
              <span>Địa chỉ nhận hàng: </span>
              <span className="font-semibold">
                {resData?.data.customer.address}
              </span>
            </div>
            <div>
              <span>Thời gian giao hàng dự kiến: </span>
              <span className="font-semibold">
                {resData &&
                  new Date(resData?.data.delivery_at).toLocaleDateString()}
              </span>
            </div>
            <div>
              <span>Tổng tiền: </span>
              <span className="text-danger font-semibold">
                {resData && formatPrice(resData?.data.total)}₫
              </span>
            </div>
            <div>
              <span>Phương thức thanh toán: </span>
              <span className="font-semibold">Thanh toán qua thẻ VNPAY</span>
            </div>
          </div>
          <div>
            <h2 className="text-lg font-semibold bg-neutral-100 pl-2 py-1 rounded-sm">
              sản phẩm mua
            </h2>
            <div
              className={cn(
                " flex flex-col gap-y-5 mt-2 px-2",
                resData &&
                  resData?.data.listProducts.length >= 2 &&
                  "overflow-y-scroll h-[150px]",
                resData &&
                  resData?.data.listProducts.length > 2 &&
                  "overflow-y-scroll"
              )}
            >
              {resData?.data.listProducts.map((product, index) => {
                const { size, productId, quantity, priceSale, price } = product;
                return (
                  <div key={index} className="h-[60px] flex text-sm gap-x-2">
                    <img
                      srcSet={productId.thumbnail.url}
                      alt=""
                      className="h-[60px]"
                    ></img>
                    <span className="flex flex-col justify-between w-full py-1">
                      <span className="line-clamp-1">{productId.name}</span>
                      <span>size:{size}</span>
                    </span>
                    <span className="flex flex-col justify-between min-w-10 py-1">
                      <span className="text-danger font-semibold">
                        {formatPrice(priceSale ? priceSale : price)}₫
                      </span>
                      <span>x{quantity}</span>
                    </span>
                  </div>
                );
              })}
            </div>
            <p className="text-sm text-gray98 text-center">
              (Nhân viên sẽ gọi xác minh trước khi gửi hàng)
            </p>
          </div>
          <Link
            to={`/user/account/purchaseOrder?keyword=${codeOrder}`}
            className="w-full"
          >
            <Button variant="outLine-flex" className="mt-5 mx-auto px-10">
              xem đơn mua
            </Button>
          </Link>
        </div>
      </main>
    </Fragment>
  );
}

export default PaymentPage;
