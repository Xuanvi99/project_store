import { cn } from "../../utils";

function Field({
  children,
  className,
  variant,
}: {
  children: React.ReactNode;
  className?: string;
  variant: "flex-col" | "flex-row";
}) {
  const styleVariant = (variant: string): string => {
    switch (variant) {
      case "flex-col":
        return "flex flex-col gap-y-1";
      case "flex-row":
        return "flex flex-row items-center gap-x-1";
      default:
        return "";
    }
  };

  return <div className={cn(styleVariant(variant), className)}>{children}</div>;
}

export default Field;
