import { useEffect, useMemo, useState } from "react";
import { CellProps, Column } from "react-table";
import { SelectChangeEvent } from "@mui/material";
import Table from "src/common/components/Table";
import { MuiButtonGroup } from "src/common/components/button/MuiButtons/MuiButtonGroup";
import { MuiIconButton } from "src/common/components/button/MuiButtons/MuiIconButton";
import { MuiTypography } from "src/common/components/typography/MuiTypography/MuiTypography";
import { Download, Fullscreen, FullscreenExit } from "@mui/icons-material";
import { ExpanderComponent } from "src/common/components/Table/formatters";
import MuiSelect from "src/common/components/select/MuiSelect";
import { MuiMenuItem } from "src/common/components/menu/MuiMenu";
import { AggregationResponseType } from "src/types/aggregationType";
import { PositionSummaryResponseType } from "src/types/positionSummaryData";
import { toDecimalNumber } from "src/common/utilities/formatUtils/numberUtils";
import { noDataMessage } from "src/common/constants/testids";
import PositionChildGrid from "./PositionChildGrid";

export interface PositionGridProps {
  positiongriddata: PositionSummaryResponseType[];
  aggregationtypelist: AggregationResponseType[];
  selectedaggregationtype: string;
  togglecallback: (val: boolean) => void;
  aggregationtypechangecallback: (val: string) => void;
}

interface PositionGridDataRow {
  value: number;
  row: {
    original: PositionSummaryResponseType;
  };
}

const formattedNumberCell = (data: PositionGridDataRow) => (
  <div className="tw-text-right">{toDecimalNumber(data.value, 2)}</div>
);

const PositionGrid = (positionGridProps: PositionGridProps) => {
  const {
    positiongriddata,
    aggregationtypelist,
    selectedaggregationtype,
    aggregationtypechangecallback,
    togglecallback,
  } = positionGridProps;
  const [blockZoomed, setBlockZoomed] = useState(false);

  const handleAggregateTypeChange = (event: SelectChangeEvent<unknown>) => {
    aggregationtypechangecallback(event.target.value as string);
  };

  const handleToggle = () => {
    setBlockZoomed(!blockZoomed);
  };

  useEffect(() => {
    togglecallback(blockZoomed);
  }, [
    blockZoomed,
    togglecallback,
    aggregationtypelist,
    selectedaggregationtype,
    aggregationtypechangecallback,
  ]);

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
    <div className="fx-conduit-container tw-w-full tw-h-full">
      <div className="fx-conduit-header tw-h-7 tw-pl-1 tw-pr-1 tw-bg-slate-500 tw-align-middle tw-justify-between tw-flex">
        <div className="fx-conduit-title tw-flex tw-items-center">
          <MuiTypography className="tw-text-sm tw-mr-5">
            Position Summary
          </MuiTypography>
        </div>
        <div className="fx-conduit-buttons tw-flex tw-items-center">
          <MuiSelect
            labelId="ToolbarSelectEntityLabel"
            id="ToolbarSelectEntityId"
            value={selectedaggregationtype}
            onChange={handleAggregateTypeChange}
            className="tw-w-64 tw-my-1 tw-text-xs tw-py-3 tw-px-0 tw-text-left"
          >
            {aggregationtypelist &&
              aggregationtypelist.map((agg) => (
                <MuiMenuItem
                  key={agg.agg_id}
                  value={agg.agg_name}
                  className="tw-text-xs"
                >
                  {agg.agg_name}
                </MuiMenuItem>
              ))}
          </MuiSelect>

          <MuiButtonGroup>
            <MuiIconButton size="small" disabled>
              <Download />
            </MuiIconButton>
            <MuiIconButton size="small" onClick={handleToggle}>
              {blockZoomed && <FullscreenExit fontSize="small" />}
              {!blockZoomed && <Fullscreen fontSize="small" />}
            </MuiIconButton>
          </MuiButtonGroup>
        </div>
      </div>
      {positiongriddata && (
        <Table
          data={positiongriddata}
          columns={columns}
          enableExpanding
          enableSorting
          enablePagination
          initialState={{ pageSize: 10 }}
          className="tw-h-full"
          noDataTableMessage={noDataMessage}
          renderRowSubComponent={({
            row,
          }: CellProps<PositionSummaryResponseType>) =>
            row.original.children &&
            row.original.children.length > 0 && (
              <PositionChildGrid childGridData={row.original.children} />
            )
          }
        />
      )}
    </div>
  );
};
export default PositionGrid;
