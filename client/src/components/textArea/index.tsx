import { useLayoutEffect, useRef, useState } from "react";
import { cn } from "../../utils";

type TTextAreaProps = {
  className?: string;
  textValue: string;
  handleChange: (value: string) => void;
} & React.DetailedHTMLProps<
  React.TextareaHTMLAttributes<HTMLTextAreaElement>,
  HTMLTextAreaElement
>;

function TextArea({
  className,
  handleChange,
  textValue,
  ...props
}: TTextAreaProps) {
  const [scrollTextArea, setScrollTextArea] = useState<"hidden" | "scroll">(
    "hidden"
  );
  const textAreaRef = useRef<HTMLTextAreaElement>(null);

  const handleTextArea = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    handleChange(event.target.value);
  };
  useLayoutEffect(() => {
    if (textAreaRef.current && textAreaRef.current.scrollHeight > 150) {
      setScrollTextArea("scroll");
    }
  }, [textValue]);

  return (
    <textarea
      {...props}
      ref={textAreaRef}
      value={textValue}
      onChange={(event) => handleTextArea(event)}
      aria-required="true"
      className={cn(
        "w-full p-[10px] max-h-[150px] outline-none transition-all resize-none border-[1px] border-grayCa rounded-t ",
        scrollTextArea === "hidden" ? "overflow-hidden" : "overflow-y-scroll",
        className
      )}
    />
  );
}

export default TextArea;
