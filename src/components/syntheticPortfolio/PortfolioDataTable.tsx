import { useEffect, useMemo, useRef } from "react";
import { ColDef, GridApi } from "ag-grid-enterprise";
import { AgGridReact } from "ag-grid-react";
import { MuiBox } from "src/common/components/box/MuiBox";
import { gridResponseType } from "src/types/syntheticPortfolioTypes";
import { LinearProgress } from "@mui/material";
import { formattedDateTime } from "src/common/utilities/formatUtils/dateUtils";

interface PortfolioDataTableProps {
  portfolioData: any[] | undefined;
  portfolioName: string;
  gridPortfolioSelectionCallback: (
    gridPortfolio: gridResponseType[] | undefined
  ) => void;
  isDataLoading: boolean;
  gridReady: (api: GridApi) => void;
}

export const PortfolioDataTable = (
  portfolioDataTableProps: PortfolioDataTableProps
) => {
  const {
    portfolioData,
    portfolioName,
    gridPortfolioSelectionCallback,
    isDataLoading,
    gridReady,
  } = portfolioDataTableProps;
  const portfolioDataGridRef = useRef<GridApi | null>(null);

  const gridOptions = {
    columnDefs: [
      {
        field: "position_key",
        hide: true,
      },
      {
        field: "run_id",
        hide: true,
      },
      {
        headerName: "Legal entity",
        field: "legal_entity_name",
      },
      {
        headerName: "Account name",
        field: "account_name",
      },
      {
        headerName: "Instrument name",
        field: "instrument_name",
      },
      {
        headerName: "Instrument type",
        field: "instrument_type",
      },
      {
        headerName: "Symbol pair",
        field: "symbol_pair",
      },
      {
        headerName: "Quantity",
        field: "quantity",
      },
      {
        headerName: "Maturity date",
        field: "maturity_date",
      },

      {
        headerName: "Exchange",
        field: "exchange",
      },
      {
        headerName: "Strike",
        field: "strike",
      },
      {
        headerName: "Und type",
        field: "und_type",
      },
      {
        headerName: "UND price",
        field: "und_price",
        hide: true,
      },
      {
        headerName: "Option type",
        field: "option_type",
      },
      {
        headerName: "Dollar delta",
        field: "dollar_delta",
        hide: true,
      },
      {
        headerName: "Dollar gamma",
        field: "dollar_gamma",
        hide: true,
      },
      {
        headerName: "Dollar theta",
        field: "dollar_theta",
        hide: true,
      },
      {
        headerName: "Dollar vega",
        field: "dollar_vega",
        hide: true,
      },
      {
        headerName: "Imp vol",
        field: "imp_vol",
        hide: true,
      },
      {
        headerName: "Is pos valid",
        field: "is_pos_valid",
        hide: true,
      },
      {
        headerName: "Error code",
        field: "error_codes",
        hide: true,
      },
      {
        headerName: "Created time",
        field: "t_create",
        hide: true,
      },
      {
        headerName: "Updated time",
        field: "t_update",
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

  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === "Escape") {
      if (portfolioDataGridRef.current) {
        const selectedNodes: gridResponseType[] =
          portfolioDataGridRef.current.getSelectedRows(); // eslint-disable-line
        if (selectedNodes && selectedNodes.length > 0) {
          const selectedRowData: gridResponseType[] | undefined = undefined; // eslint-disable-line
          gridPortfolioSelectionCallback(selectedRowData);
        }
        portfolioDataGridRef.current.deselectAll();
      }
    }
  };

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []); //eslint-disable-line

  const onGridReady = (params: { api: GridApi }) => {
    portfolioDataGridRef.current = params.api;
    params.api.autoSizeAllColumns();
    gridReady(params.api);
  };

  const onRowSelectionChanged = (params: { api: GridApi }) => {
    const selectedNodes: gridResponseType[] = params.api.getSelectedRows(); // eslint-disable-line
    if (selectedNodes && selectedNodes.length > 0) {
      const selectedRowData = selectedNodes; // eslint-disable-line
      gridPortfolioSelectionCallback(selectedRowData);
    }
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
        portfolioDataGridRef?.current?.exportDataAsCsv({ fileName });
      },
    });
    return defaultMenuItems;
  };
  /* eslint-disable */

  return (
    <MuiBox style={{ height: "772px" }}>
      {isDataLoading ? (
        <MuiBox
          className="tw-absolute tw-top-1/2 tw-left-1/2 tw-translate-x-1/2 tw-translate-y-1/2 tw-w-full tw-flex tw-flex-col tw-justify-center tw-items-center"
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "100%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <span style={{ marginTop: 10 }}>Loading data...</span>
          <LinearProgress style={{ width: "100%", maxWidth: "300px" }} />
        </MuiBox>
      ) : (
        <div
          className="ag-theme-alpine"
          style={{ width: "100%", height: "100%" }}
        >
          <AgGridReact
            rowData={portfolioData}
            columnDefs={gridOptions.columnDefs} // eslint-disable-line
            defaultColDef={defaultColDef}
            rowSelection="multiple"
            domLayout="normal"
            suppressDragLeaveHidesColumns
            suppressCellFocus
            pagination
            paginationPageSize={17}
            rowHeight={39.5}
            paginationPageSizeSelector={[10, 17, 20]}
            onGridReady={onGridReady}
            onSelectionChanged={onRowSelectionChanged}
            getContextMenuItems={getContextMenuItems}
          />
        </div>
      )}
    </MuiBox>
  );
};
