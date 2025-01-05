import {
  FieldValues,
  UseControllerProps,
  useController,
} from "react-hook-form";
import TextArea, { TTextAreaProps } from ".";

type IInputFormProps = Omit<TTextAreaProps, "ref">;

type Props<T extends FieldValues> = IInputFormProps & UseControllerProps<T>;

const TextAreaForm = <T extends FieldValues>(props: Props<T>) => {
  const { name, control, children, onChange, onBlur, ...rest } = props;

  const { field } = useController<T>({
    control,
    name,
  });

  return (
    <TextArea
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
    </TextArea>
  );
};

export default TextAreaForm;
