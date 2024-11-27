import classNames from "classnames";
import React, { forwardRef } from "react";
import Switch, { ReactSwitchProps } from "react-switch";
import styles from "./ReactCustomSwitch.module.scss";

const ON_COLOR = "#178FE6";
const OFF_COLOR = "#111827";

const InactiveSwitchLabel = ({ token }: { token: string }) => (
  <span className="tw-w-[68px] tw-block tw-leading-8 tw-text-center tw-text-lg tw-font-normal">
    {token}
  </span>
);

const ActiveSwitchLabel = ({ token }: { token: string }) => (
  <span className="tw-w-[72px] tw-block tw-leading-8 tw-text-center tw-text-lg tw-font-bold">
    {token}
  </span>
);

export const ReactCustomSwitch: React.FC<ReactSwitchProps> = (props) => (
  <Switch
    width={100}
    height={31}
    borderRadius={0}
    onColor={ON_COLOR} // left-side label bg when ON
    onHandleColor={OFF_COLOR} // right-side label bg when ON
    offHandleColor={OFF_COLOR} // left-side bg when OFF
    offColor={ON_COLOR} // right-side label bg when OFF
    handleDiameter={31}
    {...props}
  />
);

export const TokenSwitch = ({
  baseToken,
  quoteToken,
  ...props
}: { baseToken: string; quoteToken: string } & ReactSwitchProps) => (
  <Switch
    width={100}
    height={31}
    borderRadius={0}
    className={classNames(styles.tokenSwitch, props.className)}
    onColor={ON_COLOR} // left-side label bg when ON
    onHandleColor={OFF_COLOR} // right-side label bg when ON
    offHandleColor={OFF_COLOR} // left-side bg when OFF
    offColor={ON_COLOR} // right-side label bg when OFF
    handleDiameter={31}
    // when OFF: left label (inactive)
    uncheckedHandleIcon={<InactiveSwitchLabel token={baseToken} />}
    // when OFF: right label (active)
    uncheckedIcon={<ActiveSwitchLabel token={quoteToken} />}
    // when ON: left label (active)
    checkedIcon={<ActiveSwitchLabel token={baseToken} />}
    // when ON: right label (inactive)
    checkedHandleIcon={<InactiveSwitchLabel token={quoteToken} />}
    {...props}
  />
);
