import cx from "classnames";

const TdComponent = ({ className, ...rest }: Record<string, any>) => {
  return <div className={cx("tw-truncate", className)} {...rest} />;
};

export default TdComponent;
