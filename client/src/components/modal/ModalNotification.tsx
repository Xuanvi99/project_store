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
  time?: number;
  variant?: "fixed" | "relative";
};

function ModalNotification({
  isOpen,
  onClick,
  children,
  className,
  time,
  variant,
}: TProps) {
  useEffect(() => {
    if (isOpen && time && time > 0) {
      let countDown = 5;
      const timer = setInterval(function () {
        countDown--;
        if (countDown === 0) {
          onClick();
          clearInterval(timer);
        }
      }, time);
    }
  }, [isOpen, onClick, time]);

  return (
    <Modal
      variant={variant}
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
