import { cn } from "../../utils";

interface ILabelProps
  extends React.DetailedHTMLProps<
    React.LabelHTMLAttributes<HTMLLabelElement>,
    HTMLLabelElement
  > {
  children: React.ReactNode;
  className?: string;
  name?: string;
}

function Label({ children, className, name }: ILabelProps) {
  return (
    <label htmlFor={name} className={cn("font-bold", className)}>
      {children}
    </label>
  );
}

export default Label;
