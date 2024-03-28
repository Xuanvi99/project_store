import Modal from ".";

type TProps = {
  isOpen: boolean;
  onClick: () => void;
  children: React.ReactNode;
};

function ModalNotification({ isOpen, onClick, children }: TProps) {
  if (isOpen) {
    let countDown = 5;
    const timer = setInterval(function () {
      countDown--;
      if (countDown === 0) {
        onClick();
        clearInterval(timer);
      }
    }, 1000);
  }

  return (
    <Modal
      isOpenModal={isOpen}
      onClick={onClick}
      className={{ overlay: "opacity-0" }}
    >
      <div className="w-[300px] p-5 relative rounded-md overflow-hidden">
        <div className="absolute bg-black opacity-70 inset-0 z-50"></div>
        <div className="relative z-[60] flex flex-col items-center text-white gap-y-5">
          {children}
        </div>
      </div>
    </Modal>
  );
}

export default ModalNotification;
