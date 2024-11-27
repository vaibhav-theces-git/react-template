// Taken from "https://github.com/iamhosseindhv/notistack/issues/30"

import { OptionsObject, useSnackbar, WithSnackbarProps } from "notistack";
import React from "react";
import ToasterClose from "src/common/components/toasterCloseIcon/ToasterCloseIcon";

let useSnackbarRef: WithSnackbarProps;
export const SnackbarUtilsConfigurator: React.FC = () => {
  useSnackbarRef = useSnackbar();
  return null;
};

export default {
  success(msg: string, options: OptionsObject = {}) {
    this.toast(msg, { ...options, variant: "success" });
  },
  warning(msg: string, options: OptionsObject = {}) {
    this.toast(msg, { ...options, variant: "warning" });
  },
  info(msg: string, options: OptionsObject = {}) {
    this.toast(msg, { ...options, variant: "info" });
  },
  error(msg: string, options: OptionsObject = { action: ToasterClose }) {
    this.toast(msg, { ...options, variant: "error" });
  },
  toast(msg: string, options: OptionsObject = {}) {
    useSnackbarRef.enqueueSnackbar(msg, options);
  },
};

export const snackbarOption = {
  autoHideDuration: 3000,
  preventDuplicate: true,
};

// Usage

// import SnackbarUtils from 'src/midasv2/components/SnackBarUtilsConfigurator'
// SnackbarUtils.success('Success 🎉')
