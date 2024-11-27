import React, { ReactNode } from "react";
import cx from "classnames";
import { If } from "../../conditional";
import FxBadgeStyles from "./fxBadgeStyles.module.css";

/*
*
- example usage:

import ChangeCircleRoundedIcon from "@mui/icons-material/ChangeCircleRounded";
import { FxBadge } from "./common/components/badge/FxBadge/FxBadge";

<FxBadge
  text="flex"
  variant="info"
  onClick={() => console.log("foo")}
  leftIcon={
    <ChangeCircleRoundedIcon
      htmlColor="#e2b93b"
      sx={{
        height: 10,
        width: 10,
      }}
    />
  }
/>;
*
*/

export interface FxBadgeProps {
  variant?: "neutral" | "success" | "warning" | "error" | "info";
  rightIcon?: ReactNode;
  leftIcon?: ReactNode;
  text: string;
  containerClassName?: string;
  rounded?: boolean;
  onClick?: React.EventHandler<React.MouseEvent | React.TouchEvent>;
  innerRef?: React.ForwardedRef<any>;
}

export const FxBadge: React.FC<FxBadgeProps> = ({
  variant = "info",
  rightIcon,
  leftIcon,
  text,
  containerClassName,
  onClick,
  innerRef,
  rounded = true,
  ...props
}) => {
  return (
    <span ref={innerRef} {...props} onClick={onClick}>
      <span
        className={cx(
          "tw-inline-flex",
          "tw-justify-center",
          "tw-bg-primary tw-p-1",
          "tw-text-xxs",
          "tw-uppercase",
          {
            "tw-text-neutral": variant === "neutral",
            "tw-text-success": variant === "success",
            "tw-text-warning": variant === "warning",
            "tw-text-error": variant === "error",
            "tw-text-info": variant === "info",
            "tw-cursor-pointer": Boolean(onClick),
            "tw-rounded-2xl": rounded,
          },
          FxBadgeStyles["container-default"],
          containerClassName
        )}
      >
        <If condition={Boolean(leftIcon)}>{leftIcon}</If>
        <span
          className={cx({
            [FxBadgeStyles.ml3p]: Boolean(leftIcon),
            [FxBadgeStyles.mr3p]: Boolean(rightIcon),
          })}
        >
          {text}
        </span>
        <If condition={Boolean(rightIcon)}>{rightIcon}</If>
      </span>
    </span>
  );
};
