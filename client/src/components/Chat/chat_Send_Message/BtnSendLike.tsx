import { IconThumbs } from "@/components/icon";
import Tooltip from "@/components/tooltip";
import { cn } from "@/utils";
import { useEffect, useRef, useState } from "react";
import { ImageType } from "react-images-uploading";

type TProps = {
  onClick: (text: string) => void;
  messageText: string;
  messageImages: ImageType[];
};

function BtnSendLike({ onClick, messageText, messageImages }: TProps) {
  const thumbsRef = useRef<HTMLElement>(null);

  const [innerHtml, setInnerHtml] = useState<string>("");
  useEffect(() => {
    if (thumbsRef.current) {
      const svgElement = thumbsRef.current.innerHTML.trim();
      setInnerHtml(svgElement);
    }
  }, []);

  if (messageText || messageImages.length > 0) return;
  return (
    <div className="flex items-center justify-center rounded-full cursor-pointer w-9 h-9 max-w-9 hover:bg-white">
      <Tooltip
        place="top-end"
        className={{
          content:
            "z-40 text-[10px] whitespace-nowrap bg-black bg-opacity-80 text-white",
        }}
        onClick={() => {
          if (innerHtml) onClick(innerHtml);
        }}
        content={<p className="whitespace-nowrap">Nhấn Enter để gửi</p>}
      >
        <div
          className={cn(
            "relative flex items-center justify-center w-9 h-9 group text-orange",
            "before:absolute before:w-9 before:h-9 before:-translate-x-1/2 before:-translate-y-1/2 before:rounded-full before:bg-opacity-30 before:left-1/2 before:top-1/2 before:bg-orange before:opacity-0 hover:before:opacity-100"
          )}
        >
          <span ref={thumbsRef} className="w-5 h-5">
            <IconThumbs />
          </span>
        </div>
      </Tooltip>
    </div>
  );
}

export default BtnSendLike;
