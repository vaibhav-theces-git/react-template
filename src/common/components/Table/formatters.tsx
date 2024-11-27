/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable max-lines */
/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable react/require-default-props */
import React, { PropsWithChildren } from "react";
import { CellProps } from "react-table";
import dayjs from "dayjs";
// import get from "lodash/get";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import cx from "classnames";
import { formatToLocale } from "src/common/utilities/formatUtils/numberUtils";
import InfoIcon from "@mui/icons-material/Info";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import RemoveCircleIcon from "@mui/icons-material/RemoveCircle";
import HourglassTopIcon from "@mui/icons-material/HourglassTop";
import DoNotDisturbAltIcon from "@mui/icons-material/DoNotDisturbAlt";
import PendingIcon from "@mui/icons-material/Pending";
// import { CustomerConfigUser } from "src/midasv2/types";
import { transformVenueNameForDisplay } from "src/common/utilities/globalUtils";
import CryptoIcon from "src/common/components/icon/CryptoIcon";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import isNaN from "lodash/isNaN";
// import { API } from "src/midasv2/constants/globalContants";
import { TooltipProps } from "@mui/material";
import { MuiBox } from "../box/MuiBox";
import FXNumber, { FXNumberProps } from "../number/FXNumber";
import MuiTooltip from "../tooltip/MuiTooltip";

export const USDValueFormatter =
  (
    colorPositive = true,
    colorNegative = true,
    defaultNullReturn?: string | number
  ) =>
  <D extends object>({ value }: CellProps<D, number | undefined | null>) => {
    if (isNaN(value) || value === null || value === undefined) {
      if (defaultNullReturn === 0) {
        return (
          <FXNumber
            value={0}
            prefix="$"
            is2DecimalFormat
            colorPostive={colorPositive}
            colorNegative={colorNegative}
          />
        );
      }
      return <div>{"-" || defaultNullReturn}</div>;
    }
    return (
      <FXNumber
        value={value}
        prefix="$"
        is2DecimalFormat
        colorPostive={colorPositive}
        colorNegative={colorNegative}
      />
    );
  };

// FxNumber formatter. Should be used for all numbers in Table
// If USD, one can use USDValueFormatter , else one can use this and can pass in various props needed.
// function accepts all the FXNumbers props as object

export const getFxNumberFormatter =
  (obj: Omit<FXNumberProps, "value"> = {}) =>
  <D extends object>({ value }: CellProps<D, number>) => {
    // eslint-disable-next-line react/jsx-props-no-spreading
    return <FXNumber {...obj} value={value} />;
  };

export const PercentageFormatter = <D extends object>({
  colorPostive = false,
  colorNegative = false,
  value,
}: CellProps<D, number>) => {
  return (
    <FXNumber
      value={value}
      suffix="%"
      is2DecimalFormat
      colorPostive={colorPostive}
      colorNegative={colorNegative}
    />
  );
};

export const ExpanderFormatter =
  () =>
  <D extends object>({ row }: CellProps<D>) => {
    return (
      <MuiBox
        // eslint-disable-next-line react/jsx-props-no-spreading
        {...(row.subRows.length > 0 ? row.getToggleRowExpandedProps() : {})}
        className="tw-h-6" // Not ideal to do this if we want to make this a reusable component
      >
        {row.isExpanded ? (
          <ExpandMoreIcon transform="rotate(-180)" />
        ) : row.subRows.length > 0 ? (
          <ExpandMoreIcon />
        ) : null}
      </MuiBox>
    );
  };
interface MainAndSubTextOptionalProps {
  subText?: string | number | null;
  mainTextClasses?: string;
  subTextClasses?: string;
  wrapperClasses?: string;
}
export interface MainAndSubTextComponentProps
  extends MainAndSubTextOptionalProps {
  mainText: React.ReactNode;
}

