import { QueryStatus } from "@reduxjs/toolkit/dist/query";
import { ColDef, GridApi } from "ag-grid-enterprise";
import { AgGridReact } from "ag-grid-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { MuiBox } from "src/common/components/box/MuiBox";
import SnackBarUtils, {
  snackbarOption,
} from "src/common/components/SnackBarUtilsConfigurator";
import { errorPrefix } from "src/common/constants/testids";
import { getErrorMessageFromError } from "src/common/utilities/globalUtils";
import { useLazyGetResultsTableDataQuery } from "src/queries/portfolioSetupApi";
import { ErrorType } from "src/types/apiErrorTypes";
import {
  dataCardsRequestType,
  resultDataTableResponseType,
} from "src/types/syntheticPortfolioTypes";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecordRounded";
import MuiTooltip from "src/common/components/tooltip/MuiTooltip";
import { formattedDateTime } from "src/common/utilities/formatUtils/dateUtils";

interface ResultsDataTableProps {
  portfolioId: number;
  portfolioName: string;
}

const ResultsDataTable = (props: ResultsDataTableProps) => {
  const { portfolioId, portfolioName } = props;
  const resultsDataGridRef = useRef<GridApi | null>(null);
  const [resultTableData, setResultTableData] = useState<
    resultDataTableResponseType[]
  >([]);
  const [resultTableDataTrigger] = useLazyGetResultsTableDataQuery();
  console.log("portfolioName", portfolioName);
  const getTableData = () => {
    const dataCardsParams: dataCardsRequestType = {
      portfolio_id: portfolioId,
    };
    resultTableDataTrigger(dataCardsParams)
      .then((resp) => {
        const respData: {
          status: QueryStatus;
          data: resultDataTableResponseType[] | undefined;
          error: string;
        } = {
          status: resp.status,
          data: resp.data,
          error: getErrorMessageFromError(resp.error as ErrorType),
        };
        return respData;
      })
      .then((d) => {
        if (d.status === "fulfilled" && d.data !== undefined) {
          setResultTableData(d.data);
        } else {
          const errorMsg = `${errorPrefix} Technical Error : ${d.error}`;
          SnackBarUtils.error(errorMsg, snackbarOption);
        }
      })
      .catch((e) => {
        const errorMsg = `${errorPrefix} Technical Error :`.concat(e);
        SnackBarUtils.error(errorMsg, snackbarOption);
      });
  };

  /* eslint-disable */
  const StatusCellRenderer = (params: any) => {
    const isGood = params.data.is_pos_valid as boolean;
    const tooltipMessage = isGood
      ? `${params.data.error_codes}`
      : `${params.data.error_codes}`;
    return (
      <MuiTooltip title={tooltipMessage} arrow placement="top">
        <span className="tw-flex tw-justify-center tw-mt-1">
          {isGood ? (
            <FiberManualRecordIcon
              style={{ color: "green" }}
              fontSize="small"
            />
          ) : (
            <FiberManualRecordIcon style={{ color: "red" }} fontSize="small" />
          )}
        </span>
      </MuiTooltip>
    );
  };
  /* eslint-enable */

  const gridOptions = {
    columnDefs: [
      {
        field: "info",
        cellRenderer: StatusCellRenderer,
        valueGetter: (params: any) => params.data.error_codes, // eslint-disable-line
        minWidth: 100,
      },

      {
        headerName: "Instrument name",
        field: "instrument_name",
        minWidth: 250,
      },
      {
        headerName: "Instrument type",
        field: "instrument_type",
        minWidth: 170,
      },
      {
        headerName: "Quantity",
        field: "quantity",
        minWidth: 170,
      },
      {
        headerName: "Imp vol",
        field: "implied_vol",
        minWidth: 135,
      },

      {
        field: "position_key",
        hide: true,
      },

      {
        headerName: "Position price",
        field: "position_price",
        minWidth: 170,
      },

      {
        headerName: "Und price",
        field: "und_price",
        minWidth: 170,
      },

      {
        headerName: "Dollar delta",
        field: "dollar_delta",
        minWidth: 160,
      },
      {
        headerName: "Dollar vega",
        field: "dollar_vega",
        minWidth: 160,
      },
      {
        headerName: "Dollar gamma",
        field: "dollar_gamma",
        minWidth: 160,
      },
      {
        headerName: "Dollar theta",
        field: "dollar_theta",
        minWidth: 160,
      },
      {
        headerName: "VAR95",
        field: "VAR95",
        minWidth: 135,
      },
      {
        headerName: "VAR99",
        field: "VAR99",
        minWidth: 135,
      },
      {
        headerName: "VAR100",
        field: "VAR100",
        minWidth: 135,
      },

      {
        field: "error_codes",
        hide: true,
      },
      {
        field: "is_pos_valid",
        hide: true,
      },
    ],
  };

  const defaultColDef = useMemo<ColDef>(() => {
    return {
      sortable: true,
      resizable: true,
      filter: true,
      flex: 1,
      menuTabs: ["generalMenuTab", "filterMenuTab"],
      shownorowsoverlay: true,
      unSortIcon: true,
    };
  }, []);

  const onGridReady = (params: { api: GridApi }) => {
    resultsDataGridRef.current = params.api;
    params.api.autoSizeAllColumns();
  };

  /* eslint-disable */
  const getContextMenuItems = (params: any) => {
    let { defaultMenuItems } = params;
    if (!defaultMenuItems) {
      defaultMenuItems = [];
    }
    defaultMenuItems.push({
      name: "Export Data",
      action: () => {
        const fileName = `${portfolioName}_${formattedDateTime()}.csv`;
        resultsDataGridRef?.current?.exportDataAsCsv({ fileName });
      },
    });
    return defaultMenuItems;
  };
  /* eslint-disable */

  useEffect(() => {
    getTableData();
  }, [resultTableData]); // eslint-disable-line

  return (
    <MuiBox style={{ height: "668px" }}>
      <div
        className="ag-theme-alpine"
        style={{ width: "100%", height: "100%" }}
      >
        <AgGridReact
          rowData={resultTableData}
          columnDefs={gridOptions.columnDefs} // eslint-disable-line
          defaultColDef={defaultColDef}
          suppressRowDeselection
          suppressDragLeaveHidesColumns
          getContextMenuItems={getContextMenuItems}
          suppressCellFocus
          domLayout="normal"
          pagination
          rowHeight={42}
          paginationPageSize={13}
          paginationPageSizeSelector={[10, 13, 15, 20]}
          onGridReady={onGridReady}
        />
      </div>
    </MuiBox>
  );
};

export default ResultsDataTable;
