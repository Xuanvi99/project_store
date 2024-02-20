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
  const { type, name, control, children, ...rest } = props;

  const { field } = useController<T>({
    control,
    name,
  });

  return (
    <Input type={type} {...field} {...rest}>
      {children}
    </Input>
  );
};

export default InputForm;
