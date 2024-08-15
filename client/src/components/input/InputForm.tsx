import {
  FieldValues,
  UseControllerProps,
  useController,
} from "react-hook-form";
import { Input } from ".";
import { IInputProps } from "../../types/InputType";

type IInputFormProps = Omit<IInputProps, "ref">;

const InputForm = <T extends FieldValues>(
  props: IInputFormProps & UseControllerProps<T>
) => {
  const { type, name, control, children, onChange, onBlur, ...rest } = props;

  const { field } = useController<T>({
    control,
    name,
  });

  return (
    <Input
      type={type}
      {...field}
      {...rest}
      onBlur={(event) => {
        field.onBlur();
        if (onBlur) {
          onBlur(event);
        }
      }}
      onChange={(event) => {
        field.onChange(event);
        if (onChange) {
          onChange(event);
        }
      }}
    >
      {children}
    </Input>
  );
};

export default InputForm;
