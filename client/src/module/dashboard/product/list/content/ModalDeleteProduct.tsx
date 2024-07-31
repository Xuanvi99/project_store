import { Button } from "@/components/button";
import Modal from "@/components/modal";

type TProps = {
  openModal: boolean;
  handleOpenModal: () => void;
  handleDeleteProduct: () => void;
};

function ModalDeleteProduct({
  openModal,
  handleOpenModal,
  handleDeleteProduct,
}: TProps) {
  return (
    <Modal
      variant="fixed"
      isOpenModal={openModal}
      onClick={handleOpenModal}
      className={{ content: "bg-white w-[350px] h-[200px] rounded-md " }}
    >
      <div className="flex flex-col w-full h-full p-4">
        <h1 className="text-lg font-semibold text-center">Thông báo</h1>
        <p className="mt-3 text-sm">
          Bạn có chắc chắn muốn xóa sản phẩm vào thùng rác?
        </p>
        <div className="flex justify-end mt-auto gap-x-3">
          <Button
            variant="outLine"
            type="button"
            className="text-xs"
            onClick={handleOpenModal}
          >
            Trở lại
          </Button>
          <Button
            variant="default"
            type="button"
            className="text-xs"
            onClick={handleDeleteProduct}
          >
            Xóa
          </Button>
        </div>
      </div>
    </Modal>
  );
}

export default ModalDeleteProduct;
