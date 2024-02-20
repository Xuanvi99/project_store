import { cn } from "../../utils";
import { IconError } from "../icon";

function ErrorInput({
  text = "",
  className,
}: {
  text?: string;
  className?: string;
}) {
  return (
    <div className={cn("text-sm text-red-600 mt-1", className)}>
      {text !== "" ? (
        <span className="flex items-center gap-x-2">
          <IconError size={15}></IconError>
          {text}
        </span>
      ) : (
        ""
      )}
    </div>
  );
}

export default ErrorInput;
