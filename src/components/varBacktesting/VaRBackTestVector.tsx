import { useRef, useState, useMemo, useEffect } from "react";
import { AgGridReact } from "ag-grid-react";
import { ColDef, RowClassParams } from "ag-grid-enterprise";
import { MuiTypography } from "src/common/components/typography/MuiTypography/MuiTypography";
import { MuiButtonGroup } from "src/common/components/button/MuiButtons/MuiButtonGroup";
import { MuiIconButton } from "src/common/components/button/MuiButtons/MuiIconButton";
import { Fullscreen, FullscreenExit } from "@mui/icons-material";
import { MuiBox } from "src/common/components/box/MuiBox";
import { varBackTestDataResponseType } from "src/types/varBackTestType";
import { ReportDownload } from "src/common/components/download/ReportDownload";
import { formattedDateTime } from "src/common/utilities/formatUtils/dateUtils";

export interface ProfitLossVectorProps {
  varBackTestData: varBackTestDataResponseType[];
  togglecallback: (enableZoom: boolean) => void;
  varLevel: string;
  selectedRunId: number;
}

const VaRBackTestVector = (profitLossVectorProps: ProfitLossVectorProps) => {
  const { varBackTestData, togglecallback, varLevel, selectedRunId } =
    profitLossVectorProps;
  const gridRef = useRef<AgGridReact>(null);
  const [blockZoomed, setBlockZoomed] = useState(false);

  const gridOptions = {
    columnDefs: [
      {
        field: "date",
        headerName: "Date",
        minWidth: 105,
        type: "numericColumn",
        wrapHeaderText: true,
      },
      {
        field: "daily_pnl",
        headerName: "Daily PnL",
        minWidth: 110,
        type: "numericColumn",
        wrapHeaderText: true,
      },
      {
        field: "var_95_left",
        headerName: "VaR 95 Left",
        minWidth: 110,
        wrapHeaderText: true,
        type: "numericColumn",
        hide: varLevel === "VAR-99",
      },
      {
        field: "var_95_right",
        headerName: "VaR 95 Right",
        minWidth: 110,
        wrapHeaderText: true,
        type: "numericColumn",
        hide: varLevel === "VAR-99",
      },
      {
        field: "var_99_left",
        headerName: "VaR 99 Left",
        minWidth: 110,
        wrapHeaderText: true,
        type: "numericColumn",
        hide: varLevel === "VAR-95",
      },
      {
        field: "var_99_right",
        headerName: "VaR 99 Right",
        minWidth: 110,
        wrapHeaderText: true,
        type: "numericColumn",
        hide: varLevel === "VAR-95",
      },
    ],
    rowClassRules: {
      vbt_breach_highlight: (params: RowClassParams) => {
        const breach = params.data as varBackTestDataResponseType;
        return (
          (breach.breach_95 !== null && varLevel === "VAR-95") ||
          (breach.breach_99 !== null && varLevel === "VAR-99")
        );
      },
    },
  };

  const defaultColDef = useMemo<ColDef>(() => {
    return {
      sortable: true,
      resizable: true,
      filter: true,
      flex: 1,
      menuTabs: ["generalMenuTab", "filterMenuTab"],
      shownorowsoverlay: true,
    };
  }, []);

  const handleZoom = () => {
    setBlockZoomed(!blockZoomed);
  };
  useEffect(() => {
    togglecallback(blockZoomed);
  }, [blockZoomed, togglecallback]);

  return (
    <div className="fx-conduit-container tw-w-full tw-h-auto tw-overflow-hidden">
      <div className="fx-conduit-header tw-h-7 tw-pl-1 tw-pr-1 tw-bg-slate-500 tw-align-middle tw-justify-between tw-flex">
        <div className="fx-conduit-title tw-flex tw-items-center">
          <MuiTypography className="tw-text-sm tw-mr-5">
            VaR Back Test
          </MuiTypography>
        </div>
        <div className="fx-conduit-buttons tw-flex tw-items-center">
          <MuiButtonGroup className="tw-flex tw-items-center">
            <MuiIconButton size="small">
              {varBackTestData && (
                <ReportDownload
                  formattedTableData={varBackTestData}
                  fileName={`VarBackTestData_${selectedRunId}_${formattedDateTime()}`}
                />
              )}
            </MuiIconButton>
            <MuiIconButton size="small" onClick={handleZoom}>
              {blockZoomed && <FullscreenExit fontSize="small" />}
              {!blockZoomed && <Fullscreen fontSize="small" />}
            </MuiIconButton>
          </MuiButtonGroup>
        </div>
      </div>
      <div className="fx-conduit-content tw-align-middle tw-h-[calc(100%-1.75rem)] tw-w-full tw-min-w-full tw-block">
        <MuiBox className="ag-theme-alpine">
          <AgGridReact
            rowData={varBackTestData}
            columnDefs={gridOptions.columnDefs}
            defaultColDef={defaultColDef}
            rowClassRules={gridOptions.rowClassRules}
            ref={gridRef}
            rowHeight={30.5}
            suppressContextMenu
            pagination
            paginationPageSize={23}
            paginationPageSizeSelector={false}
            unSortIcon
            suppressDragLeaveHidesColumns
            domLayout="autoHeight"
          />
        </MuiBox>
      </div>
    </div>
  );
};

export default VaRBackTestVector;
