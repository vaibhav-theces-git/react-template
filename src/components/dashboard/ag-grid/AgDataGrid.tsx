/* eslint-disable */
import { ColDef, GridOptions } from "ag-grid-enterprise";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import { useCallback, useEffect, useMemo, useState } from "react";
import { MuiBox } from "src/common/components/box/MuiBox";
import { AggregationResponseType } from "src/types/aggregationType";
import { HierarchyLevelConstant } from "src/common/constants/AggragationLevelConstant";

export interface Latest {
  data: any;
  getPnlVectorData: (id: any) => void;
  aggregation: AggregationResponseType[];
  selectedaggregationtype: string;
  blockzoomed: boolean;
}

const AgGridDataLatest = (latest: Latest) => {
  const { data, getPnlVectorData, selectedaggregationtype, blockzoomed } =
    latest;
  const [rowData, setRowData] = useState<any>(data);
  const [gridOptions, setGridOptions] = useState<GridOptions>({});
  const [detailCellRendererParams, setDetailCellRendererParams] = useState<any>(
    {}
  );
  let heightWidth;
  if (!blockzoomed) {
    var hw = {
      height: "510px",
      width: "100%",
    };
  } else {
    hw = {
      height: "785px",
      width: "100%",
    };
  }
  heightWidth = hw;

  const defaultColDef = useMemo<ColDef>(() => {
    return {
      flex: 1,
      sortable: true,
      resizable: true,
      filter: true,
      menuTabs: ["generalMenuTab", "filterMenuTab"],
      shownorowsoverlay: true,
      unSortIcon: true,
    };
  }, []);

  const getContextMenuItems = useCallback((params: any) => {
    return [
      {
        name: "PnL Vector",
        action: () => {
          params.node.data.id ? getPnlVectorData(params.node.data.id) : null;
        },
      },
    ];
  }, []);

  useEffect(() => {
    setRowData(data);
    if (
      selectedaggregationtype &&
      selectedaggregationtype === HierarchyLevelConstant.LEACCSYMPOS
    ) {
      setGridOptions({
        columnDefs: [
          {
            field: "legal_entity",
            headerName: "Legal Entity",
            wrapHeaderText: true,
            cellRenderer: "agGroupCellRenderer",
          },
          {
            field: "market_value",
            headerName: "Market Value",
            wrapHeaderText: true,
          },
          { field: "VAR95", headerName: "VAR95", wrapHeaderText: true },
          { field: "VAR99", headerName: "VAR99", wrapHeaderText: true },
          {
            field: "VAR100",
            headerName: "VAR100",
            wrapHeaderText: true,
          },
          {
            field: "dollar_delta",
            headerName: "Dollar Delta",
            wrapHeaderText: true,
          },
          {
            field: "dollar_vega",
            headerName: "Dollar Vega",
            wrapHeaderText: true,
          },
          {
            field: "dollar_gamma",
            headerName: "Dollar Gamma",
            wrapHeaderText: true,
          },
          {
            field: "dollar_theta",
            headerName: "Dollar Theta",
            wrapHeaderText: true,
          },
        ],
        masterDetail: true,
      });
      setDetailCellRendererParams({
        detailGridOptions: {
          columnDefs: [
            {
              field: "account_id",
              headerName: "Account Id",
              wrapHeaderText: true,
              cellRenderer: "agGroupCellRenderer",
            },
            {
              field: "market_value",
              headerName: "Market Value",
              wrapHeaderText: true,
            },
            { field: "VAR95", headerName: "VAR95", wrapHeaderText: true },
            { field: "VAR99", headerName: "VAR99", wrapHeaderText: true },
            { field: "VAR100", headerName: "VAR100", wrapHeaderText: true },
            {
              field: "dollar_delta",
              headerName: "Dollar Delta",
              wrapHeaderText: true,
            },
            {
              field: "dollar_vega",
              headerName: "Dollar Vega",
              wrapHeaderText: true,
            },
            {
              field: "dollar_gamma",
              headerName: "Dollar Gamma",
              wrapHeaderText: true,
            },
            {
              field: "dollar_theta",
              headerName: "Dollar Theta",
              wrapHeaderText: true,
            },
          ],
          defaultColDef: {
            flex: 1,
            filter: true,
            unSortIcon: true,
            resizable: true,
            menuTabs: ["generalMenuTab", "filterMenuTab"],
          },
          masterDetail: true,
          detailRowAutoHeight: true,
          getContextMenuItems: getContextMenuItems,
          detailCellRendererParams: {
            detailGridOptions: {
              columnDefs: [
                {
                  field: "symbol_pair",
                  headerName: "Symbol Pair",
                  wrapHeaderText: true,
                  cellRenderer: "agGroupCellRenderer",
                },
                {
                  field: "market_value",
                  headerName: "Market Value",
                  wrapHeaderText: true,
                },
                {
                  field: "VAR95",
                  headerName: "VAR95",
                  wrapHeaderText: true,
                },
                { field: "VAR99", headerName: "VAR99", wrapHeaderText: true },
                { field: "VAR100", headerName: "VAR100", wrapHeaderText: true },
                {
                  field: "dollar_delta",
                  headerName: "Dollar Delta",
                  wrapHeaderText: true,
                },
                {
                  field: "dollar_vega",
                  headerName: "Dollar Vega",
                  wrapHeaderText: true,
                },
                {
                  field: "dollar_gamma",
                  headerName: "Dollar Gamma",
                  wrapHeaderText: true,
                },
                {
                  field: "dollar_theta",
                  headerName: "Dollar Theta",
                  wrapHeaderText: true,
                },
              ],
              defaultColDef: {
                flex: 1,
                filter: true,
                unSortIcon: true,
                resizable: true,
                menuTabs: ["generalMenuTab", "filterMenuTab"],
              },
              masterDetail: true,
              detailRowAutoHeight: true,
              getContextMenuItems: getContextMenuItems,
              detailCellRendererParams: {
                detailGridOptions: {
                  columnDefs: [
                    {
                      field: "position_key",
                      headerName: "Position Key",
                      wrapHeaderText: true,
                      minWidth: "180",
                      maxWidth: "210",
                    },
                    {
                      field: "market_value",
                      headerName: "Market Value",
                      wrapHeaderText: true,
                      minWidth: "180",
                      maxWidth: "210",
                    },
                    {
                      field: "VAR95",
                      headerName: "VAR95",
                      wrapHeaderText: true,
                      minWidth: "180",
                      maxWidth: "210",
                    },
                    {
                      field: "VAR99",
                      headerName: "VAR99",
                      wrapHeaderText: true,
                      minWidth: "180",
                      maxWidth: "210",
                    },
                    {
                      field: "VAR100",
                      headerName: "VAR100",
                      wrapHeaderText: true,
                      minWidth: "180",
                      maxWidth: "210",
                    },

                    {
                      field: "dollar_delta",
                      headerName: "Dollar Delta",
                      wrapHeaderText: true,
                      minWidth: "180",
                      maxWidth: "210",
                    },
                    {
                      field: "dollar_vega",
                      headerName: "Dollar Vega",
                      wrapHeaderText: true,
                      minWidth: "180",
                      maxWidth: "210",
                    },
                    {
                      field: "dollar_gamma",
                      headerName: "Dollar Gamma",
                      wrapHeaderText: true,
                      minWidth: "180",
                      maxWidth: "210",
                    },
                    {
                      field: "dollar_theta",
                      headerName: "Dollar Theta",
                      wrapHeaderText: true,
                      minWidth: "180",
                      maxWidth: "210",
                    },

                    {
                      field: "quantity",
                      headerName: "Quantity",
                      wrapHeaderText: true,
                      minWidth: "180",
                      maxWidth: "210",
                    },
                    {
                      field: "instrument_type",
                      headerName: "Product Type",
                      wrapHeaderText: true,
                      minWidth: "180",
                      maxWidth: "210",
                    },
                    {
                      field: "instrument_name",
                      headerName: "Product Name",
                      wrapHeaderText: true,
                      minWidth: "180",
                      maxWidth: "210",
                    },
                    {
                      field: "exchange",
                      headerName: "Exchange",
                      wrapHeaderText: true,
                      minWidth: "180",
                      maxWidth: "210",
                    },
                  ],
                  defaultColDef: {
                    flex: 1,
                    filter: true,
                    unSortIcon: true,
                    resizable: true,
                    menuTabs: ["generalMenuTab", "filterMenuTab"],
                  },
                  detailRowAutoHeight: true,

                  getContextMenuItems: getContextMenuItems,
                },
                getDetailRowData: (params: any) => {
                  params.successCallback(params.data.children);
                },
              },
            },
            getDetailRowData: (params: any) => {
              params.successCallback(params.data.children);
            },
          },
        },
        getDetailRowData: (params: any) => {
          params.successCallback(params.data.children);
        },
      });
    } else if (
      selectedaggregationtype &&
      selectedaggregationtype === HierarchyLevelConstant.LEACCPOS
    ) {
      setGridOptions({
        columnDefs: [
          {
            field: "legal_entity",
            headerName: "Legal Entity",
            wrapHeaderText: true,
            cellRenderer: "agGroupCellRenderer",
          },
          {
            field: "market_value",
            headerName: "Market Value",
            wrapHeaderText: true,
          },
          { field: "VAR95", headerName: "VAR95", wrapHeaderText: true },
          { field: "VAR99", headerName: "VAR99", wrapHeaderText: true },
          {
            field: "VAR100",
            headerName: "VAR100",
            wrapHeaderText: true,
          },
          {
            field: "dollar_delta",
            headerName: "Dollar Delta",
            wrapHeaderText: true,
          },
          {
            field: "dollar_vega",
            headerName: "Dollar Vega",
            wrapHeaderText: true,
          },
          {
            field: "dollar_gamma",
            headerName: "Dollar Gamma",
            wrapHeaderText: true,
          },
          {
            field: "dollar_theta",
            headerName: "Dollar Theta",
            wrapHeaderText: true,
          },
        ],
        masterDetail: true,
      });
      setDetailCellRendererParams({
        detailGridOptions: {
          columnDefs: [
            {
              field: "account_id",
              headerName: "Account Id",
              wrapHeaderText: true,
              cellRenderer: "agGroupCellRenderer",
            },
            {
              field: "market_value",
              headerName: "Market Value",
              wrapHeaderText: true,
            },
            { field: "VAR95", headerName: "VAR95", wrapHeaderText: true },
            { field: "VAR99", headerName: "VAR99", wrapHeaderText: true },
            { field: "VAR100", headerName: "VAR100", wrapHeaderText: true },
            {
              field: "dollar_delta",
              headerName: "Dollar Delta",
              wrapHeaderText: true,
            },
            {
              field: "dollar_vega",
              headerName: "Dollar Vega",
              wrapHeaderText: true,
            },
            {
              field: "dollar_gamma",
              headerName: "Dollar Gamma",
              wrapHeaderText: true,
            },
            {
              field: "dollar_theta",
              headerName: "Dollar Theta",
              wrapHeaderText: true,
            },
          ],
          defaultColDef: {
            flex: 1,
            filter: true,
            unSortIcon: true,
            resizable: true,
            menuTabs: ["generalMenuTab", "filterMenuTab"],
          },
          masterDetail: true,
          detailRowAutoHeight: true,

          getContextMenuItems: getContextMenuItems,
          detailCellRendererParams: {
            detailGridOptions: {
              columnDefs: [
                {
                  field: "position_key",
                  headerName: "Position Key",
                  wrapHeaderText: true,
                  minWidth: "180",
                  maxWidth: "210",
                },
                {
                  field: "market_value",
                  headerName: "Market Value",
                  wrapHeaderText: true,
                  minWidth: "180",
                  maxWidth: "210",
                },
                {
                  field: "VAR95",
                  headerName: "VAR95",
                  wrapHeaderText: true,
                  minWidth: "180",
                  maxWidth: "210",
                },
                {
                  field: "VAR99",
                  headerName: "VAR99",
                  wrapHeaderText: true,
                  minWidth: "180",
                  maxWidth: "210",
                },
                {
                  field: "VAR100",
                  headerName: "VAR100",
                  wrapHeaderText: true,
                  minWidth: "180",
                  maxWidth: "210",
                },

                {
                  field: "dollar_delta",
                  headerName: "Dollar Delta",
                  wrapHeaderText: true,
                  minWidth: "180",
                  maxWidth: "210",
                },
                {
                  field: "dollar_vega",
                  headerName: "Dollar Vega",
                  wrapHeaderText: true,
                  minWidth: "180",
                  maxWidth: "210",
                },
                {
                  field: "dollar_gamma",
                  headerName: "Dollar Gamma",
                  wrapHeaderText: true,
                  minWidth: "180",
                  maxWidth: "210",
                },
                {
                  field: "dollar_theta",
                  headerName: "Dollar Theta",
                  wrapHeaderText: true,
                  minWidth: "180",
                  maxWidth: "210",
                },

                {
                  field: "quantity",
                  headerName: "Quantity",
                  wrapHeaderText: true,
                  minWidth: "180",
                  maxWidth: "210",
                },
                {
                  field: "instrument_type",
                  headerName: "Product Type",
                  wrapHeaderText: true,
                  minWidth: "180",
                  maxWidth: "210",
                },
                {
                  field: "instrument_name",
                  headerName: "Product Name",
                  wrapHeaderText: true,
                  minWidth: "180",
                  maxWidth: "210",
                },
                {
                  field: "exchange",
                  headerName: "Exchange",
                  wrapHeaderText: true,
                  minWidth: "180",
                  maxWidth: "210",
                },
              ],
              defaultColDef: {
                flex: 1,
                filter: true,
                unSortIcon: true,
                resizable: true,
                menuTabs: ["generalMenuTab", "filterMenuTab"],
              },
              detailRowAutoHeight: true,
              getContextMenuItems: getContextMenuItems,
            },
            getDetailRowData: (params: any) => {
              params.successCallback(params.data.children);
            },
          },
        },
        getDetailRowData: (params: any) => {
          params.successCallback(params.data.children);
        },
      });
    } else if (
      selectedaggregationtype &&
      selectedaggregationtype === HierarchyLevelConstant.LESYMPOS
    ) {
      setGridOptions({
        columnDefs: [
          {
            field: "legal_entity",
            headerName: "Legal Entity",
            wrapHeaderText: true,
            cellRenderer: "agGroupCellRenderer",
          },
          {
            field: "market_value",
            headerName: "Market Value",
            wrapHeaderText: true,
          },
          { field: "VAR95", headerName: "VAR95", wrapHeaderText: true },
          { field: "VAR99", headerName: "VAR99", wrapHeaderText: true },
          {
            field: "VAR100",
            headerName: "VAR100",
            wrapHeaderText: true,
          },
          {
            field: "dollar_delta",
            headerName: "Dollar Delta",
            wrapHeaderText: true,
          },
          {
            field: "dollar_vega",
            headerName: "Dollar Vega",
            wrapHeaderText: true,
          },
          {
            field: "dollar_gamma",
            headerName: "Dollar Gamma",
            wrapHeaderText: true,
          },
          {
            field: "dollar_theta",
            headerName: "Dollar Theta",
            wrapHeaderText: true,
          },
        ],
        masterDetail: true,
      });
      setDetailCellRendererParams({
        detailGridOptions: {
          columnDefs: [
            {
              field: "symbol_pair",
              headerName: "Symbol Pair",
              wrapHeaderText: true,
              cellRenderer: "agGroupCellRenderer",
            },
            {
              field: "market_value",
              headerName: "Market Value",
              wrapHeaderText: true,
            },
            {
              field: "VAR95",
              headerName: "VAR95",
              wrapHeaderText: true,
            },
            { field: "VAR99", headerName: "VAR99", wrapHeaderText: true },
            { field: "VAR100", headerName: "VAR100", wrapHeaderText: true },
            {
              field: "dollar_delta",
              headerName: "Dollar Delta",
              wrapHeaderText: true,
            },
            {
              field: "dollar_vega",
              headerName: "Dollar Vega",
              wrapHeaderText: true,
            },
            {
              field: "dollar_gamma",
              headerName: "Dollar Gamma",
              wrapHeaderText: true,
            },
            {
              field: "dollar_theta",
              headerName: "Dollar Theta",
              wrapHeaderText: true,
            },
          ],
          defaultColDef: {
            flex: 1,
            filter: true,
            unSortIcon: true,
            resizable: true,
            menuTabs: ["generalMenuTab", "filterMenuTab"],
          },
          masterDetail: true,
          detailRowAutoHeight: true,

          getContextMenuItems: getContextMenuItems,
          detailCellRendererParams: {
            detailGridOptions: {
              columnDefs: [
                {
                  field: "position_key",
                  headerName: "Position Key",
                  wrapHeaderText: true,
                  minWidth: "180",
                  maxWidth: "210",
                },
                {
                  field: "market_value",
                  headerName: "Market Value",
                  wrapHeaderText: true,
                  minWidth: "180",
                  maxWidth: "210",
                },
                {
                  field: "VAR95",
                  headerName: "VAR95",
                  wrapHeaderText: true,
                  minWidth: "180",
                  maxWidth: "210",
                },
                {
                  field: "VAR99",
                  headerName: "VAR99",
                  wrapHeaderText: true,
                  minWidth: "180",
                  maxWidth: "210",
                },
                {
                  field: "VAR100",
                  headerName: "VAR100",
                  wrapHeaderText: true,
                  minWidth: "180",
                  maxWidth: "210",
                },

                {
                  field: "dollar_delta",
                  headerName: "Dollar Delta",
                  wrapHeaderText: true,
                  minWidth: "180",
                  maxWidth: "210",
                },
                {
                  field: "dollar_vega",
                  headerName: "Dollar Vega",
                  wrapHeaderText: true,
                  minWidth: "180",
                  maxWidth: "210",
                },
                {
                  field: "dollar_gamma",
                  headerName: "Dollar Gamma",
                  wrapHeaderText: true,
                  minWidth: "180",
                  maxWidth: "210",
                },
                {
                  field: "dollar_theta",
                  headerName: "Dollar Theta",
                  wrapHeaderText: true,
                  minWidth: "180",
                  maxWidth: "210",
                },

                {
                  field: "quantity",
                  headerName: "Quantity",
                  wrapHeaderText: true,
                  minWidth: "180",
                  maxWidth: "210",
                },
                {
                  field: "instrument_type",
                  headerName: "Product Type",
                  wrapHeaderText: true,
                  minWidth: "180",
                  maxWidth: "210",
                },
                {
                  field: "instrument_name",
                  headerName: "Product Name",
                  wrapHeaderText: true,
                  minWidth: "180",
                  maxWidth: "210",
                },
                {
                  field: "exchange",
                  headerName: "Exchange",
                  wrapHeaderText: true,
                  minWidth: "180",
                  maxWidth: "210",
                },
              ],
              defaultColDef: {
                flex: 1,
                filter: true,
                unSortIcon: true,
                resizable: true,
                menuTabs: ["generalMenuTab", "filterMenuTab"],
              },
              detailRowAutoHeight: true,
              getContextMenuItems: getContextMenuItems,
            },
            getDetailRowData: (params: any) => {
              params.successCallback(params.data.children);
            },
          },
        },
        getDetailRowData: (params: any) => {
          params.successCallback(params.data.children);
        },
      });
    } else {
      setGridOptions({
        columnDefs: [
          {
            field: "symbol_pair",
            headerName: "Symbol Pair",
            wrapHeaderText: true,
            cellRenderer: "agGroupCellRenderer",
          },
          {
            field: "market_value",
            headerName: "Market Value",
            wrapHeaderText: true,
          },
          {
            field: "VAR95",
            headerName: "VAR95",
            wrapHeaderText: true,
          },
          { field: "VAR99", headerName: "VAR99", wrapHeaderText: true },
          { field: "VAR100", headerName: "VAR100", wrapHeaderText: true },
          {
            field: "dollar_delta",
            headerName: "Dollar Delta",
            wrapHeaderText: true,
          },
          {
            field: "dollar_vega",
            headerName: "Dollar Vega",
            wrapHeaderText: true,
          },
          {
            field: "dollar_gamma",
            headerName: "Dollar Gamma",
            wrapHeaderText: true,
          },
          {
            field: "dollar_theta",
            headerName: "Dollar Theta",
            wrapHeaderText: true,
          },
        ],
        masterDetail: true,
      });
      setDetailCellRendererParams({
        detailGridOptions: {
          columnDefs: [
            {
              field: "position_key",
              headerName: "Position Key",
              wrapHeaderText: true,
              minWidth: "180",
              maxWidth: "210",
            },
            {
              field: "market_value",
              headerName: "Market Value",
              wrapHeaderText: true,
              minWidth: "180",
              maxWidth: "210",
            },
            {
              field: "VAR95",
              headerName: "VAR95",
              wrapHeaderText: true,
              minWidth: "180",
              maxWidth: "210",
            },
            {
              field: "VAR99",
              headerName: "VAR99",
              wrapHeaderText: true,
              minWidth: "180",
              maxWidth: "210",
            },
            {
              field: "VAR100",
              headerName: "VAR100",
              wrapHeaderText: true,
              minWidth: "180",
              maxWidth: "210",
            },

            {
              field: "dollar_delta",
              headerName: "Dollar Delta",
              wrapHeaderText: true,
              minWidth: "180",
              maxWidth: "210",
            },
            {
              field: "dollar_vega",
              headerName: "Dollar Vega",
              wrapHeaderText: true,
              minWidth: "180",
              maxWidth: "210",
            },
            {
              field: "dollar_gamma",
              headerName: "Dollar Gamma",
              wrapHeaderText: true,
              minWidth: "180",
              maxWidth: "210",
            },
            {
              field: "dollar_theta",
              headerName: "Dollar Theta",
              wrapHeaderText: true,
              minWidth: "180",
              maxWidth: "210",
            },

            {
              field: "quantity",
              headerName: "Quantity",
              wrapHeaderText: true,
              minWidth: "180",
              maxWidth: "210",
            },
            {
              field: "instrument_type",
              headerName: "Product Type",
              wrapHeaderText: true,
              minWidth: "180",
              maxWidth: "210",
            },
            {
              field: "instrument_name",
              headerName: "Product Name",
              wrapHeaderText: true,
              minWidth: "180",
              maxWidth: "210",
            },
            {
              field: "exchange",
              headerName: "Exchange",
              wrapHeaderText: true,
              minWidth: "180",
              maxWidth: "210",
            },
          ],
          defaultColDef: {
            flex: 1,
            filter: true,
            unSortIcon: true,
            resizable: true,
            menuTabs: ["generalMenuTab", "filterMenuTab"],
          },
          getContextMenuItems: getContextMenuItems,
        },
        getDetailRowData: (params: any) => {
          params.successCallback(params.data.children);
        },
      });
    }
  }, [selectedaggregationtype, data]);

  return (
    <MuiBox className="ag-theme-alpine" style={heightWidth}>
      <AgGridReact
        rowData={rowData}
        columnDefs={gridOptions.columnDefs}
        defaultColDef={defaultColDef}
        detailCellRendererParams={detailCellRendererParams}
        getContextMenuItems={getContextMenuItems}
        suppressDragLeaveHidesColumns
        masterDetail
        detailRowAutoHeight
        pagination
        paginationPageSize={20}
        paginationPageSizeSelector={[10, 15, 20]}
      />
    </MuiBox>
  );
};
export default AgGridDataLatest;
