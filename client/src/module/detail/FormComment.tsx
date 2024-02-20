import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { ImageListType } from "react-images-uploading";
import { IconCLose, IconCamera, IconRemoveBtn } from "../../components/icon";
import ImageUploading from "react-images-uploading";
import { cn } from "../../utils";
import IconStar from "../../components/icon/IconStar";

type IFormComponent = {
  handleCloseForm: () => void;
  type: "comment" | "reviews";
  className?: {
    form?: string;
    title?: string;
    text?: string;
    btn?: string;
  };
};

function FormComment({ handleCloseForm, className, type }: IFormComponent) {
  const maxNumber = 3;
  const [images, setImages] = useState([]);
  const [textArea, setTextArea] = useState<string>("");
  const [starActive, setStarActive] = useState<number>(5);
  const [scrollTextArea, setScrollTextArea] = useState<"hidden" | "scroll">(
    "hidden"
  );
  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  const starRef = useRef<HTMLDivElement>(null);

  const onChangeImage = (
    imageList: ImageListType,
    addUpdateIndex: number[] | undefined
  ) => {
    console.log(imageList, addUpdateIndex);
    setImages(imageList as never[]);
  };

  const handleTextArea = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setTextArea(event.target.value);
  };

  useLayoutEffect(() => {
    if (textAreaRef.current && textAreaRef.current.scrollHeight > 150) {
      setScrollTextArea("scroll");
    }
  }, [textArea]);

  useEffect(() => {
    const nodeRef = starRef.current;
    if (!nodeRef) return;

    let starTarget = nodeRef.firstChild as HTMLSpanElement;
    for (let i = 1; i <= 5; i++) {
      if (i > starActive) {
        starTarget.classList.remove("text-orangeFe");
      } else {
        starTarget.classList.add("text-orangeFe");
      }
      starTarget = starTarget.nextElementSibling as HTMLSpanElement;
    }
  }, [starActive]);

  return (
    <form
      className={cn(
        "w-full bg-grayF5 p-[10px] pb-8  relative z-50",
        type === "reviews" ? "" : "displayForm",
        className?.form
      )}
    >
      <div
        className={cn("flex items-center justify-between", className?.title)}
      >
        <h3 className={"inline pl-[10px] font-bold"}>Đánh giá Giày</h3>
        <span
          onClick={handleCloseForm}
          className="text-red-600 cursor-pointer hover:scale-110"
        >
          <IconCLose size={20}></IconCLose>
        </span>
      </div>
      <div className="px-5 mt-5">
        <textarea
          id="comment"
          name="comment"
          cols={45}
          rows={8}
          minLength={3}
          ref={textAreaRef}
          value={textArea}
          onChange={(event) => handleTextArea(event)}
          placeholder="Mời bạn chia sẻ thêm một số cảm nhận..."
          aria-required="true"
          className={cn(
            "w-full p-[10px] max-h-[120px] outline-none  transition-all resize-none border-[1px] border-grayCa rounded-t ",
            scrollTextArea === "hidden"
              ? "overflow-hidden"
              : "overflow-y-scroll",
            className?.text
          )}
        />
        <ImageUploading
          multiple
          value={images}
          onChange={onChangeImage}
          maxNumber={maxNumber}
          dataURLKey="data_url"
        >
          {({ imageList, onImageUpload, onImageRemove }) => (
            <>
              <div className="w-full border-[1px] border-grayCa rounded-b p-[5px] flex justify-between items-center">
                <span
                  onClick={onImageUpload}
                  className="flex items-center justify-start text-lg cursor-pointer gap-x-2 text-blue"
                >
                  <IconCamera size={30}></IconCamera>Gửi hình chụp thực tế
                </span>
                <span className="text-gray">0 ký tự (Tối thiểu 3)</span>
              </div>
              {imageList.length > 0 && (
                <div className="flex items-center mt-5 upload__image-wrapper gap-x-5">
                  {imageList.map((image, index) => {
                    return (
                      <span key={index} className="w-[80px] h-[80px] relative">
                        <img
                          alt=""
                          srcSet={image["data_url"]}
                          className="object-cover w-full h-full rounded-md"
                        />
                        <span
                          onClick={() => onImageRemove(index)}
                          className="absolute top-[-10px] right-[-5px] z-20 hover:text-red-600 cursor-pointer"
                        >
                          <IconRemoveBtn size={20}></IconRemoveBtn>
                        </span>
                      </span>
                    );
                  })}
                  {imageList.length < 3 && (
                    <span
                      onClick={onImageUpload}
                      className="w-[80px] h-[80px] border-dashed border-4 border-grayCa flex justify-center items-center cursor-pointer"
                    >
                      <span className="text-4xl font-bold text-grayCa">+</span>
                    </span>
                  )}
                </div>
              )}
            </>
          )}
        </ImageUploading>
      </div>
      {type === "reviews" && (
        <div
          className="flex items-center justify-center mt-10 gap-x-7 text-gray"
          ref={starRef}
        >
          {Array(5)
            .fill("")
            .map((_, index) => {
              return (
                <span
                  key={index}
                  onClick={() => {
                    setStarActive(index + 1);
                  }}
                  className="duration-300 cursor-pointer hover:scale-125"
                >
                  <IconStar size={30}></IconStar>
                </span>
              );
            })}
        </div>
      )}
      <div className="mt-10 text-center">
        <button
          type="submit"
          className={cn(
            "px-3 py-2 font-bold text-white rounded-md bg-orangeLinear",
            className?.btn
          )}
        >
          Gửi đánh giá
        </button>
      </div>
    </form>
  );
}

export default FormComment;
