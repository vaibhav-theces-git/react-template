import React from "react";
import North from "@mui/icons-material/North";
import { If } from "src/common/components/conditional";
import { SvgIconProps } from "@mui/material";

export interface QuantityChangeArrowIconProps
  extends Omit<SvgIconProps, "color" | "transform"> {
  value: number;
  upColor?: SvgIconProps["color"];
  downColor?: SvgIconProps["color"];
}

const QuantityChangeArrowIcon: React.FC<QuantityChangeArrowIconProps> = ({
  value,
  upColor = "success",
  downColor = "error",
  fontSize = "inherit",
  ...props
}) => {
  return (
    <>
      <If condition={value > 0}>
        <North color={upColor} fontSize={fontSize} {...props} />
      </If>
      <If condition={value < 0}>
        <North
          transform="rotate(180)"
          color={downColor}
          fontSize={fontSize}
          {...props}
        />
      </If>
    </>
  );
};

export default QuantityChangeArrowIcon;
