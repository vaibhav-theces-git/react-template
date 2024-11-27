import { Controller, Control, FieldValues, Path } from "react-hook-form";
import { TextFieldProps } from "@mui/material";
import { DateTimePickerProps } from "@mui/x-date-pickers";
import { MuiTextField } from "../../input/MuiInputs";
// import MuiDateTimePicker from "../../datePicker/MuiDatePicker";

type FormDateTimePickerProps<T extends FieldValues, K extends Path<T>> = Omit<
  DateTimePickerProps<T>,
  "name" | "renderInput" | "value"
> & {
  name: K;
  label: string;
  control: Control<T>;
  className?: string;
  dataTestId?: string;
};

export const FormDateTimePicker = <T extends FieldValues, K extends Path<T>>({
  name,
  label,
  control,
  className,
  dataTestId,
  ...rest
}: FormDateTimePickerProps<T, K>): JSX.Element => {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field: { onChange, value } }) => (
        <div></div>
        // <MuiDateTimePicker
        //   {...rest}
        //   label={label}
        //   inputFormat="dd/MM/yyyy hh:mm a"
        //   data-testid={dataTestId}
        //   value={value || null}
        //   className={className}
        //   onChange={(ev) => {
        //     onChange(ev);
        //     if (typeof rest.onChange === "function") {
        //       rest.onChange(ev);
        //     }
        //   }}
        //   renderInput={(params: JSX.IntrinsicAttributes & TextFieldProps) => (
        //     <MuiTextField {...params} size="small" />
        //   )}
        // />
      )}
    />
  );
};
