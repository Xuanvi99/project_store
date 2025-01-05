import { cn } from "@/utils";
import {
  FieldValues,
  UseControllerProps,
  useController,
} from "react-hook-form";

const InputCheckbox = <T extends FieldValues>(
  props: React.DetailedHTMLProps<
    React.InputHTMLAttributes<HTMLInputElement>,
    HTMLInputElement
  > &
    UseControllerProps<T>
) => {
  const { name, control, className, ...rest } = props;

  const { field } = useController<T>({
    control,
    name,
  });

  return (
    <label htmlFor={props.id} className="cursor-pointer custom-radio">
      <input
        type="checkbox"
        className="hidden"
        id={props.name}
        checked={field.value}
        {...field}
        {...rest}
      />
      <div
        className={cn(
          "w-full h-full rounded-full border-[1px] border-slate-300",
          className
        )}
      ></div>
    </label>
  );
};

export default InputCheckbox;
