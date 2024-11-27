/* eslint-disable react/jsx-props-no-spreading */
import ButtonGroup, { ButtonGroupProps } from "@mui/material/ButtonGroup";
import React from "react";

export const MuiButtonGroup: React.FC<ButtonGroupProps> = ({ ...props }) => {
  return <ButtonGroup {...props} />;
};
