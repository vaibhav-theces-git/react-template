import React, { forwardRef } from "react";
import { Card, CardProps } from "@mui/material";

export const MuiCard: React.FC<CardProps> = forwardRef<
  HTMLDivElement,
  CardProps
>((props, ref) => {
  return <Card ref={ref} {...props} />;
});
