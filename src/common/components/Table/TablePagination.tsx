/* eslint-disable */
import NavigateNextOutlinedIcon from "@mui/icons-material/NavigateNextOutlined";
import SkipNextIcon from "@mui/icons-material/SkipNext";
import SkipPreviousIcon from "@mui/icons-material/SkipPrevious";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import cx from "classnames";
import MuiSelect from "../select/MuiSelect";
import { MenuItem } from "@mui/material";
import {
  commontablePagesInfoTxtTID,
  commonTablePaginationBtnsSectionTID,
  commonTablePaginationSectionTID,
  commontableRowsPerPageTxtTID,
  commontableRowsPerPageValTID,
} from "src/common/constants/testids";

const PaginationComponent = ({
  gotoPage,
  pageSize,
  previousPage,
  nextPage,
  pageCount,
  pageIndex,
  pageOptions,
  canPreviousPage,
  canNextPage,
  setPageSize,
  totalSize,
  forceResetRowSelection,
}: any) => {
  return (
    <div
      data-testid={commonTablePaginationSectionTID}
      className="tw-flex tw-py-4 tw-text-sm tw-items-center tw-px-3 tw-bg-slate-25"
    >
      <div data-testid={commontableRowsPerPageTxtTID} className="tw-mr-4">
        Rows per page:
      </div>
      <MuiSelect
        className="tw-border-gray-500tw-font-[inherit]
          tw-text-white tw-text-sm
          tw-h-7 tw-border-solid tw-border tw-bg-slate-50
          tw-rounded"
        data-testid={commontableRowsPerPageValTID}
        value={pageSize}
        onChange={(e) => {
          setPageSize(Number(e.target.value));
        }}
      >
        {[10, 20, 30].map((pageSize) => (
          <MenuItem key={pageSize} value={pageSize}>
            {pageSize}
          </MenuItem>
        ))}
      </MuiSelect>
      <div
        data-testid={commontablePagesInfoTxtTID}
        className="tw-ml-4 tw-mr-6 tw-w-36 tw-text-center"
      >
        {totalSize > 0 ? pageIndex * pageSize + 1 : 0} -{" "}
        {(pageIndex + 1) * pageSize > totalSize
          ? totalSize
          : (pageIndex + 1) * pageSize}{" "}
        of {totalSize}
      </div>

      <div
        data-testid={commonTablePaginationBtnsSectionTID}
        className="tw-flex tw-items-center"
      >
        <SkipPreviousIcon
          className={cx({
            "tw-opacity-50": !canPreviousPage,
            "tw-cursor-pointer": canPreviousPage,
          })}
          onClick={() => {
            forceResetRowSelection();
            return canPreviousPage && gotoPage(0);
          }}
        />
        <NavigateBeforeIcon
          className={cx({
            "tw-opacity-50": !canPreviousPage,
            "tw-cursor-pointer": canPreviousPage,
          })}
          onClick={() => {
            forceResetRowSelection();
            return canPreviousPage && previousPage();
          }}
        />
        <NavigateNextOutlinedIcon
          className={cx({
            "tw-opacity-50": !canNextPage,
            "tw-cursor-pointer": canNextPage,
          })}
          onClick={() => {
            forceResetRowSelection();
            return canNextPage && nextPage();
          }}
        />
        <SkipNextIcon
          className={cx({
            "tw-opacity-50": !canNextPage,
            "tw-cursor-pointer": canNextPage,
          })}
          onClick={() => {
            forceResetRowSelection();
            return canNextPage && gotoPage(pageCount - 1);
          }}
        />
      </div>
    </div>
  );
};

export default PaginationComponent;
