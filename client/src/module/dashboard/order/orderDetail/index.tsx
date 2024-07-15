import {
  useEditCancelledOrderMutation,
  useGetOrderDetailQuery,
  useUpdateOrderMutation,
} from "@/stores/service/order.service";
import { useSearchParams } from "react-router-dom";
import InfoProductOrder from "./InfoProductOrder";
import { IconShoppingFee } from "@/components/icon";
import {
  FormatPaymentStatusOrder,
  FormatShippingUnit,
  FormatStatusOrder,
} from "@/utils/order.utils";
import { Button } from "@/components/button";
import {
  useCanceledOrderTransportMutation,
  usePostCreateOrderMutation,
} from "@/stores/service/transport.service";
import { useGetAddressQuery } from "@/stores/service/address.service";
import { useAppSelector } from "@/hook";
import { RootState } from "@/stores";
import { useCallback, useEffect, useState } from "react";
import { reqCreateOrder } from "@/types/transport.type";
import { ModalNotification } from "@/components/modal";
import LoadingSpinner, { LoadingCallApi } from "@/components/loading";

type TParams = {
  [P in keyof reqCreateOrder]?: reqCreateOrder[P];
};

function OrderDetail() {
  const user = useAppSelector((state: RootState) => state.authSlice.user);

  const [searchParams] = useSearchParams();
  const codeOrder = searchParams.get("codeOrder") || "";

  const { data: dataOrderDetail, status: statusOrderDetail } =
    useGetOrderDetailQuery(codeOrder);

  console.log(dataOrderDetail);

  const id = user ? user._id : "";
  const { data: dataAddress, status: statusAddress } = useGetAddressQuery(id, {
    skip: !id,
  });

  const [postCreateOrder] = usePostCreateOrderMutation();
  const [updateOrder] = useUpdateOrderMutation();
  const [canceledOrderTransport] = useCanceledOrderTransportMutation();
  const [EditCancelledOrder, { isLoading: isLoadingCancelledOrder }] =
    useEditCancelledOrderMutation();

  const [reqCreateOrder, setReqCreateOrder] = useState<reqCreateOrder>({
    payment_type_id: 2,
    note: "",
    required_note: "KHONGCHOXEMHANG",
    from_name: "XVStore",
    from_phone: "0377825679",
    from_address: import.meta.env.VITE_FROM_ADDRESS_NAME,
    from_ward_name: import.meta.env.VITE_FROM_WARD_NAME,
    from_district_name: import.meta.env.VITE_FROM_DISTRICT_NAME,
    from_province_name: import.meta.env.VITE_FROM_PROVINCE_NAME,
    return_phone: "0377825679",
    return_address: import.meta.env.VITE_FROM_ADDRESS_NAME,
    return_district_id: +import.meta.env.VITE_ADDRESS_DISTRICT_STORE,
    return_ward_code: import.meta.env.VITE_ADDRESS_WARD_STORE,
    client_order_code: "",
    to_name: "",
    to_phone: "",
    to_address: "",
    to_ward_code: "",
    to_district_id: 0,
    cod_amount: 0,
    content: "",
    weight: 200,
    length: 0,
    width: 20,
    height: 20,
    pick_station_id: 1444,
    deliver_station_id: null,
    insurance_value: 0,
    service_id: 0,
    service_type_id: 2,
    coupon: null,
    pick_shift: [2],
    items: [],
  });

  const [openModal, setOpenModal] = useState<boolean>(false);

  const [notify, setNotify] = useState<{
    type: "success" | "error" | "info" | "warning" | "default";
    message: string;
  }>({ type: "default", message: "" });

  const handleSetReqCreateOrder = useCallback((value: TParams) => {
    setReqCreateOrder((reqCreateOrder) => ({
      ...reqCreateOrder,
      ...value,
    }));
  }, []);

  const handleCreateOrderShipping = async () => {
    if (dataOrderDetail && statusOrderDetail === "fulfilled") {
      await postCreateOrder(reqCreateOrder)
        .unwrap()
        .then(async (res) => {
          const { order_code, expected_delivery_time } = res.data;
          await updateOrder({
            codeOrder: dataOrderDetail.order.codeOrder,
            body: {
              shippingCode: order_code,
              delivery_at: new Date(expected_delivery_time),
              statusOrder: "confirmed",
            },
          })
            .unwrap()
            .then(() => {
              setNotify({
                type: "success",
                message: "Đơn hàng đã xác nhận và tạo đơn thành công",
              });
            })
            .catch(() => {
              setNotify({ type: "error", message: "Lỗi cập nhật đơn hàng" });
            });
        })
        .catch(() => {
          setNotify({ type: "error", message: "Lỗi tạo đơn hàng" });
        })
        .finally(() => {
          setOpenModal(true);
        });
    }
  };

  const handleCanceledOrder = async () => {
    if (user && dataOrderDetail) {
      const body = {
        reasonCanceled: "Đã hủy bởi ADMIN",
        canceller: user._id,
      };
      await EditCancelledOrder({
        codeOrder: dataOrderDetail.order.codeOrder,
        body,
      })
        .unwrap()
        .then(async () => {
          if (dataOrderDetail.order.shippingCode) {
            await canceledOrderTransport({
              order_codes: [dataOrderDetail.order.shippingCode],
            })
              .unwrap()
              .then(async () => {
                setNotify({
                  type: "success",
                  message: "Đơn hàng đã hủy thành công",
                });
              })
              .catch(() => {
                setNotify({ type: "error", message: "Lỗi hủy đơn hàng" });
              });
          } else {
            setNotify({
              type: "success",
              message: "Đơn hàng đã hủy thành công",
            });
          }
        })
        .catch(() => {
          setNotify({
            type: "error",
            message: "Lỗi cập nhật hủy đơn hàng",
          });
        })
        .finally(() => {
          setOpenModal(true);
        });
    }
  };

  useEffect(() => {
    if (dataAddress && statusAddress === "fulfilled") {
      handleSetReqCreateOrder({
        to_ward_code: dataAddress.address.wardCode + "",
        to_district_id: dataAddress.address.districtId,
        pick_station_id: dataAddress.address.districtId,
      });
    }
  }, [dataAddress, handleSetReqCreateOrder, statusAddress]);

  useEffect(() => {
    if (dataOrderDetail && statusOrderDetail === "fulfilled") {
      const { customer, total, codeOrder, note, listProducts, quantityOrder } =
        dataOrderDetail.order;

      let content = "";
      for (const product of listProducts) {
        content += product.productId.name + `(${product.quantity}), `;
      }

      const items = [];
      for (const product of listProducts) {
        items.push({
          name: product.productId.name,
          code: product.productId._id,
          quantity: product.quantity,
          price: product.priceSale ? product.priceSale : product.price,
          length: product.quantity,
          width: 30,
          height: 20,
          weight: 3,
        });
      }

      handleSetReqCreateOrder({
        payment_type_id: 1,
        to_name: customer.name,
        to_phone: customer.phone,
        to_address: customer.address,
        cod_amount: total,
        client_order_code: codeOrder,
        insurance_value: total,
        note,
        content,
        length: quantityOrder,
      });
    }
  }, [dataOrderDetail, handleSetReqCreateOrder, statusOrderDetail]);

  if (!dataOrderDetail || statusOrderDetail === "pending") {
    return (
      <LoadingCallApi size={16} className={{ wrap: "mt-20" }}></LoadingCallApi>
    );
  }

  if (!dataOrderDetail || statusOrderDetail === "rejected") {
    return (
      <div className="px-6 mt-5 detail-order">
        <div className="rounded-sm min-h-[400px] mt-3 px-6 bg-white flex flex-col justify-center items-center gap-y-3">
          <img alt="" srcSet="/orderNull.png" className="w-40" />
          <p>Không tìm thấy đơn hàng </p>
        </div>
      </div>
    );
  }

  return (
    <div className="detail-order">
      <ModalNotification
        type={notify.type}
        isOpenModal={openModal}
        onClick={() => setOpenModal(false)}
        time={700}
        className={{
          content: "w-[350px] gap-x-5 text-white font-semibold",
        }}
      >
        <span>{notify.message}</span>
      </ModalNotification>
      <div className="w-full p-5 bg-white border-b-1 border-b-grayCa">
        <div className="pb-5 border-b-1 border-b-grayCa">
          <h1 className="text-lg font-semibold">
            Đơn hàng{" "}
            <span className="underline text-blue">
              #{searchParams.get("codeOrder")}
            </span>
          </h1>
          <span className="mt-2 text-sm text-gray98">
            Thông tin chi tiết đơn hàng và xác nhận đơn hàng tại đây
          </span>
        </div>
        <div className="flex flex-col mt-5 gap-y-3">
          <div className="flex gap-x-2">
            <span>Trạng thái:</span>
            <span className="font-semibold text-danger">
              {FormatStatusOrder(dataOrderDetail.order.statusOrder)}
            </span>
          </div>
          <div className="flex text-sm gap-x-2">
            <span>Thời gian đặt hàng:</span>
            <span>
              {"" + new Date(dataOrderDetail.order.createdAt).toLocaleString()}
            </span>
          </div>
          {dataOrderDetail.order.statusOrder !== "cancelled" && (
            <div className="flex text-sm gap-x-2">
              <span>Thời gian dự kiến:</span>
              <span>
                {"" +
                  new Date(
                    dataOrderDetail.order.delivery_at
                  ).toLocaleDateString()}
              </span>
            </div>
          )}
          {dataOrderDetail.order.statusOrder === "cancelled" && (
            <>
              <div className="flex gap-x-2">
                <span>Thời gian hủy:</span>
                <span>
                  {new Date(
                    dataOrderDetail.order.canceled_at
                  ).toLocaleTimeString()}
                  ,{" "}
                  {new Date(
                    dataOrderDetail.order.canceled_at
                  ).toLocaleDateString()}
                </span>
              </div>
              <div className="flex gap-x-2">
                <span>Lý do:</span>
                <span className="text-sm italic font-semibold">
                  {dataOrderDetail.order.reasonCanceled}
                </span>
              </div>
            </>
          )}
        </div>
        <div className="flex mt-5 gap-x-2">
          <div className="basis-1/3">
            <h2 className="font-semibold text-start">Thông tin người đặt </h2>
            <div className="grid grid-cols-[70px_auto] grid-rows-[40px_40px_40px] mt-2 text-sm border-1 border-orange rounded-md p-5">
              <span>Tên:</span>
              <span className={"font-semibold"}>
                {dataOrderDetail.order.customer.name}
              </span>
              <span>Số đt:</span>
              <span className={"font-semibold"}>
                {dataOrderDetail.order.customer.phone}
              </span>
              <span>Địa chỉ:</span>
              <span className={"font-semibold"}>
                {dataOrderDetail.order.customer.address}
              </span>
            </div>
          </div>
          <div className="basis-1/3">
            <h2 className="font-semibold text-start">Thông tin thanh toán</h2>
            <div className="grid grid-cols-[100px_auto] grid-rows-[40px_40px_40px] mt-2 text-sm border-1 border-orange rounded-md p-5">
              <span>Hình thức:</span>
              <span className={"font-semibold"}>
                {dataOrderDetail.order.paymentMethod === "cod"
                  ? "Thanh toán khi nhận(COD)"
                  : "Thanh toán Vnpay"}
              </span>
              <span>Mã hóa đơn:</span>
              <span className={"font-semibold"}>
                {dataOrderDetail.order.codeBill || "Không"}
              </span>
              <span>Trạng thái:</span>
              <span className={"font-semibold"}>
                {"" +
                  FormatPaymentStatusOrder(dataOrderDetail.order.paymentStatus)}
              </span>
            </div>
          </div>
          <div className="basis-1/3">
            <h2 className="font-semibold text-start">Thông tin vận chuyển</h2>
            <div className="grid grid-cols-[100px_auto] grid-rows-[40px_40px_40px] mt-2 text-sm border-1 border-orange rounded-md p-5">
              <span className="col-span-2">
                <IconShoppingFee size={40}></IconShoppingFee>
              </span>
              <span> Đơn vị:</span>
              <span className={"font-semibold"}>
                {FormatShippingUnit(dataOrderDetail.order.shippingUnit)}
              </span>
              <span>Mã đơn hàng:</span>
              <span className={"font-semibold"}>
                {dataOrderDetail.order.shippingCode || "Chưa đăng ký"}
              </span>
            </div>
          </div>
        </div>
        <InfoProductOrder data={dataOrderDetail?.order}></InfoProductOrder>
        <div className="flex items-center justify-end mt-10 text-sm gap-x-4">
          {dataOrderDetail.order.statusOrder === "pending" ||
          dataOrderDetail.order.statusOrder === "confirmed" ? (
            <Button
              variant="default"
              type="button"
              onClick={handleCanceledOrder}
              className={
                isLoadingCancelledOrder
                  ? "min-w-[80px] flex justify-center"
                  : ""
              }
            >
              {isLoadingCancelledOrder ? (
                <LoadingSpinner className=""></LoadingSpinner>
              ) : (
                "Hủy đơn"
              )}
            </Button>
          ) : (
            <></>
          )}
          {dataOrderDetail.order.statusOrder === "pending" && (
            <Button
              variant="default"
              type="button"
              onClick={handleCreateOrderShipping}
            >
              Xác nhận
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

export default OrderDetail;
