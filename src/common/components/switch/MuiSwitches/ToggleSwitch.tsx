/* eslint-disable */
import React, { useEffect } from "react";
import cx from "classnames";
import { Global } from "@emotion/react";
import styles from "./ToggleSwitch.module.css";

interface ToggleProps {
  classNames?: string;
  onLabel: string;
  offLabel: string;
  styles?: object;
  // eslint-disable-next-line @typescript-eslint/ban-types
  onChange: Function;
  onColor?: string;
  offColor?: string;
  checked?: boolean;
  disabled?: boolean;
}

interface ComponentState {
  before: string;
  after: string;
  isToggled: boolean;
}

export const ToggleSwitch: React.FC<ToggleProps> = ({ ...props }) => {
  const [values, setValues] = React.useState<ComponentState>({
    before: "",
    after: "",
    isToggled: typeof props.checked !== "undefined" ? props.checked : false,
  });

  useEffect(() => {
    setValues({
      ...values,
      isToggled: typeof props.checked !== "undefined" ? props.checked : false,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.checked]);

  useEffect(() => {
    setValues({
      ...values,
      before: values.isToggled ? props.onLabel : values.before,
      after: !values.isToggled ? props.offLabel : values.after,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [values.isToggled]);

  const onColor = props.onColor ? props.onColor : "#17A35D";
  const offColor = props.offColor ? props.offColor : "#F05C52";

  const onToggle = () => {
    props.onChange();
  };

  return (
    <div className={styles.customToggleContainer}>
      <Global
        styles={{
          html: {
            "--background-on-color": onColor,
            "--background-off-color": offColor,
          },
        }}
      />
      {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
      <label
        className={cx(
          styles.customToggleSwitch,
          // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
          `tw-relative tw-inline-block tw-max-w-xs tw-h-7 ${props.classNames}`,
          {
            "tw-opacity-50 tw-color-gray tw-pointer-events-none":
              props.disabled,
          }
        )}
        style={{ color: values.isToggled ? onColor : offColor }}
      >
        <input
          type="checkbox"
          checked={values.isToggled}
          onChange={onToggle}
          className="tw-hidden"
        />
        <span
          className={cx(
            styles.customSwitch,
            "tw-absolute tw-cursor-pointer tw-bg-tertiary tw-rounded-sm tw-top-0 tw-left-0 tw-right-0 tw-bottom-0"
          )}
          data-before-content={values.before ? values.before : props.onLabel}
          data-after-content={values.after ? values.after : props.offLabel}
          style={{ color: values.isToggled ? onColor : offColor }}
        />
      </label>
    </div>
  );
};
