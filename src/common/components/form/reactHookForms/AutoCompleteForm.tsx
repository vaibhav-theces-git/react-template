/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react/jsx-props-no-spreading */
import { Control, Controller, ControllerProps, Path } from "react-hook-form";
import { AutocompleteProps, TextFieldProps } from "@mui/material";
import cx from "classnames";
import { FieldValues } from "react-hook-form/dist/types/fields";
import isNil from "lodash/isNil";
import merge from "lodash/merge";
import { MuiAutocomplete } from "../../autocomplete/MuiAutocomplete";
import { MuiTextField } from "../../input/MuiInputs";
import formStyles from "./formStyles.module.scss";
import { autoCompleteFormElementTID } from "../../../constants/testids";

export type AutocompleteElementProps<
  F extends FieldValues,
  T,
  M extends boolean | undefined,
  D extends boolean | undefined
> = {
  name: Path<F>;
  control?: Control<F>;
  options: T[];
  loading?: boolean;
  isUnControlled?: boolean;
  uniqKey?: string;
  multiple?: M;
  matchId?: boolean;
  rules?: ControllerProps["rules"];
  required?: boolean;
  label?: TextFieldProps["label"];
  autocompleteProps?: Omit<
    AutocompleteProps<T, M, D, any>,
    "name" | "options" | "loading" | "renderInput"
  >;
  textFieldProps?: Omit<TextFieldProps, "name" | "required" | "label">;
  dataTestId?: string;
  placeHolder?: string;
  disabled?: boolean;
};

export type AutoDefault = {
  id: string | number; // must keep id in case of keepObject
  label: string;
};

const findOptionLabel = (option: AutoDefault | string) => {
  if (typeof option === "string") {
    return option;
  }

  return option.label;
};

const AutocompleteFormElement = <TFieldValues extends FieldValues>({
  textFieldProps,
  autocompleteProps,
  name,
  control,
  options,
  isUnControlled = false,
  rules,
  uniqKey,
  required,
  matchId,
  label,
  dataTestId = autoCompleteFormElementTID,
  placeHolder = "",
  disabled,
}: AutocompleteElementProps<
  TFieldValues,
  AutoDefault | string | any,
  boolean | undefined,
  boolean | undefined
>) => {
  const validationRules: ControllerProps["rules"] = {
    ...rules,
    ...(required && {
      required: rules?.required || "This field is required",
    }),
  };
  // Used merge here as it is type safe. Need to change it to spread
  const mergedAutocompleteProps = merge(
    { size: "small", disableClearable: true, openOnFocus: true },
    autocompleteProps
  );

  return (
    <Controller
      name={name}
      // control={control}
      rules={validationRules}
      render={({
        field: { onChange, onBlur, value, ref, ...fieldRest },
        fieldState: { error },
      }) => {
        let currentValue = value || null;
        if (matchId) {
          currentValue =
            options.find(
              (i: AutoDefault | string) =>
                (!isNil((i as AutoDefault).id)
                  ? (i as AutoDefault).id
                  : (i as string)) === value
            ) || null;
        }
        return (
          <MuiAutocomplete
            {...mergedAutocompleteProps}
            key={uniqKey}
            data-testid={dataTestId}
            value={isUnControlled ? undefined : currentValue}
            className={cx(
              formStyles.input,
              "tw-mb-5",
              mergedAutocompleteProps.className
            )}
            disabled={disabled}
            multiple={false as boolean | undefined}
            options={options}
            getOptionLabel={
              mergedAutocompleteProps?.getOptionLabel
                ? mergedAutocompleteProps?.getOptionLabel
                : findOptionLabel
            }
            onChange={(event, newValue, reason, details) => {
              let changedVal = newValue;
              if (matchId) {
                changedVal = !isNil((newValue as AutoDefault)?.id)
                  ? (newValue as AutoDefault)?.id
                  : newValue;
              }
              onChange(changedVal);
              if (mergedAutocompleteProps?.onChange) {
                mergedAutocompleteProps.onChange(
                  event,
                  newValue,
                  reason,
                  details
                );
              }
            }}
            isOptionEqualToValue={
              mergedAutocompleteProps?.isOptionEqualToValue
                ? mergedAutocompleteProps.isOptionEqualToValue
                : (option: AutoDefault, newValue: AutoDefault | string) => {
                    return newValue
                      ? option === value ||
                          option.id ===
                            (!isNil((newValue as AutoDefault)?.id)
                              ? (newValue as AutoDefault).id
                              : newValue)
                      : false;
                  }
            }
            onBlur={(event) => {
              onBlur();
              if (typeof mergedAutocompleteProps?.onBlur === "function") {
                mergedAutocompleteProps.onBlur(event);
              }
            }}
            renderInput={(params) => (
              <MuiTextField
                placeholder={placeHolder}
                name={name}
                label={label}
                {...textFieldProps}
                {...params}
                error={!!error}
                InputProps={{
                  ...params.InputProps,
                  ...textFieldProps?.InputProps,
                }}
                // eslint-disable-next-line react/jsx-no-duplicate-props
                inputProps={{
                  ...params.inputProps,
                  ...textFieldProps?.inputProps,
                }}
                helperText={error ? error.message : textFieldProps?.helperText}
              />
            )}
            {...fieldRest}
          />
        );
      }}
    />
  );
};

export default AutocompleteFormElement;
