import React from "react";
import { MuiBox } from "src/common/components/box/MuiBox";
import BigNumber from "bignumber.js";
import { BoxProps } from "@mui/material";

const getDisplayNumber = (
  value: number,
  is2DecimalFormat: boolean,
  isAbsolute: boolean,
  alternateTextForZeroValue?: string
) => {
  if (alternateTextForZeroValue && value === 0) {
    return alternateTextForZeroValue;
  }
  let num = new BigNumber(value);
  if (isAbsolute) {
    num = num.absoluteValue();
  }
  if (is2DecimalFormat) {
    return num.toFormat(2);
  }
  return num.toFormat();
};

export interface FXNumberProps extends Omit<BoxProps, "color"> {
  value: number;
  prefix?: string;
  suffix?: string;
  is2DecimalFormat?: boolean;
  alternateTextForZeroValue?: string;
  isAbsolute?: boolean;
  colorNegative?: boolean;
  colorPostive?: boolean;
  textColor?: string;
}

const FXNumber: React.FC<FXNumberProps> = ({
  value,
  prefix = "",
  suffix = "",
  is2DecimalFormat = false,
  isAbsolute = false,
  alternateTextForZeroValue,
  colorNegative = false,
  colorPostive = false,
  textColor = "",
  ...props
}) => {
  const color =
    textColor ||
    (value >= 0
      ? colorPostive
        ? "success.main"
        : undefined
      : colorNegative
      ? "error.main"
      : undefined);
  const displayValue = getDisplayNumber(
    value,
    is2DecimalFormat,
    isAbsolute,
    alternateTextForZeroValue
  );
  return (
    <MuiBox color={color} {...props}>
      {prefix}
      {displayValue}
      {suffix}
    </MuiBox>
  );
};

export default FXNumber;
