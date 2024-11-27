import React, { useState, useEffect } from "react";
import cx from "classnames";

export interface ButtonSwitchProps {
  checked: boolean;
  checkedText: string;
  uncheckedText: string;
  onChange: (checkedArg: boolean) => void;
}

export const ButtonSwitch: React.FC<ButtonSwitchProps> = (
  props: ButtonSwitchProps
) => {
  const { checked, checkedText, uncheckedText, onChange } = props;

  return (
    <div className="tw-p-1 tw-bg-secondary tw-rounded-sm">
      <button
        type="button"
        className={cx(
          {
            "tw-bg-neutral": checked,
            "tw-bg-secondary": !checked,
          },
          "tw-rounded-sm tw-p-1 tw-cursor-pointer"
        )}
        onClick={() => onChange(true)}
      >
        {checkedText}
      </button>
      <button
        type="button"
        onClick={() => onChange(false)}
        className={cx(
          {
            "tw-bg-secondary": checked,
            "tw-bg-neutral": !checked,
          },
          "tw-rounded-sm tw-p-1 tw-cursor-pointer"
        )}
      >
        {uncheckedText}
      </button>
    </div>
  );
};
