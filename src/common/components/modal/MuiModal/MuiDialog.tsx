import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogProps,
  DialogContentProps,
} from "@mui/material";

export const MuiDialog: React.FC<DialogProps> = (props: DialogProps) => (
  <Dialog {...props} />
);

export const MuiDialogContent: React.FC<DialogContentProps> = (
  props: DialogContentProps
) => <DialogContent {...props} />;
