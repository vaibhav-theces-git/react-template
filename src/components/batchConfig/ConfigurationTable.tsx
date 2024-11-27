/* eslint-disable */
import { ColDef, GridApi } from "ag-grid-enterprise";
import { AgGridReact } from "ag-grid-react";
import { forwardRef, useImperativeHandle, useMemo, useRef } from "react";
import MuiContainer from "src/common/components/container/MuiContainer";
import { BatchListResponseType } from "src/types/batchConfigurationTypes";
import InsertChartIcon from "@mui/icons-material/InsertChart";
import { AccessTime, Height } from "@mui/icons-material";
import CopyrightIcon from "@mui/icons-material/Copyright";
import ErrorTooltip from "./ErrorTooltip";
import { BATCH_TYPES } from "src/common/constants/batchTypeConstant";

export interface ConfigurationTableProps {
  data: BatchListResponseType[];
  onBatchConfigRowSelection: (row: any) => void;
}

const ConfigurationTable = forwardRef(
  (configurationTableProps: ConfigurationTableProps, ref) => {
    const { data, onBatchConfigRowSelection } = configurationTableProps;
    const configTableRef = useRef<any>();
    const isRowSelected = useRef(false);

    const gridOptions = {
      columnDefs: [
        {
          field: "vbt_flag",
          headerName: "Flag",
          minWidth: 80,
          maxWidth: 110,
          wrapHeaderText: true,
          cellRenderer: (params: any) => {
            return (
              <div>
                {params.data.schedule_flag ? <AccessTime /> : null}
                {params.data.is_critical ? <CopyrightIcon /> : null}
              </div>
            );
          },
        },
        {
          field: "batch_type",
          headerName: "Batch Type",
          minWidth: 100,
          maxWidth: 150,
          wrapHeaderText: true,
          cellRenderer: (params: any) => {
            if (params.data.batch_type === BATCH_TYPES.SPOT_VOL) {
              return "Spot-Vol";
            } else if (params.data.batch_type === BATCH_TYPES.VBT) {
              return "VaR-Bt";
            } else if (params.data.batch_type === BATCH_TYPES.REGULAR) {
              return "Regular";
            } else if (params.data.batch_type === BATCH_TYPES.UNIT_VAR) {
              return "Unit-VaR";
            }
            return "";
          },
        },
        {
          field: "batch_name",
          headerName: "Batch Name",
          minWidth: 250,
          wrapHeaderText: true,
        },
        {
          field: "run_days",
          headerName: "Run Days",
          minWidth: 160,
          wrapHeaderText: true,
        },
        {
          field: "scheduled_start_time",
          headerName: "Schedule Time [UTC]",
          minWidth: 100,
          wrapHeaderText: true,
          headerClass: "text-center",
          cellStyle: {
            textAlign: "center",
          },
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
        tooltipComponent: ErrorTooltip,
      };
    }, []);

    const onRowSelectionChanged = (gridOptions: any) => {
      const selectedNodes = gridOptions.api.getSelectedNodes();
      if (selectedNodes && selectedNodes.length > 0) {
        const selectedRowData = selectedNodes[0].data;
        onBatchConfigRowSelection(selectedRowData);
        isRowSelected.current = true;
      }
    };

    useImperativeHandle(ref, () => ({
      resetPagination: () => {
        configTableRef.current.api.paginationGoToPage(0);
      },
    }));

    const onPaginationChanged = () => {
      if (!isRowSelected.current && configTableRef.current) {
        configTableRef.current.api.deselectAll();
      }
      isRowSelected.current = false;
    };

    return (
      <MuiContainer
        className="tw-w-fit tw-min-w-full tw-p-0 tw-m-0 "
        style={{ maxHeight: "1050px" }}
      >
        <div
          className="fx-conduit-container tw-w-full tw-h-full tw-flow-root ag-theme-alpine"
          id="batchConfigurationTable"
        >
          <AgGridReact
            ref={configTableRef}
            rowData={data}
            columnDefs={gridOptions.columnDefs}
            defaultColDef={defaultColDef}
            rowSelection="single"
            onSelectionChanged={onRowSelectionChanged}
            pagination
            paginationPageSize={15}
            paginationPageSizeSelector={[5, 15, 20]}
            onPaginationChanged={onPaginationChanged}
            suppressDragLeaveHidesColumns
            suppressExcelExport
            suppressContextMenu
            suppressCellFocus
            domLayout="autoHeight"
            tooltipShowDelay={0}
          />
        </div>
      </MuiContainer>
    );
  }
);

export default ConfigurationTable;
