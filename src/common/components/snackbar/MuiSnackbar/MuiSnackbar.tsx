import React from "react";
import Snackbar, { SnackbarProps } from "@mui/material/Snackbar";
// import { MuiCustomAlert } from "../../alert/MuiAlert/MuiAlert";

interface MuiSnackbarProps extends SnackbarProps {
  open: boolean;
  onClose(event: Event | React.SyntheticEvent<Element, Event>): void;
  children: any;
  sx?: any;
  className?: any;
  autoHideDuration?: number;
}

export const MuiSnackbar: React.FC<MuiSnackbarProps> = ({ ...props }) => (
  <Snackbar {...props} />
);
