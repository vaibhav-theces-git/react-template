import React, { forwardRef } from "react";
import cx from "classnames";

import { Button, ButtonProps } from "@mui/material";

export interface MuiButtonProps extends ButtonProps {
  fxvariant?:
    | "red"
    | "green"
    | "white"
    | "allWhite"
    | "outlined"
    | "text"
    | "disabled"
    | "neutral"
    | "blueoutlined"
    | "greenoutlined"
    | "greyoutlined"
    | "redoutlined";
}

const DISABLED_STYLES =
  "!tw-bg-slate-100 !focus:tw-shadow-gray-500 !tw-text-gray-600 tw-rounded";

// exact style like bg color, state colors might differ as of now, can fix
const variantClassMap = {
  red: "tw-bg-error hover:tw-bg-red-400 focus:tw-shadow-red-500 tw-text-white tw-rounded",
  green:
    "tw-bg-success hover:tw-bg-green-600 focus:tw-shadow-green-500 tw-text-white tw-rounded",
  white:
    "tw-bg-white hover:tw-bg-gray-200 focus:tw-shadow-gray-100 tw-text-primary tw-rounded",
  allWhite:
    "tw-bg-white hover:tw-bg-white focus:tw-shadow-white tw-text-primary tw-rounded",
  neutral:
    "tw-bg-neutral focus:tw-shadow-gray-100 tw-text-white tw-rounded tw-border tw-border-gray-200 tw-border-solid",
  outlined:
    "tw-bg-secondary hover:tw-bg-secondary tw-text-white focus:tw-bg-secondary tw-rounded tw-border tw-border-gray-500 tw-border-solid",
  text: "tw-bg-none tw-border-none tw-p-0 tw-m-0 hover:tw-bg-transparent",
  blueoutlined:
    "tw-bg-transparent hover:tw-bg-transparent tw-text-blue-100 focus:tw-bg-transparent tw-rounded tw-border tw-border-blue-100 tw-border-solid",
  greyoutlined:
    "tw-bg-transparent hover:tw-bg-transparent tw-text-gray-500 focus:tw-bg-transparent tw-rounded tw-border tw-border-gray-500 tw-border-solid",
  redoutlined:
    "tw-bg-secondary hover:tw-bg-secondary tw-text-error focus:tw-bg-secondary tw-rounded tw-border tw-border-error tw-border-solid",
  greenoutlined:
    "tw-bg-secondary hover:tw-bg-secondary tw-text-success focus:tw-bg-secondary tw-rounded tw-border tw-border-success tw-border-solid",
  none: "",
  disabled: DISABLED_STYLES,
};

const stateClassMaps = {
  disabled: DISABLED_STYLES,
};

export const MuiButton: React.FC<MuiButtonProps> = forwardRef<
  HTMLButtonElement,
  MuiButtonProps
>((props, ref) => {
  const { fxvariant = "none", className, disabled } = props;

  const evaluatedClassNames = cx(
    variantClassMap[fxvariant],
    "tw-normal-case",
    className,
    disabled ? stateClassMaps.disabled : ""
  );

  // handle classnames passed
  return <Button {...props} className={evaluatedClassNames} ref={ref} />;
});
