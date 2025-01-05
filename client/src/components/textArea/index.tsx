import { useEffect, useRef } from "react";
import { cn } from "../../utils";

export type TTextAreaProps = {
  className?: string;
  textValue: string;
  handleChange: (value: string) => void;
  maxHeight?: number;
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
  // const [scrollTextArea, setScrollTextArea] = useState<"hidden" | "scroll">(
  //   "hidden"
  // );
  const textAreaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const textArea = textAreaRef.current;
    if (textArea) {
      textArea.style.height = `36px`;
    }
  }, []);

  return (
    <textarea
      {...props}
      ref={textAreaRef}
      value={textValue}
      onChange={(event) => {
        handleChange(event.target.value);
        const textArea = textAreaRef.current;
        if (textArea) {
          console.log(textArea.scrollHeight);
          textArea.style.height = `36px`;
          textArea.style.height = `${textArea.scrollHeight}px`;
        }
      }}
      className={cn(
        "w-full outline-none transition-all resize-none rounded-xl",
        className
      )}
    />
  );
}

export default TextArea;
