import React from "react";
import { ToggleButtonGroupProps, ToggleButtonGroup } from "@mui/material";

export const MuiToggleButtonGroup: React.FC<ToggleButtonGroupProps> = (
  props: ToggleButtonGroupProps
  // eslint-disable-next-line react/jsx-props-no-spreading
) => <ToggleButtonGroup {...props} />;
