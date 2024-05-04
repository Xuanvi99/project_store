import { useEffect } from "react";
import Modal from ".";
import { cn } from "@/utils";

type TProps = {
  isOpen: boolean;
  onClick: () => void;
  children: React.ReactNode;
  className?: {
    overlay?: string;
    content?: string;
  };
};

function ModalNotification({ isOpen, onClick, children, className }: TProps) {
  useEffect(() => {
    if (isOpen) {
      let countDown = 5;
      const timer = setInterval(function () {
        countDown--;
        if (countDown === 0) {
          onClick();
          clearInterval(timer);
        }
      }, 800);
    }
  }, [isOpen, onClick]);

  return (
    <Modal
      isOpenModal={isOpen}
      onClick={onClick}
      className={{
        overlay: cn("opacity-0", className?.overlay),
        content: className?.content,
      }}
    >
      {children}
    </Modal>
  );
}

export default ModalNotification;
