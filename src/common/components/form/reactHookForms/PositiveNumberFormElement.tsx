import React from "react";
import { FieldValues } from "react-hook-form";
import { TextFieldFormElement } from "src/common/components/form/reactHookForms";
import { TextFieldElementProps } from "src/common/components/form/reactHookForms/TextFieldForm";

const DISALLOWED_KEYS = ["-", "e", "E", "ArrowUp", "ArrowDown"];

const disallowKeys = (evt: React.KeyboardEvent<HTMLInputElement>) => {
  if (DISALLOWED_KEYS.includes(evt.key)) {
    evt.preventDefault();
  }
};

export type PositiveNumberElementProps<T extends FieldValues> = Omit<
  TextFieldElementProps<T>,
  "type"
>;

const PositiveNumberFormElement = <T extends FieldValues>(
  props: PositiveNumberElementProps<T>
) => {
  return (
    <TextFieldFormElement
      onKeyDown={disallowKeys}
      type="number"
      {...props}
      className="tw-appearance-none"
    />
  );
};

export default PositiveNumberFormElement;
