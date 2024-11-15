import { useEffect, useRef } from "react";
import Portal from "../portal";
import { cn } from "../../utils";

type IModalBaseProps = {
  children: React.ReactNode;
  className?: {
    overlay?: string;
    content?: string;
  };
  isOpenModal: boolean;
  onClick?: () => void;
  variant?: "fixed" | "relative";
};

function Modal({
  children,
  onClick,
  isOpenModal,
  className,
  variant,
}: IModalBaseProps) {
  const nodeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (variant && variant === "fixed") {
      switch (isOpenModal) {
        case true:
          document.body.style.overflowY = "hidden";
          break;
        default:
          document.body.style.overflowY = "";
      }
    }
  }, [variant, isOpenModal]);

  if (!isOpenModal) return;

  return (
    <Portal>
      <div
        ref={nodeRef}
        className="fixed inset-0 flex items-center justify-center w-full h-screen z-[60] "
      >
        <div
          onClick={onClick}
          className={cn(
            "absolute inset-0 z-50 bg-black opacity-70",
            className?.overlay
          )}
        ></div>
        <div className={cn("z-[60]", className?.content)}>{children}</div>
      </div>
    </Portal>
  );
}

export default Modal;
