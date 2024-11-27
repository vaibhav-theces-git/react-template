import { SelectChangeEvent } from "@mui/material";
import { ColDef, RowClassParams } from "ag-grid-enterprise";
import { AgGridReact } from "ag-grid-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { MuiBox } from "src/common/components/box/MuiBox";
import { MuiButton } from "src/common/components/button/MuiButtons/MuiButton";
import MuiDatePicker from "src/common/components/datepicker/MuiDatePicker";
import { MuiMenuItem } from "src/common/components/menu/MuiMenu";
import MuiSelect from "src/common/components/select/MuiSelect";
import { MuiTypography } from "src/common/components/typography/MuiTypography/MuiTypography";
import dayjs, { Dayjs } from "dayjs";
import {
  OverridePriceRequestType,
  ShowMarketDataResponseType,
} from "src/types/marketDataTypes";
import MuiGrid from "src/common/components/grid/MuiGrid";
import { cloneDeep } from "lodash";
import { noDataMessage } from "src/common/constants/testids";
import { MuiIconButton } from "src/common/components/button/MuiButtons/MuiIconButton";
import { Download } from "@mui/icons-material";
import { formattedDateTime } from "src/common/utilities/formatUtils/dateUtils";
import SnackBarUtils, {
  snackbarOption,
} from "src/common/components/SnackBarUtilsConfigurator";
import { validateMarketData } from "src/common/utilities/ValidationUtils/ValidationUtils";
import { CustomModal } from "src/common/components/modal/MuiModal/CustomModal";
import { columnFilterComparator } from "src/common/utilities/globalUtils";

export interface HistoricalDataProps {
  selectedSymbolCallback: (event: SelectChangeEvent<unknown>) => void;
  symbolPairsData: string[] | undefined;
  selectedSymbol: string | undefined;
  selectedSeriesCallback: (event: SelectChangeEvent<unknown>) => void;
  selectedSeriesValue: string;
  selectedSeries: string[] | undefined;
  startDate: dayjs.Dayjs | null;
  endDate: dayjs.Dayjs | null;
  startDateChangeCallback: (date: Dayjs | null) => void;
  endDateChangeCallback: (date: Dayjs | null) => void;
  showDataButtonCallback: () => void;
  gridMarketData: ShowMarketDataResponseType[] | undefined;
  overridePriceSaveCallback: (
    overRiddenPrice: OverridePriceRequestType[]
  ) => void;
  isDateValid: boolean;
}

