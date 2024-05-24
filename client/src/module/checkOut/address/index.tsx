import { IconAddress } from "@/components/icon/SidebarProfile";
import { ModalAddress } from "@/components/modal";
import { useToggle } from "@/hook";

function AddressCheckout() {
  const { toggle: openShow, handleToggle: handleShow } = useToggle();
  return (
    <section className="w-full bg-white relative py-7 px-[30px] flex flex-col gap-y-5 shadow-sm shadow-gray">
      <div className="w-full h-[3px] absolute top-0 left-0 borderCheckOut"></div>
      <div className="flex items-center text-xl gap-x-3 text-orange">
        <IconAddress size={20}></IconAddress>
        <h2>Địa Chỉ Nhận Hàng</h2>
      </div>
      <div className="flex items-center gap-x-3">
        <span className="font-bold">Bùi Xuân Vĩ (+84) 377825679</span>
        <span>Thôn Giao Tự, Xã Kim Sơn, Huyện Gia Lâm, Hà Nội</span>
        <span
          onClick={handleShow}
          className="ml-10 cursor-pointer text-blue hover:text-orange"
        >
          Thay đổi
        </span>
        <ModalAddress show={openShow} handleShow={handleShow}></ModalAddress>
      </div>
    </section>
  );
}

export default AddressCheckout;
