import { ITooltipParams } from "ag-grid-enterprise";
import { useMemo } from "react";

const MissingDatesTooltip = (props: ITooltipParams) => {
  const { api, rowIndex } = props;
  const data: { missing_dates: string[] } = useMemo(
    () =>
      api?.getDisplayedRowAtIndex(rowIndex as number)?.data as {
        missing_dates: string[];
      },
    [api, rowIndex]
  );
  const formattedDates = data;
  return (
    <div className="tw-w-44 tw-max-h-64 tw-overflow-y-auto tw-p-2.5 tw-text-center text-ag-foreground-color tw-bg-cyan-950">
      {formattedDates && Array.isArray(formattedDates.missing_dates)
        ? formattedDates.missing_dates.join(",")
        : null}
    </div>
  );
};

export default MissingDatesTooltip;
