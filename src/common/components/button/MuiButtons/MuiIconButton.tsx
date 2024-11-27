/* eslint-disable react/jsx-props-no-spreading */
import { IconButton, IconButtonProps } from "@mui/material";
import { forwardRef } from "react";

export const MuiIconButton: React.FC<IconButtonProps> = forwardRef<
  HTMLButtonElement,
  IconButtonProps
>((props, ref) => {
  // handle classnames passed
  return <IconButton {...props} ref={ref} />;
});
