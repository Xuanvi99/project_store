import { Button } from "../../../components/button";
import Field from "../../../components/fields";
import { Label } from "../../../components/label";
import Heading from "../common/Heading";
import { ModalAddress } from "../../../components/modal/index";
import { useAppSelector, useToggle } from "../../../hook";
import { IconLocation, IconPlus } from "../../../components/icon";
import { useGetAddressQuery } from "../../../stores/service/address.service";
import { IAddress } from "../../../types/commonType";
import { useLayoutEffect, useState } from "react";

function FormAddress() {
  const user = useAppSelector((state) => state.authSlice.user);
  const { toggle: openShow, handleToggle: handleShow } = useToggle();

  const [address, setAddress] = useState<IAddress>();

  const id = user ? user._id : "";
  const { data, status } = useGetAddressQuery(id, { skip: !id });

  useLayoutEffect(() => {
    if (data && status === "fulfilled") {
      setAddress(data.address);
    }
  }, [data, status]);

  return (
    <section className="max-w-[1000px] w-full bg-white rounded px-10">
      <Heading className="flex justify-center">
        <div className="flex flex-col items-start justify-center basis-1/2">
          <h1 className="text-lg font-medium">Địa chỉ của Bạn</h1>
          <p className="mt-1 text-sm text-gray">
            Quản lý thông tin địa chỉ giao hàng
          </p>
        </div>
        <div className="flex items-center justify-end basis-1/2">
          {!address && (
            <Button
              variant="default"
              type="button"
              className="flex my-10 font-normal gap-x-2"
              onClick={handleShow}
            >
              <IconPlus size={20}></IconPlus> Thêm địa chỉ mới
            </Button>
          )}
        </div>
      </Heading>
      {address ? (
        <main>
          <div className="flex flex-col mt-5 gap-y-10">
            <div className="flex gap-x-10">
              <Field variant="flex-row" className="gap-x-3">
                <Label>Họ và tên:</Label>
                <span>{address.name}</span>
              </Field>
              <Field variant="flex-row" className="gap-x-3">
                <Label>Số điện thoại:</Label>
                <span>{address.phone}</span>
              </Field>
            </div>
            <Field variant="flex-row" className="gap-x-3">
              <Label>Tỉnh/Thành phố:</Label>
              <span>{address.province}</span>
            </Field>
            <Field variant="flex-row" className="gap-x-3">
              <Label>Quận/Huyện:</Label>
              <span>{address.district}</span>
            </Field>
            <Field variant="flex-row" className="gap-x-3">
              <Label>Phường/Xã:</Label>
              <span>{address.ward}</span>
            </Field>
            <Field variant="flex-row" className="gap-x-3">
              <Label>Địa chỉ cụ thể:</Label>
              <span>{address.specific}</span>
            </Field>
          </div>
          <Button
            variant="default"
            type="button"
            className="my-10"
            onClick={handleShow}
          >
            Thay đổi
          </Button>
        </main>
      ) : (
        <div className="flex flex-col items-center justify-center gap-y-5 h-[calc(100%-80px)]">
          <IconLocation></IconLocation>
          <span> Bạn chưa có địa chỉ.</span>
        </div>
      )}
      <ModalAddress show={openShow} handleShow={handleShow}></ModalAddress>
    </section>
  );
}

export default FormAddress;
