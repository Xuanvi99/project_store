import { RefObject, useEffect, useState } from "react";

function useHover<T extends RefObject<Element>>(nodeRef: T) {
  const [isHover, setIsHover] = useState(false);
  const [coords, setCoords] = useState<DOMRect>();

  useEffect(() => {
    const mouseHover = nodeRef.current;
    if (!mouseHover) return;
    const handleMouseover = () => {
      setIsHover(true);
      setCoords(mouseHover.getBoundingClientRect());
    };
    const handleMouseOut = () => {
      setIsHover(false);
    };
    mouseHover.addEventListener("mouseover", handleMouseover);
    mouseHover.addEventListener("mouseout", handleMouseOut);

    return () => {
      mouseHover.removeEventListener("mouseover", handleMouseover);
      mouseHover.removeEventListener("mouseout", handleMouseOut);
    };

    return () => {};
  }, [nodeRef]);

  return { isHover, coords };
}

export default useHover;
