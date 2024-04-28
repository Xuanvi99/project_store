export interface IInputProps
  extends Omit<
    React.DetailedHTMLProps<
      React.InputHTMLAttributes<HTMLInputElement>,
      HTMLInputElement
    >,
    "className"
  > {
  className?: {
    wrap?: string;
    input?: string;
  };
  name: string;
  error?: boolean;
  children?: React.ReactNode;
  ref?: React.LegacyRef<HTMLInputElement>;
}
