import { memo } from "react";
import cx from "classnames";

interface IfProps {
  condition: boolean;
  children: React.ReactNode | (() => any);
}

// read: show this content if the condition is true
const VisibleIf: React.FC<IfProps> = ({ condition, children }: IfProps) => {
  // eslint-disable-next-line eqeqeq
  return typeof children === "function" ? (
    <div className={cx(condition ? "tw-block" : "tw-hidden")}>children()</div>
  ) : (
    <div className={cx(condition ? "tw-block" : "tw-hidden")}>{children}</div>
  );
};

export default memo(VisibleIf);
