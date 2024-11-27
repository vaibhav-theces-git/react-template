import { TextFieldProps } from "@mui/material";
import {
  Control,
  Controller,
  ControllerProps,
  FieldError,
  Path,
} from "react-hook-form";
import cx from "classnames";
import { FieldValues } from "react-hook-form/dist/types/fields";
import { textFieldFormElementTID } from "src/common/constants/testids";
import formStyles from "./formStyles.module.scss";
import { MuiTextField } from "../../input/MuiInputs";

export type TextFieldElementProps<T extends FieldValues = FieldValues> = Omit<
  TextFieldProps,
  "name"
> & {
  validation?: ControllerProps["rules"];
  name: Path<T>;
  parseError?: (error: FieldError) => string;
  control?: Control<T>;
  dataTestId?: string;
  autoHeight?: boolean;
  customStyle1?: boolean;
};

const TextFieldFormElement = <TFieldValues extends FieldValues = FieldValues>({
  validation = {},
  parseError,
  type,
  required,
  size = "small",
  variant = "outlined",
  autoComplete = "off",
  fullWidth = true,
  name,
  control,
  className = "",
  autoHeight = false,
  customStyle1 = false,
  dataTestId = textFieldFormElementTID,
  ...rest
}: TextFieldElementProps<TFieldValues>): JSX.Element => {
  return (
    <Controller
      name={name}
      //  control={control}
      rules={validation}
      render={({
        field: { value, onChange, onBlur },
        fieldState: { invalid, error },
      }) => (
        <MuiTextField
          // eslint-disable-next-line react/jsx-props-no-spreading
          {...rest}
          data-testid={dataTestId}
          name={name}
          value={value ?? ""}
          fullWidth={fullWidth}
          variant={variant}
          autoComplete={autoComplete}
          className={cx(
            formStyles.input,
            customStyle1 ? "tw-mb-3" : "tw-mb-5",
            autoHeight ? formStyles["input-h-auto"] : "",
            customStyle1 ? formStyles["input-custom-1"] : "",
            className
          )}
          size={size}
          onChange={(ev) => {
            onChange(ev);
            if (typeof rest.onChange === "function") {
              rest.onChange(ev);
            }
          }}
          onBlur={onBlur}
          required={required}
          type={type}
          error={invalid}
          helperText={
            error
              ? typeof parseError === "function"
                ? parseError(error)
                : error.message
              : rest.helperText
          }
        />
      )}
    />
  );
};
export default TextFieldFormElement;
