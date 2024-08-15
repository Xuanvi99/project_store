import { forwardRef } from "react";
import { IInputProps } from "../../types/InputType";
import { cn } from "../../utils";

type Ref = HTMLInputElement;

const Input = forwardRef<Ref, IInputProps>((props, ref) => {
  const {
    className,
    value,
    placeholder,
    children,
    error,
    type,
    onBlur,
    onFocus,
    ...rest
  } = props;
  return (
    <div className={cn("input-wrap relative w-full", className?.wrap)}>
      {type === "number" ? (
        <input
          ref={ref}
          type={type}
          value={value}
          {...rest}
          onFocus={(event) => {
            if (onFocus) {
              onFocus(event);
            }
          }}
          onBlur={(event) => {
            if (onBlur) {
              onBlur(event);
            }
          }}
          className={cn(
            "w-full px-2 py-2 text-sm duration-300 border-1 rounded-lg outline-none placeholder:text-sm border-grayCa ",
            error ? "border-red-600" : "",
            className?.input
          )}
        />
      ) : (
        <input
          ref={ref}
          {...rest}
          type={type}
          placeholder={placeholder}
          value={value}
          onFocus={(event) => {
            event.target.placeholder = "";
            if (onFocus) {
              onFocus(event);
            }
          }}
          onBlur={(event) => {
            if (!value && placeholder) {
              event.target.placeholder = placeholder;
            }
            if (onBlur) {
              onBlur(event);
            }
          }}
          className={cn(
            "w-full px-2 py-2 text-sm duration-300 border-1 rounded-lg outline-none placeholder:text-sm border-grayCa ",
            error ? "border-red-600" : "",
            className?.input
          )}
        />
      )}
      {children}
    </div>
  );
});

export default Input;
