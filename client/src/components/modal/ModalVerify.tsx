import { Button } from "../button";
import LoadingSpinner from "../loading";
import Modal from "./Modal";

type TProps = {
  children: React.ReactNode;
  isOpenModal: boolean;
  handleOpenModal: () => void;
  handleConfirm?: () => void;
  isLoading?: boolean;
};

function ModalVerify({
  children,
  isOpenModal,
  handleOpenModal,
  handleConfirm,
  isLoading = false,
}: TProps) {
  return (
    <Modal
      variant="fixed"
      isOpenModal={isOpenModal}
      onClick={handleOpenModal}
      className={{ content: "bg-white w-[350px] h-[200px] rounded-md " }}
    >
      <div className="flex flex-col w-full h-full p-4">
        <h1 className="text-lg font-semibold text-center">Thông báo</h1>
        {children}
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
            type="submit"
            className="text-xs"
            onClick={handleConfirm}
          >
            {isLoading ? <LoadingSpinner></LoadingSpinner> : "Xác nhận"}
          </Button>
        </div>
      </div>
    </Modal>
  );
}

export default ModalVerify;