const HistoricalData = (historicalDataProps: HistoricalDataProps) => {
  const {
    selectedSymbolCallback,
    symbolPairsData,
    selectedSymbol,
    selectedSeriesCallback,
    selectedSeriesValue,
    selectedSeries,
    startDate,
    endDate,
    startDateChangeCallback,
    endDateChangeCallback,
    showDataButtonCallback,
    gridMarketData,
    overridePriceSaveCallback,
    isDateValid,
  } = historicalDataProps;

  const containerRef = useRef<HTMLDivElement>(null);
  const historicalDataRef = useRef<AgGridReact<
    ShowMarketDataResponseType[]
  > | null>(null);
  const [updatedData, setUpdatedData] = useState<
    ShowMarketDataResponseType[] | undefined
  >([]);
  const [overRiddenPrice, setOverRiddenPrice] = useState<
    OverridePriceRequestType[]
  >([]);

  const frameworkComponents = {
    muiDatePickerEditor: MuiDatePicker,
  };

  const handleCellValueChanged = (params: {
    data: OverridePriceRequestType;
  }) => {
    const { data } = params;
    const updatedOverRiddenPrice = [...overRiddenPrice];
    const existingDataIndex = updatedOverRiddenPrice.findIndex(
      (row) => row.date === data.date
    );

    if (existingDataIndex === -1) {
      updatedOverRiddenPrice.push(data);
    } else {
      updatedOverRiddenPrice[existingDataIndex] = data;
    }
    setOverRiddenPrice(updatedOverRiddenPrice);
  };

  const gridOptions = {
    historicalDataColumnDefs: [
      {
        field: "date",
        headerName: "Date",
        minWidth: 180,
        maxWidth: 180,
        wrapHeaderText: true,
        type: "numericColumn",
        editable: (params: { data: ShowMarketDataResponseType }) => {
          return params.data.flag !== "old";
        },
      },
      {
        field: "price",
        headerName: "Price",
        minWidth: 180,
        maxWidth: 180,
        type: "numericColumn",
        wrapHeaderText: true,
        filter: "agSetColumnFilter",
        filterParams: {
          comparator: columnFilterComparator,
        },
      },
      {
        field: "maturity_date",
        headerName: "Maturity Date",
        minWidth: 180,
        maxWidth: 180,
        type: "numericColumn",
        wrapHeaderText: true,
        hide: selectedSeriesValue !== "FUTURE",
        editable: (params: { data: ShowMarketDataResponseType }) => {
          return params.data.flag !== "old";
        },
      },
      {
        field: "override_price",
        headerName: "Override Price",
        minWidth: 180,
        maxWidth: 180,
        editable: true,
        type: "numericColumn",
        cellEditor: "agNumberCellEditor",
        wrapHeaderText: true,
      },
      {
        field: "dimention_id",
        headerName: "dimention_id",
        hide: true,
      },
      {
        field: "risk_factor_id",
        headerName: "risk_factor_id",
        hide: true,
      },
    ],
    rowClassRules: {
      new_records_highlight: (params: RowClassParams) => {
        const newDates = params.data as ShowMarketDataResponseType;
        return !gridMarketData?.some(
          (existingDate) => existingDate.date === newDates.date
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
      unSortIcon: true,
    };
  }, []);

  const onPriceSave = () => {
    const isaDateValid = validateMarketData(
      overRiddenPrice as ShowMarketDataResponseType[],
      updatedData
    );
    if (isaDateValid.result) {
      const dt = overRiddenPrice as unknown as ShowMarketDataResponseType[];
      const nData = dt.map((item) => {
        const { flag, ...rest } = item;
        return rest;
      });
      overridePriceSaveCallback(nData);
      setUpdatedData((prevData) => {
        const newData = cloneDeep(prevData);
        return newData;
      });
      const gridApi = historicalDataRef.current?.api;
      if (gridApi) {
        gridApi.refreshCells();
      }
      setOverRiddenPrice([]);
    } else {
      SnackBarUtils.error(`${isaDateValid.msg}`, snackbarOption);
    }
  };

  const handleOverridePriceCancel = () => {
    setUpdatedData(cloneDeep(gridMarketData));
    setOverRiddenPrice([]);
    const gridApi = historicalDataRef.current?.api;
    if (gridApi) {
      gridApi.refreshCells();
    }
  };

  const historicalDataDownload = useCallback(() => {
    const excelParams = {
      fileName:
        selectedSymbol !== undefined && selectedSeriesValue !== undefined
          ? `${selectedSymbol}_${selectedSeriesValue}_${formattedDateTime()}.csv`
          : "",
    };
    historicalDataRef?.current?.api?.exportDataAsCsv(excelParams);
  }, [selectedSymbol, selectedSeriesValue, historicalDataRef]);

  const addNewRow = () => {
    const gridApi = historicalDataRef.current?.api;
    const selectedRowIndex = gridApi?.getSelectedNodes()[0];
    const currentPage = gridApi?.paginationGetCurrentPage();
    const pageSize = gridApi?.paginationGetPageSize();
    const firstRowOnPage = currentPage! * pageSize!;
    const { rowIndex: selectedRowIndexValue } = selectedRowIndex ?? {};
    const rowIndex: number | null = selectedRowIndexValue ?? null;
    const newRowData: ShowMarketDataResponseType[] = [
      {
        date: "",
        dimension_id: gridMarketData![0].dimension_id,
        maturity_date: "",
        override_price: 0,
        price: 0,
        risk_factor_id: gridMarketData![0].risk_factor_id,
        flag: "new",
      },
    ];

    const dt = Object.assign(newRowData);
    if (rowIndex !== null && rowIndex > 0) {
      gridApi?.applyTransaction({
        add: dt,
        addIndex: rowIndex !== null ? rowIndex + 1 : 0,
      });
    } else {
      gridApi?.applyTransaction({
        add: dt,
        addIndex: firstRowOnPage,
      });
    }
  };

  useEffect(() => {
    setUpdatedData(cloneDeep(gridMarketData));
  }, [gridMarketData]);

  const [showOPWarningAlert, setShowOPWarningAlert] = useState<boolean>(false);
  const handleClickOutside = useCallback(
    (event: MouseEvent) => {
      const ev = event.target as HTMLElement;
      if (
        overRiddenPrice.length > 0 &&
        containerRef.current &&
        !containerRef.current.contains(event.target as Node) &&
        !ev.classList.contains("MuiPickersDay-root")
      ) {
        event.preventDefault();
        event.stopImmediatePropagation();
        event.stopPropagation();
        setShowOPWarningAlert(true);
      }
    },
    [overRiddenPrice]
  );

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside, true);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside, true);
    };
  }, [handleClickOutside]);

  const OPwarningAlertClose = () => {
    setShowOPWarningAlert(false);
  };

  return (
    <div ref={containerRef} className="tw-w-full tw-h-full">
      <MuiBox className="tw-h-auto tw-max-h-full">
        <MuiGrid
          container
          item
          className=" tw-flex tw-justify-between md:tw-grid-cols-2 sm:tw-grid-cols-2 lg:tw-grid-cols-2 tw-grow"
        >
          <MuiGrid
            item
            className="tw-inline-flex  tw-m-1 tw-mt-2.5 md:tw-grid-cols-2 sm:tw-grid-cols-2 lg:tw-grid-cols-2 md:tw-justify-start lg:tw-justify-start sm:tw-justify-start"
            alignItems="center"
          >
            <MuiBox className="tw-flex tw-m-1">
              <MuiTypography className="tw-text-xs tw-mr-1 tw-w-12 tw-mt-1">
                Symbol :
              </MuiTypography>
              <MuiSelect
                data-testid="marketDataSymbolSelect"
                id="SelectedSymbolPair"
                name="symbolpair"
                value={selectedSymbol}
                defaultValue={selectedSymbol}
                onChange={selectedSymbolCallback}
                className="tw-w-36 tw-text-xs tw-py-3 tw-px-0 tw-text-left"
                MenuProps={{
                  PaperProps: {
                    style: {
                      width: "144px",
                      height: "200px",
                    },
                  },
                }}
              >
                {symbolPairsData &&
                  symbolPairsData.map((pair) => (
                    <MuiMenuItem
                      key={pair}
                      value={pair}
                      className="tw-text-xs tw-w-32"
                    >
                      {pair}
                    </MuiMenuItem>
                  ))}
              </MuiSelect>
            </MuiBox>
            <MuiBox className="tw-flex tw-m-1">
              <MuiTypography
                className="tw-text-xs tw-mr-1 tw-mt-1"
                sx={{ width: "70px" }}
              >
                Data Series :
              </MuiTypography>
              <MuiSelect
                data-testid="marketDataSeriesSelect"
                id="SelectedSymbolPair"
                name="symbolpair"
                value={selectedSeriesValue}
                defaultValue={selectedSeriesValue}
                onChange={selectedSeriesCallback}
                className="tw-w-36 tw-text-xs tw-py-3 tw-px-0 tw-text-left"
                MenuProps={{
                  PaperProps: {
                    style: {
                      width: "144px",
                      height: "auto",
                    },
                  },
                }}
              >
                {selectedSeries &&
                  selectedSeries.map((series: any) => (
                    <MuiMenuItem
                      key={series}
                      value={series}
                      className="tw-text-xs"
                    >
                      {series}
                    </MuiMenuItem>
                  ))}
              </MuiSelect>
            </MuiBox>
            <MuiBox className="tw-flex tw-ml-7 tw-m-1">
              <MuiBox className="tw-flex" alignItems="center">
                <MuiTypography className="tw-text-xs  tw-w-16 tw-mr-1">
                  Start Date :
                </MuiTypography>
                <MuiDatePicker
                  onChange={startDateChangeCallback}
                  value={startDate}
                  minDate={dayjs(startDate)}
                  maxDate={dayjs(endDate)}
                  slotProps={{
                    textField: { helperText: "Please fill this field" },
                  }}
                />
              </MuiBox>
              <MuiBox className="tw-flex" alignItems="center">
                <MuiTypography className="tw-text-xs tw-w-16 tw-ml-5 tw-mr-1">
                  End Date :
                </MuiTypography>
                <MuiDatePicker
                  onChange={endDateChangeCallback}
                  value={endDate}
                  minDate={dayjs(startDate)}
                  maxDate={dayjs(endDate)}
                />
              </MuiBox>

              <MuiButton
                className="tw-bg-slate-75 tw-ml-3 tw-w-24 tw-text-xs"
                onClick={showDataButtonCallback}
                disabled={
                  selectedSymbol === "" ||
                  selectedSeriesValue === "" ||
                  startDate == null ||
                  endDate === null
                }
              >
                Show Data
              </MuiButton>
            </MuiBox>
          </MuiGrid>
          <MuiGrid
            item
            className="tw-flex tw-m-1 md:tw-grid-cols-2 sm:tw-grid-cols-2 lg:tw-grid-cols-2 md:tw-justify-end lg:tw-justify-end sm:tw-justify-end"
            alignItems="center"
          >
            <MuiButton
              className="tw-bg-slate-75 tw-text-xs"
              onClick={onPriceSave}
              disabled={overRiddenPrice.length === 0}
            >
              Save
            </MuiButton>
            <MuiButton
              className="tw-bg-slate-75 tw-ml-3 tw-text-xs"
              onClick={handleOverridePriceCancel}
              disabled={overRiddenPrice.length === 0}
            >
              Cancel
            </MuiButton>
            <MuiButton
              className="tw-bg-slate-75 tw-ml-3 tw-text-xs"
              onClick={addNewRow}
              disabled={updatedData === undefined || updatedData?.length === 0}
            >
              Add New Row
            </MuiButton>
            <MuiIconButton
              className="tw-text-xs tw-ml-0.5"
              disabled={updatedData === undefined}
              onClick={historicalDataDownload}
            >
              <Download className="tw-text-2xl" />
            </MuiIconButton>
          </MuiGrid>
        </MuiGrid>
        {!isDateValid && (
          <MuiBox className={"tw-flex  tw-ml-96 "}>
            <MuiTypography className="tw-text-red-700 tw-text-sm ">
              Start Date and End Date are required and Start Date must be less
              than End Date.
            </MuiTypography>
          </MuiBox>
        )}
        <div className="fx-conduit-container tw-w-full tw-h-full tw-flow-root ag-theme-alpine tw-mt-1">
          {updatedData && updatedData.length > 0 ? (
            <AgGridReact
              ref={historicalDataRef}
              rowData={updatedData}
              columnDefs={gridOptions.historicalDataColumnDefs}
              defaultColDef={defaultColDef}
              editType={"fullRow"}
              components={frameworkComponents}
              onCellValueChanged={handleCellValueChanged}
              rowClassRules={gridOptions.rowClassRules}
              pagination
              singleClickEdit
              suppressDragLeaveHidesColumns
              stopEditingWhenCellsLoseFocus
              suppressCellFocus
              paginationPageSize={15}
              paginationPageSizeSelector={[5, 15, 20]}
              domLayout="autoHeight"
              rowSelection="single"
            />
          ) : (
            <div className=" tw-flex tw-items-center tw-justify-center">
              <div className="tw-max-w-sm tw-p-4">
                <div className="tw-text-xs tw-text-center">
                  <span>{noDataMessage}</span>
                </div>
              </div>
            </div>
          )}
        </div>
        {showOPWarningAlert && (
          <CustomModal
            isOpen={showOPWarningAlert}
            title="Unsaved Data"
            showCloseIcon
            handleClose={OPwarningAlertClose}
          >
            You have unsaved data. Please save or cancel before leaving the
            page!
          </CustomModal>
        )}
      </MuiBox>
    </div>
  );
};

export default HistoricalData;
