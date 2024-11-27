import { ArrowDownward, ArrowUpward } from "@mui/icons-material";
import { useMemo } from "react";
import { Column } from "react-table";
import Table from "src/common/components/Table/Table";
import MuiTooltip from "src/common/components/tooltip/MuiTooltip";
import { noDataMessage } from "src/common/constants/testids";
import { toDecimalNumber } from "src/common/utilities/formatUtils/numberUtils";
import { VarGridDataResponseType } from "src/types/varGridData";

type VaRTableProps = {
  varData: VarGridDataResponseType[];
};

interface VarDataRow {
  row: {
    original: VarGridDataResponseType;
  };
}

const cellWithArrow = (currentValue: number, arrowType: string) => {
  const icon =
    arrowType === "up" ? (
      <ArrowUpward className="tw-text-sm tw-text-green-500" />
    ) : arrowType === "down" ? (
      <ArrowDownward className="tw-text-sm tw-text-red-500" />
    ) : (
      <div />
    );
  return (
    <div className="tw-align-middle">
      <span>{toDecimalNumber(currentValue, 2)}</span>
      {currentValue && <span className="tw-align-middle">{icon}</span>}
    </div>
  );
};

const currentCellTemplate = (data: VarDataRow) => (
  <div>
    <MuiTooltip
      sx={{
        "& .MuiTooltip-tooltip": {
          backgroundColor: "#67748a",
        },
        "& .MuiTooltip-arrow": {
          color: "#67748a",
        },
      }}
      title={
        <div className="tw-text-white tw-text-xs">
          <div className="tw-p-0">
            Left Tail: {toDecimalNumber(data.row.original.COB_LEFT, 2)}
          </div>
          <div className="tw-p-0">
            Right Tail: {toDecimalNumber(data.row.original.COB_RIGHT, 2)}
          </div>
        </div>
      }
      placement="top"
    >
      <span>{toDecimalNumber(data.row.original.COB, 2)}</span>
    </MuiTooltip>
  </div>
);

const dodCellTemplate = (data: VarDataRow) => {
  return cellWithArrow(
    data.row.original.DOD,
    data.row.original.DOD_change_flag
  );
};

const momCellTemplate = (data: VarDataRow) => {
  return cellWithArrow(
    data.row.original.MOM,
    data.row.original.MOM_change_flag
  );
};

const wowCellTemplate = (data: VarDataRow) => {
  return cellWithArrow(
    data.row.original.WOW,
    data.row.original.WOW_change_flag
  );
};

const VaRTable = (props: VaRTableProps) => {
  const { varData } = props;
  const columns: Column<VarGridDataResponseType>[] = useMemo(
    () => [
      {
        Header: "Level",
        accessor: "Confidence_Levels",
        width: 70,
        disableFilters: true,
        align: "center",
      },
      {
        Header: "Current [$]",
        accessor: "COB",
        width: 106,
        disableFilters: true,
        align: "center",
        Cell: currentCellTemplate,
      },
      {
        Header: "DoD [%]",
        accessor: "DOD",
        width: 106,
        disableFilters: true,
        align: "center",
        Cell: dodCellTemplate,
      },
      {
        Header: "WoW [%]",
        accessor: "WOW",
        width: 106,
        disableFilters: true,
        align: "center",
        Cell: wowCellTemplate,
      },
      {
        Header: "MoM [%]",
        accessor: "MOM",
        width: 106,
        disableFilters: true,
        align: "center",
        Cell: momCellTemplate,
      },
    ],
    []
  );

  return (
    <div style={{ maxHeight: "140px", overflow: "auto" }}>
      {varData && (
        <Table
          data={varData}
          columns={columns}
          enablePagination={false}
          enableSorting={false}
          noDataTableMessage={noDataMessage}
          className="tw-h-full tw-overflow-auto"
        />
      )}
    </div>
  );
};

export default VaRTable;
