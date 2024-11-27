import { useMemo } from "react";
import { CellProps, Column } from "react-table";
import Table from "src/common/components/Table";
import { PositionSummaryResponseType } from "src/types/positionSummaryData";
import { ExpanderComponent } from "src/common/components/Table/formatters";
import { toDecimalNumber } from "src/common/utilities/formatUtils/numberUtils";

interface PositionGridDataRow {
  value: number;
  row: {
    original: PositionSummaryResponseType;
  };
}

const formattedNumberCell = (data: PositionGridDataRow) => (
  <div className="tw-text-right">{toDecimalNumber(data.value, 2)}</div>
);

const PositionChildGrid = ({
  childGridData,
}: {
  childGridData: PositionSummaryResponseType[];
}) => {
  const columns: Column<PositionSummaryResponseType>[] = useMemo(
    () => [
      {
        id: "expander",
        Cell: ExpanderComponent,
        width: 30,
      },
      {
        Header: "Entity",
        accessor: "legal_entity",
        width: 70,
        align: "left",
      },
      {
        Header: "Account",
        accessor: "account_id",
        width: 70,
        align: "left",
      },
      {
        Header: "Symbol",
        accessor: "symbol_pair",
        width: 70,
        align: "left",
      },
      {
        Header: "Position Key",
        accessor: "position_key",
        width: 70,
        align: "left",
      },
      {
        Header: "Net MV [$]",
        accessor: "market_value",
        width: 70,
        align: "right",
        Cell: formattedNumberCell,
      },
      {
        Header: "VaR 95 [$]",
        accessor: "VAR95",
        width: 70,
        align: "right",
        Cell: formattedNumberCell,
      },
      {
        Header: "VaR 99 [$]",
        accessor: "VAR99",
        width: 70,
        align: "right",
        Cell: formattedNumberCell,
      },
      {
        Header: "VaR 100 [$]",
        accessor: "VAR100",
        width: 70,
        align: "right",
        Cell: formattedNumberCell,
      },
    ],
    []
  );
  return (
    <div>
      <Table
        data={childGridData}
        columns={columns}
        enablePagination={false}
        enableExpanding
        renderRowSubComponent={({
          row,
        }: CellProps<PositionSummaryResponseType>) =>
          row.original.children &&
          row.original.children.length > 0 && (
            <PositionChildGrid childGridData={row.original.children} />
          )
        }
      />
    </div>
  );
};

export default PositionChildGrid;