export const MainAndSubTextComponent = ({
  mainText,
  subText,
  mainTextClasses,
  subTextClasses,
  wrapperClasses,
}: MainAndSubTextComponentProps) => {
  if (wrapperClasses !== undefined) {
    return (
      <div className={cx(wrapperClasses)}>
        <div className={cx("tw-truncate", mainTextClasses)}>{mainText}</div>
        <div
          className={cx("tw-text-xs tw-opacity-60 tw-truncate", subTextClasses)}
        >
          {subText}
        </div>
      </div>
    );
  }
  return (
    <>
      <div className={cx("tw-truncate", mainTextClasses)}>{mainText}</div>
      <div
        className={cx("tw-text-xs tw-opacity-60 tw-truncate", subTextClasses)}
      >
        {subText}
      </div>
    </>
  );
};
export const TimeFormatterComponent = ({
  value,
}: {
  value: string | undefined;
}) => {
  if (!value) {
    return <div>-</div>;
  }
  const utcDateTime = dayjs.utc(value);
  return (
    <MainAndSubTextComponent
      mainText={utcDateTime.format("MM/DD/YYYY")}
      subText={utcDateTime.format("hh:mm:ss A")}
    />
  );
};
export const TimeFormatter = <D extends object>({
  value,
}: CellProps<D, string | undefined>) => (
  <TimeFormatterComponent value={value} />
);

export const DateFormat = ({
  value,
  dateFormat = "MM/DD/YYYY",
}: {
  value: string;
  dateFormat?: string;
}) =>
  // Always show date as UTC, so that same date is shown regardless of local timezone
  dayjs.utc(value, "YYYY-MM-DD HH:mm:ss").format(dateFormat);

export const amountFormatter = <D extends object>({
  value,
}: CellProps<D, number>) => <>{formatToLocale(value)}</>;

export const valueOrNoneFormatter = ({
  value,
}: {
  value?: string | number;
}) => <span>{value || "-"}</span>;

export const statusFormatter = ({ value }: { value: string }) => {
  if (value) {
    let iconName: React.ReactElement = <span />;
    let classes = "";
    let status = value;
    if (
      value === "approved" ||
      value === "whitelisted" ||
      value === "completed"
    ) {
      iconName = (
        <CheckCircleIcon className="tw-text-sm tw-text-success tw-mr-1" />
      );
      classes = "tw-text-success";
    } else if (value === "pending" || value === "pending_whitelist") {
      classes = "tw-text-warning";
      iconName = <PendingIcon className="tw-text-sm tw-text-warning tw-mr-1" />;
    } else if (value === "failed" || value === "rejected") {
      classes = "tw-text-error";
      iconName = (
        <RemoveCircleIcon className="tw-text-sm tw-text-error tw-mr-1" />
      );
    } else if (value === "cancelled" || value === "canceled") {
      status = "cancelled";
      classes = "tw-text-error";
      iconName = (
        <DoNotDisturbAltIcon className="tw-text-sm tw-text-error tw-mr-1" />
      );
    } else if (value === "processing" || value === "in_progress") {
      classes = "tw-text-neutral";
      iconName = (
        <HourglassTopIcon className="tw-text-sm tw-text-neutral tw-mr-1" />
      );
    }
    return (
      <span className={`${classes} tw-flex tw-items-center tw-capitalize`}>
        {iconName} {status.replace("_", " ")}{" "}
      </span>
    );
  }
  return <span />;
};

export const CapitaliseFirstLetter = <D extends object>({
  value,
}: CellProps<D, string | undefined>) => {
  return value ? (
    <div className="first-letter:tw-capitalize">{value}</div>
  ) : (
    <span>-</span>
  );
};

export const CapitaliseWord = <D extends object>({
  value,
}: CellProps<D, string>) => {
  return value ? <div className="tw-uppercase">{value}</div> : <span>-</span>;
};

export const ExchangeNameFormatter = ({ value }: { value: string }) =>
  transformVenueNameForDisplay(value);

export const twoLineHeader = (line1: string, line2: string) => () =>
  (
    <div>
      <div>{line1}</div>
      <div>{line2}</div>
    </div>
  );
// Stake Table formatters

type CoinDisplayProps = {
  token: string;
  label: string;
};
export const CoinDisplay = ({ token, label }: CoinDisplayProps) => {
  return (
    <div className="tw-flex tw-items-center ">
      <CryptoIcon token={token} />
      <div className="tw-pl-2 tw-text-sm tw-leading-none">{label}</div>
      <div className="tw-pl-2 tw-text-xs tw-text-gray-500">{token}</div>
    </div>
  );
};
export const NumberAlignedCell = ({ children }: PropsWithChildren<unknown>) => (
  <div className="tw-text-right">{children}</div>
);

