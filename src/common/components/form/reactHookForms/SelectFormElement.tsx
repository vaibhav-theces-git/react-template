import { SelectProps } from "@mui/material";
import { Control, Controller, FieldValues, Path } from "react-hook-form";
import cx from "classnames";
// import { GeneralLabelValueType } from "src/midasv2/types";
import { MuiMenuItem } from "../../menu/MuiMenu";
import MuiSelect from "../../select/MuiSelect";

export type SelectFormElementProps<T extends FieldValues = FieldValues> = Omit<
  SelectProps,
  "name"
> & {
  control: Control<T>;
  className?: string;
  name: Path<T>;
  // menuItems: Array<GeneralLabelValueType>;
  menuItems: Array<any>;
};

export const SelectFormElement = <
  TFieldValues extends FieldValues = FieldValues
>({
  control,
  className,
  name,
  menuItems,
  ...rest
}: SelectFormElementProps<TFieldValues>) => {
  return (
    <Controller
      render={({ field }) => (
        <MuiSelect
          {...field}
          {...rest}
          className={cx("tw-bg-transparent tw-py-4 tw-px-0", className)}
        >
          {menuItems.map((item) => (
            <MuiMenuItem value={item.value} key={item.value}>
              {item.displayName}
            </MuiMenuItem>
          ))}
        </MuiSelect>
      )}
      name={name}
      control={control}
    />
  );
};
