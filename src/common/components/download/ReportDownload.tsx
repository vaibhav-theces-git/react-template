import { CSVLink } from "react-csv";
// import cx from "classnames";
import FileDownloadIcon from "@mui/icons-material/FileDownload";

export const ReportDownload = ({
  formattedTableData,
  fileName,
}: // title,
// isDisabled,
{
  formattedTableData: Array<Record<string, unknown>>;
  fileName: string;
  // title?: string;
  // isDisabled?: boolean;
}) => {
  return (
    // <span className={cx("tw-flex tw-items-center")}>
    <CSVLink
      className="tw-cursor-pointer tw-text-white"
      data={formattedTableData}
      filename={`${fileName}.csv`}
      data-testid="csvDownload"
    >
      <FileDownloadIcon fontSize="small" className="tw-flex tw-items-center" />
    </CSVLink>
    // </span>
  );
};
