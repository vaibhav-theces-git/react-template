import { ITooltipParams } from "ag-grid-enterprise";
import React, { useMemo } from "react";

const ErrorTooltip = (props: ITooltipParams) => {
  const { api, rowIndex } = props;
  const data: { error_message: string[] } = useMemo(
    () =>
      api?.getDisplayedRowAtIndex(rowIndex as number)?.data as {
        error_message: string[];
      },
    [api, rowIndex]
  );

  return (
    <div className="tw-w-56 tw-max-h-56 tw-py-2 tw-overflow-y-auto  tw-text-center text-ag-foreground-color tw-bg-cyan-950">
      {data.error_message}
    </div>
  );
};

export default ErrorTooltip;
