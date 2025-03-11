import { IconSendMessage, IconThumbs } from "@/components/icon";
import Tooltip from "@/components/tooltip";
import { useEffect, useRef, useState } from "react";
import { ImageType } from "react-images-uploading";

type TProps = {
  onClick: () => void;
  messageText: string;
  messageImages: ImageType[];
};
function BtnSendMessage({ onClick, messageText, messageImages }: TProps) {
  const btnRef = useRef<HTMLDivElement>(null);

  const [htmlThumbs, setHtmlThumbs] = useState<string>("");

  useEffect(() => {
    if (btnRef.current) {
      const svgThumbs = btnRef.current.getElementsByTagName("svg");
      setHtmlThumbs(svgThumbs[0].innerHTML.trim());
    }
  }, []);

  return (
    <div
      ref={btnRef}
      className="flex items-center justify-center rounded-full cursor-pointer w-9 h-9 max-w-9 hover:bg-white"
    >
      {messageText.length > 0 || messageImages.length > 0 ? (
        <Tooltip
          place="top-end"
          className={{
            content:
              "z-40 text-[10px] whitespace-nowrap bg-black bg-opacity-80 text-white",
          }}
          onClick={onClick}
          content={<p className="whitespace-nowrap">Nhấn Enter để gửi</p>}
        >
          <div className="relative flex items-center justify-center w-9 h-9 group text-orange">
            <IconSendMessage size={26} />
            <span className="absolute z-20 invisible transition-all -translate-x-1/2 -translate-y-1/2 rounded-full w-9 h-9 bg-opacity-30 left-1/2 top-1/2 bg-orange group-hover:visible"></span>
          </div>
        </Tooltip>
      ) : (
        <Tooltip
          place="top-end"
          className={{
            content:
              "z-40 text-[10px] whitespace-nowrap bg-black bg-opacity-80 text-white",
          }}
          content={<p className="whitespace-nowrap">Gửi lượt thích</p>}
        >
          <div className="relative flex items-center justify-center w-9 h-9 group text-orange">
            <IconThumbs size={20} />
            <span className="absolute z-20 invisible transition-all -translate-x-1/2 -translate-y-1/2 rounded-full w-9 h-9 bg-opacity-30 left-1/2 top-1/2 bg-orange group-hover:visible"></span>
          </div>
        </Tooltip>
      )}
    </div>
  );
}

export default BtnSendMessage;
