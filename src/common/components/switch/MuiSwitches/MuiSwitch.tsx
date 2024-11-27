import React, { forwardRef } from "react";
import { Switch, SwitchProps } from "@mui/material";

export const MuiSwitch: React.FC<SwitchProps> = forwardRef<
  HTMLButtonElement,
  SwitchProps
>((props, ref) => <Switch {...props} inputRef={ref} />);