export const NumberAlignedCellFormatter = <D extends object>({
  value,
}: CellProps<D, number>) => {
  return <NumberAlignedCell> {value ? `${value}%` : `-`}</NumberAlignedCell>;
};
interface NestedExpanderProps {
  isExpandable?: boolean;
}

export const ExpanderComponent = <D extends object>({ row }: CellProps<D>) => {
  return (
    // eslint-disable-next-line react/jsx-props-no-spreading
    <span {...row.getToggleRowExpandedProps()}>
      {row.isExpanded ? <KeyboardArrowDownIcon /> : <KeyboardArrowRightIcon />}
    </span>
  );
};

export const ExpandNestedComponent = ({
  isExpandable,
}: NestedExpanderProps) => {
  return (
    <span>
      {isExpandable ? <KeyboardArrowDownIcon /> : <KeyboardArrowRightIcon />}
    </span>
  );
};
type TextWithInfoIconProps = {
  info: NonNullable<React.ReactNode>;
  placement?: TooltipProps["placement"];
};
export const TextWithInfoIcon = ({
  info,
  children,
  placement = "top",
}: PropsWithChildren<TextWithInfoIconProps>) => {
  return (
    <div className="tw-flex tw-items-center tw-gap-1">
      <div>{children}</div>
      <MuiTooltip placement={placement} title={info}>
        <div className="tw-text-white">
          <InfoIcon className="tw-cursor-pointer" />
        </div>
      </MuiTooltip>
    </div>
  );
};

type TextWithTooltipProps = { info: NonNullable<React.ReactNode> };
export const TextWithTooltip = ({
  info,
  children,
}: PropsWithChildren<TextWithTooltipProps>) => {
  return (
    <div className="tw-flex tw-items-center tw-gap-1">
      <MuiTooltip placement="top" title={info}>
        <div className="tw-text-white">
          <div className="tw-text-gray-500">{children}</div>
        </div>
      </MuiTooltip>
    </div>
  );
};

export const IPFormatter = <D extends object>({
  value,
}: CellProps<D, string>) => <div className="tw-break-words"> {value} </div>;

export const UserNameFormatter = <D extends object>({
  value,
}: CellProps<D, { first_name: string; last_name: string }>) => (
  <span>
    {value.first_name} {value.last_name}
  </span>
);

const ReportStatusIcon = ({ icon }: { icon: string }) => {
  switch (icon) {
    case "in_progress":
      return (
        <HourglassTopIcon className="tw-text-sm tw-text-neutral tw-mr-1" />
      );

    case "failed":
    case "expired":
      return <RemoveCircleIcon className="tw-text-sm tw-text-error tw-mr-1" />;
    case "completed":
    case "active":
      return <CheckCircleIcon className="tw-text-sm tw-text-success tw-mr-1" />;
    default:
      return null;
  }
};
export const ReportStatusFormatter = ({ value }: { value: string }) => {
  return (
    <div className="tw-flex tw-items-center">
      <ReportStatusIcon icon={value} />
      {value && (
        <div
          className={cx("tw-capitalize", {
            "tw-text-success": value === "completed" || value === "active",
            "tw-text-error": value === "failed" || value === "expired",
            "tw-text-neutral": value === "in_progress",
          })}
        >
          {value.replace("_", " ")}
        </div>
      )}
    </div>
  );
};
interface NumberWithSubtextFormatterProps extends MainAndSubTextOptionalProps {
  value?: number | string;
  maximumFractionDigits?: number;
}

export const NumberWithSubtextFormatter = ({
  value,
  maximumFractionDigits = 8,
  ...rest
}: NumberWithSubtextFormatterProps) => {
  const mainText = !isNaN(value)
    ? formatToLocale(Number(value), undefined, {
        minimumFractionDigits: 0,
        maximumFractionDigits,
      })
    : "-";
  return (
    // eslint-disable-next-line react/jsx-props-no-spreading
    <MainAndSubTextComponent mainText={mainText} {...rest} />
  );
};
