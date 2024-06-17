import { useEffect } from "react";
import Modal from ".";
import { cn } from "@/utils";
import { IconError, IconInfo, IconSuccess } from "../icon";

type TProps = {
  isOpenModal: boolean;
  onClick: () => void;
  children: React.ReactNode;
  className?: {
    overlay?: string;
    content?: string;
  };
  time?: number;
  variant?: "fixed" | "relative";
  type: "success" | "error" | "info" | "warning" | "default";
};

function ModalNotification({
  isOpenModal,
  onClick,
  children,
  className,
  time,
  variant,
  type,
}: TProps) {
  useEffect(() => {
    if (isOpenModal && time && time > 0) {
      let countDown = 5;
      const timer = setInterval(function () {
        countDown--;
        if (countDown === 0) {
          onClick();
          clearInterval(timer);
        }
      }, time);
    }
  }, [isOpenModal, onClick, time]);

  const selectIconModal = (
    type: "success" | "error" | "info" | "warning" | "default"
  ) => {
    switch (type) {
      case "success":
        return (
          <span className={"text-green66"}>
            <IconSuccess size={50}></IconSuccess>
          </span>
        );
      case "error":
        return (
          <span className={"text-danger z-50"}>
            <IconError size={50}></IconError>
          </span>
        );
      case "warning":
        return (
          <span className={"text-orangeFe z-50"}>
            <IconError size={50}></IconError>
          </span>
        );

      case "info":
        return (
          <span className={"text-white z-50"}>
            <IconInfo size={50}></IconInfo>
          </span>
        );
      default:
        break;
    }
  };

  return (
    <Modal
      variant={variant}
      isOpenModal={isOpenModal}
      onClick={onClick}
      className={{
        overlay: cn("opacity-10 bg-white", className?.overlay),
        content: cn(
          "relative flex flex-col p-5 items-center justify-center gap-y-5 rounded-md text-white overflow-hidden w-[350px] h-[200px]",
          className?.content + ""
        ),
      }}
    >
      <div className="absolute inset-0 z-50 bg-black rounded-md opacity-70"></div>
      {selectIconModal(type)}
      <div className="z-50 text-center">{children}</div>
    </Modal>
  );
}

export default ModalNotification;
