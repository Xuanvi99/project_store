import { cn } from "../../utils";

interface IButtonProps
  extends React.DetailedHTMLProps<
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
  > {
  children?: React.ReactNode;
  className?: string;
  onClick?: () => void;
  variant: "default" | "outLine" | "outLine-flex" | "outLine-border";
  href?: string;
}

const styleVariant = (variant: string): string => {
  switch (variant) {
    case "outLine":
      return "text-orange border-1 border-orange hover:text-white hover:bg-orangeLinear";
    case "outLine-flex":
      return "flex justify-center items-center duration-300 gap-x-1 border-1 text-orange border-orange hover:text-white hover:bg-orangeLinear ";
    case "outLine-border":
      return "rounded-md text-gray98 hover:text-orangeFe  border-1 text-center";
    default:
      return "bg-orangeLinear text-white hover:opacity-80";
  }
};

function Button({
  children,
  className,
  variant,
  disabled,
  ...props
}: IButtonProps) {
  return (
    <button
      {...props}
      className={cn(
        "px-3 py-2 rounded-md font-semibold",
        styleVariant(variant),
        disabled
          ? "cursor-not-allowed opacity-60 hover:bg-white"
          : "cursor-pointer",
        className
      )}
      disabled={disabled}
    >
      {children}
    </button>
  );
}

export default Button;
