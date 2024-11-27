import React from "react";
import cx from "classnames";

import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import { Breakpoint } from "@mui/material";
import { MuiBox } from "../../box/MuiBox";
import { MuiDialog, MuiDialogContent } from "./MuiDialog";

export interface CustomModalProps {
  handleClose?: any;
  isOpen: boolean;
  title?: React.ReactNode | string;
  classNames?: string;
  children?: React.ReactNode;
  fxVariant?: "default" | "none";
  maxWidth?: Breakpoint | false;
  headerClassName?: string;
  showCloseIcon?: boolean;
}

const variantClassMap = {
  default: "tw-bg-secondary tw-bg-none",
  none: "",
};

export const CustomModal: React.FC<CustomModalProps> = ({
  showCloseIcon = true,
  ...props
}) => {
  const { fxVariant = "default", classNames } = props;
  const evaluatedClassNames = cx(variantClassMap[fxVariant], classNames);

  return (
    <MuiDialog
      open={props.isOpen}
      onClose={props.handleClose}
      disableEscapeKeyDown
      maxWidth={props.maxWidth || "sm"}
      className="midas-modal tw-px-2"
      PaperProps={{ className: evaluatedClassNames }}
    >
      <MuiBox className="tw-mt-5 tw-flex tw-items-center tw-pl-6">
        <MuiBox
          flexGrow={1}
          className={cx(props.headerClassName, "tw-text-lg")}
        >
          {props.title}
        </MuiBox>
        {showCloseIcon && props.handleClose ? (
          <MuiBox className="tw-mr-3">
            <IconButton onClick={props.handleClose}>
              <CloseIcon />
            </IconButton>
          </MuiBox>
        ) : null}
      </MuiBox>
      <MuiDialogContent className="tw-pt-2">{props.children}</MuiDialogContent>
    </MuiDialog>
  );
};
