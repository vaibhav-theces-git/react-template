import React from "react";
import MuiAlert from "@mui/material/Alert";

interface MuiAlertProps {
  onClose(event: React.SyntheticEvent): void;
  severity: "success" | "info" | "warning" | "error";
  children: any;
  sx?: any;
  variant?: "standard" | "filled" | "outlined" | undefined;
}

export const MuiCustomAlert = React.forwardRef<HTMLDivElement, MuiAlertProps>(
  function MuiCustomAlert(props, ref) {
    return <MuiAlert ref={ref} {...props} />;
  }
);
