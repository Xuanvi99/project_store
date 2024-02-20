import { Button } from "../../../components/button";
import Field from "../../../components/fields";
import { Label } from "../../../components/label";
import Heading from "../common/Heading";
import { ModalAddress } from "../../../components/modal/index";
import { useToggle } from "../../../hook";

function FormAddress() {
  const { toggle: openShow, handleToggle: handleShow } = useToggle();
  return (
    <section className="max-w-[1000px]  w-full bg-white rounded  px-10">
      <Heading title="Địa chỉ của Bạn" className="flex flex-col justify-center">
        <p className="mt-1 text-sm text-gray">
          Quản lý thông tin địa chỉ giao hàng
        </p>
      </Heading>
      <div className="flex flex-col mt-5 gap-y-5">
        <div className="flex gap-x-10">
          <Field variant="flex-row">
            <Label>Họ và tên:</Label>
            <span>Bui xuan vi</span>
          </Field>
          <Field variant="flex-row">
            <Label>Số điện thoại:</Label>
            <span>0377825679</span>
          </Field>
        </div>

        <Field variant="flex-row">
          <Label>Tỉnh/Thành phố:</Label>
          <span>Tp Hà Nội</span>
        </Field>
        <Field variant="flex-row">
          <Label>Quận/Huyện:</Label>
          <span>Huyện Gia Lâm</span>
        </Field>
        <Field variant="flex-row">
          <Label>Phường/Xã:</Label>
          <span>xã Kim Sơn</span>
        </Field>
        <Field variant="flex-row">
          <Label>Địa chỉ cụ thể:</Label>
          <span>Thôn giao tự</span>
        </Field>
      </div>
      <Button
        variant="default"
        type="button"
        className="my-5"
        onClick={handleShow}
      >
        Cập nhật
      </Button>
      <ModalAddress show={openShow} handle={handleShow}></ModalAddress>
    </section>
  );
}

export default FormAddress;
