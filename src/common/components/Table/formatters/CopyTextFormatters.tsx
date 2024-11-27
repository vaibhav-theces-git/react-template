import { CellProps } from "react-table";
import { SimpleCopy } from "../../copy/SimpleCopy";

export const CopyTextFormatters = <D extends object>({
  value,
}: CellProps<D, string>) => {
  return (
    <div className="tw-flex">
      <div className="tw-truncate">{value}</div>
      <SimpleCopy text={value} containerClasses="tw-pr-2" />
    </div>
  );
};
