import { useRef, useEffect, useState, useCallback } from "react";

function useClickOutSide<T extends Element>(elementClick?: string) {
  const nodeRef = useRef<T>(null);

  const [show, setShow] = useState<boolean | null>(false);

  const handleClickOutSide = useCallback(
    (event: MouseEvent) => {
      const element = event.target as Element;
      if (!nodeRef.current?.contains(element)) {
        if (elementClick && element?.matches(elementClick)) {
          return;
        }
        setShow(false);
      }
    },
    [elementClick]
  );

  const handleShow = () => {
    setShow((show) => !show);
  };

  useEffect(() => {
    const handleClose = () => {
      if (!show) return;
      handleShow();
    };

    window.addEventListener("scroll", handleClose);

    return () => {
      window.removeEventListener("scroll", handleClose);
    };
  }, [show]);

  useEffect(() => {
    document.addEventListener("click", handleClickOutSide);
    return () => {
      document.removeEventListener("click", handleClickOutSide);
    };
  }, [handleClickOutSide]);

  return { show, handleShow, nodeRef };
}

export default useClickOutSide;
