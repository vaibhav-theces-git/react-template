// import { SliderProps } from "@mui/material";
import { Control, Controller, FieldValues, Path } from "react-hook-form";
import cx from "classnames";
import { CheckboxProps } from "@mui/material";
import { MuiCheckbox } from "../../checkbox/MuiCheckbox";
import { MuiFormControlLabel } from "../MuiForms";

export type CheckboxFormElementProps<T extends FieldValues = FieldValues> =
  Omit<CheckboxProps, "name"> & {
    control: Control<T>;
    className?: string;
    name: Path<T>;
    label?: string;
    containerClass?: string;
    labelClass?: string;
  };

export const CheckboxFormElement = <
  TFieldValues extends FieldValues = FieldValues
>({
  control,
  className,
  name,
  label,
  containerClass,
  labelClass,
  ...rest
}: CheckboxFormElementProps<TFieldValues>): JSX.Element => {
  // can add more customisations to classnames, can be done when needed
  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <MuiFormControlLabel
          control={
            <MuiCheckbox
              {...rest}
              className={cx("tw-p-0", className)}
              onChange={(e) => field.onChange(e.target.checked)}
              checked={field.value}
              disableRipple
            />
          }
          label={
            <span
              className={cx(
                "tw-pl-2 tw-pr-2 tw-pt-0.5 tw-whitespace-nowrap tw-align-middle tw-inline-block",
                labelClass
              )}
            >
              {label}
            </span>
          }
          className={cx(
            "tw-inline-block tw-white-space-nowrap tw-border tw-border-gray-800 tw-border-solid tw-rounded tw-mx-2 tw-p-1 tw-pl-2 tw-text-sm hover:tw-border-white tw-mr-0",
            containerClass
          )}
        />
      )}
    />
  );
};
