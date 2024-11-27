import React from "react";
import { ToggleButton, ToggleButtonProps } from "@mui/material";

export const MuiToggleButton: React.FC<ToggleButtonProps> = (
  props: ToggleButtonProps
  // eslint-disable-next-line react/jsx-props-no-spreading
) => <ToggleButton {...props} />;
