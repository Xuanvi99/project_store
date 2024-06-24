import { Button } from "@/components/button";
import { IconPlus } from "@/components/icon";
import { IconAddress } from "@/components/icon/SidebarProfile";
import LoadingSpinner from "@/components/loading";
import { ModalAddress } from "@/components/modal";
import { useAppSelector } from "@/hook";
import useTestContext from "@/hook/useTestContext";
import { RootState } from "@/stores";
import { useGetAddressQuery } from "@/stores/service/address.service";
import { IUser } from "@/types/user.type";
import { cn } from "@/utils";
import { CheckoutContext, ICheckoutProvide } from "../context";
import { useCallback, useEffect, useState } from "react";
import {
  usePostServiceShipMutation,
  usePostShippingFeeMutation,
  usePostTimeShippingMutation,
} from "@/stores/service/transport.service";
import { resServiceShip } from "@/types/transport.type";

function AddressCheckout() {
  const user: IUser | null = useAppSelector(
    (state: RootState) => state.authSlice.user
  );

  const {
    setAddressOrder,
    setShippingFree,
    quantityProductOrder,
    setDeliveryTime,
  } = useTestContext<ICheckoutProvide>(
    CheckoutContext as React.Context<ICheckoutProvide>
  );

  const [openShowModal, setOpenShowModal] = useState<boolean>(false);
  const [addressId, setAddressId] = useState<{
    districtId: number;
    wardCode: string;
  }>({ districtId: 0, wardCode: "" });

  const id = user ? user._id : "";
  const { data: dataAddress, status: statusAddress } = useGetAddressQuery(id, {
    skip: !id,
  });

  const [postShippingFee] = usePostShippingFeeMutation();
  const [postTimeShipping] = usePostTimeShippingMutation();
  const [postServiceShip] = usePostServiceShipMutation();

  const handleShowModal = () => {
    setOpenShowModal(!openShowModal);
  };

  const handleCalculateShippingFee = useCallback(async () => {
    if (addressId.districtId > 0) {
      await postServiceShip({
        shop_id: +import.meta.env.VITE_SHOP_ID,
        from_district: +import.meta.env.VITE_ADDRESS_DISTRICT_STORE,
        to_district: addressId.districtId,
      })
        .unwrap()
        .then(async (res) => {
          const data: resServiceShip[] = res.data;
          await postShippingFee({
            service_id: data[0]?.service_id || 53321,
            insurance_value: 500000,
            coupon: null,
            from_district_id: +import.meta.env.VITE_ADDRESS_DISTRICT_STORE,
            from_ward_code: import.meta.env.VITE_ADDRESS_WARD_STORE,
            to_district_id: addressId.districtId,
            to_ward_code: addressId.wardCode,
            height: 15,
            length: 15,
            weight: 1000,
            width: 15,
          })
            .unwrap()
            .then((res) => {
              setShippingFree(res.data.total);
            });
          await postTimeShipping({
            service_id: data[0]?.service_id || 53321,
            from_district_id: +import.meta.env.VITE_ADDRESS_DISTRICT_STORE,
            from_ward_code: import.meta.env.VITE_ADDRESS_WARD_STORE,
            to_district_id: addressId.districtId,
            to_ward_code: addressId.wardCode,
          })
            .unwrap()
            .then((res) => {
              setDeliveryTime(new Date(res.data.leadtime * 1000));
            });
        });
    }
  }, [
    addressId.districtId,
    addressId.wardCode,
    postServiceShip,
    postShippingFee,
    postTimeShipping,
    setDeliveryTime,
    setShippingFree,
  ]);

  useEffect(() => {
    if (dataAddress && statusAddress === "fulfilled") {
      const addressOrder = `${dataAddress.address.specific}, ${dataAddress.address.ward}, ${dataAddress?.address.district}, TP ${dataAddress?.address.province}`;
      setAddressOrder({
        name: dataAddress.address.name,
        phone: dataAddress.address.phone,
        address: addressOrder,
      });
      setAddressId({
        districtId: dataAddress.address.districtId,
        wardCode: dataAddress.address.wardCode || "",
      });
    }
  }, [dataAddress, setAddressOrder, statusAddress]);

  useEffect(() => {
    if (!dataAddress && statusAddress === "rejected") {
      setOpenShowModal(true);
    }
  }, [dataAddress, statusAddress]);

  useEffect(() => {
    handleCalculateShippingFee();
  }, [handleCalculateShippingFee, quantityProductOrder]);

  return (
    <section className="w-full bg-white relative py-7 px-[30px] flex flex-col gap-y-5 shadow-sm shadow-gray">
      <div className="w-full h-[3px] absolute top-0 left-0 borderCheckOut"></div>
      <div className="flex items-center text-xl gap-x-3 text-orange">
        <IconAddress size={20}></IconAddress>
        <h2>Địa Chỉ Nhận Hàng</h2>
      </div>
      {statusAddress === "fulfilled" && (
        <div className="flex items-center gap-x-3">
          <div className="flex font-bold gap-x-2">
            <span>{dataAddress?.address.name}</span>
            <span>(+84)</span>
            <span>{dataAddress?.address.phone}</span>
          </div>
          <span>
            {dataAddress?.address.specific}, {dataAddress?.address.ward},{" "}
            {dataAddress?.address.district}, {dataAddress?.address.province}
          </span>
          <span
            onClick={handleShowModal}
            className="ml-10 cursor-pointer text-blue hover:text-orange"
          >
            Thay đổi
          </span>
        </div>
      )}
      {statusAddress === "pending" && (
        <div
          className={cn(
            "relative w-full py-5",
            "before:absolute before:left-1/2 before:top-1/2  before:-translate-x-1/2 before:-translate-y-1/2 before:w-10  before:h-10 before:rounded-full before:border-4 before:border-grayCa before:z-20"
          )}
        >
          <span className="absolute z-30 w-10 h-10 -translate-x-1/2 -translate-y-1/2 rounded-full left-1/2 top-1/2">
            <LoadingSpinner className="w-10 h-10 border-4 left-1/2 top-1/2 border-r-orangeFe border-l-transparent border-t-transparent border-b-transparent"></LoadingSpinner>
          </span>
        </div>
      )}
      {!dataAddress && statusAddress === "rejected" && (
        <div className="flex justify-start">
          <Button
            variant="default"
            type="button"
            className="flex my-5 font-normal gap-x-2"
            onClick={handleShowModal}
          >
            <IconPlus size={20}></IconPlus> Thêm địa chỉ
          </Button>
        </div>
      )}
      <ModalAddress
        show={openShowModal}
        handleShow={handleShowModal}
        checkAddress={
          !dataAddress && statusAddress === "rejected" ? false : true
        }
      ></ModalAddress>
    </section>
  );
}

export default AddressCheckout;
