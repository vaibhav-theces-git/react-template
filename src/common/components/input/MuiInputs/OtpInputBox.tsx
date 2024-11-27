/* eslint-disable react/jsx-props-no-spreading */
import OtpInput, { OtpInputProps } from "react18-input-otp";
import cx from "classnames";
import styles from "./Input.module.css";

export const OtpInputBox: React.FC<OtpInputProps> = (props: OtpInputProps) => {
  const { className, ...rest } = props;
  return <OtpInput className={cx(styles["otp-input"], className)} {...rest} />;
};
