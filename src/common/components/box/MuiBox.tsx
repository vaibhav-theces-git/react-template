import React from "react";
import { Box, BoxProps } from "@mui/material";

export const MuiBox: React.FC<BoxProps> = (props: BoxProps) => (
  <Box {...props} />
);
