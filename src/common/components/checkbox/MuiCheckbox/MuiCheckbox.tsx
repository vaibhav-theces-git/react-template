import React from "react";
import { Checkbox, CheckboxProps } from "@mui/material";

export const MuiCheckbox: React.FC<CheckboxProps> = (props: CheckboxProps) => (
  <Checkbox {...props} />
);
