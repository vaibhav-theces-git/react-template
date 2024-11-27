import { useMemo } from "react";
import { MuiBox } from "src/common/components/box/MuiBox";
import { HistogramResponseType, PnlResponseType } from "src/types/pnlTypes";
import MuiContainer from "src/common/components/container/MuiContainer";
import MuiGrid from "src/common/components/grid/MuiGrid";
import { Column } from "react-table";
import Table from "src/common/components/Table";
import { ReportDownload } from "src/common/components/download/ReportDownload";
import PnlChart from "./PnlChart";

export interface ProfitLossVectorProps {
  pnlData: PnlResponseType[];
  histogramData: HistogramResponseType[];
}

const ProfitLossVector = (profitLossVectorProps: ProfitLossVectorProps) => {
  const { pnlData, histogramData } = profitLossVectorProps;

  const columns: Column<PnlResponseType>[] = useMemo(
    () => [
      {
        Header: "PnL Date",
        accessor: "pnl_vector_date",
        width: 90,
        align: "right",
      },
      {
        Header: "Total PnL",
        accessor: "total_pnl_str",
        width: 90,
        align: "right",
      },
    ],
    []
  );

  return (
    <MuiContainer className="tw-h-full">
      <MuiGrid
        container
        className="tw-grid lg:tw-grid-cols-3 md:tw-grid-cols-3 sm:tw-grid-cols-1 tw-grow tw-gap-px  tw-h-full"
      >
        <MuiGrid
          item
          className="tw-grow-0 tw-col-span-1 lg:tw-grid-cols-1 md:tw-grid-cols-1 sm:tw-grid-cols-1 tw-space-x-6 tw-h-full"
        >
          <MuiBox className="tw-h-80 tw-m-1">
            <Table
              className="tw-h-80 tw-overflow-hidden"
              data={pnlData}
              columns={columns}
              enablePagination={false}
              enableSorting
              DownloadComponent={
                <ReportDownload
                  formattedTableData={pnlData}
                  fileName={`PnLData-${new Date().toUTCString()}`}
                />
              }
            />
          </MuiBox>
        </MuiGrid>
        <MuiGrid
          item
          className="tw-grow-0 tw-col-span-2 lg:tw-grid-cols-1 md:tw-grid-cols-1 sm:tw-grid-cols-1 tw-space-x-6 tw-h-full"
        >
          <MuiBox className="tw-h-80 tw-m-1 tw-mt-8">
            <PnlChart chartData={histogramData} />
          </MuiBox>
        </MuiGrid>
      </MuiGrid>
    </MuiContainer>
  );
};

export default ProfitLossVector;
