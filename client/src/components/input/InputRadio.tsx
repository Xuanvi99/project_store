import {
  FieldValues,
  UseControllerProps,
  useController,
} from "react-hook-form";

const InputRadio = <T extends FieldValues>(
  props: React.DetailedHTMLProps<
    React.InputHTMLAttributes<HTMLInputElement>,
    HTMLInputElement
  > &
    UseControllerProps<T>
) => {
  const { name, control, ...rest } = props;

  const { field } = useController<T>({
    control,
    name,
  });

  return (
    <label htmlFor={props.id} className="cursor-pointer custom-radio">
      <input type="radio" className="hidden" {...field} {...rest} />
      <div className="w-full h-full rounded-full border-[1px] border-slate-300"></div>
    </label>
  );
};

export default InputRadio;
