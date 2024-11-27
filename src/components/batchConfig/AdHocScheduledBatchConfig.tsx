import {
  AccessTime,
  Copyright,
  Download,
  InsertChart,
} from "@mui/icons-material";
import { QueryStatus } from "@reduxjs/toolkit/dist/query";
import {
  ColDef,
  GetContextMenuItemsParams,
  ITooltipParams,
} from "ag-grid-enterprise";
import { AgGridReact } from "ag-grid-react";
import dayjs, { Dayjs } from "dayjs";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import SnackBarUtils, {
  snackbarOption,
} from "src/common/components/SnackBarUtilsConfigurator";
import { MuiBox } from "src/common/components/box/MuiBox";
import { MuiButton } from "src/common/components/button/MuiButtons/MuiButton";
import MuiContainer from "src/common/components/container/MuiContainer";
import MuiDatePicker from "src/common/components/datepicker/MuiDatePicker";
import { MuiTypography } from "src/common/components/typography/MuiTypography/MuiTypography";
import MuiTooltip from "src/common/components/tooltip/MuiTooltip";
import { MuiIconButton } from "src/common/components/button/MuiButtons/MuiIconButton";
import { errorPrefix } from "src/common/constants/testids";
import { getErrorMessageFromError } from "src/common/utilities/globalUtils";
import { useLazyGetAdHocScheduledListDataQuery } from "src/queries/batchListApi";
import { ErrorType } from "src/types/apiErrorTypes";
import {
  batchDataRequestType,
  batchDataResponseType,
} from "src/types/batchDataTypes";
import {
  date7DaysAgo,
  formattedDateTime,
  getYYYYMMDDFormattedDateString,
} from "src/common/utilities/formatUtils/dateUtils";
import { validateStartEndDatePeriod } from "src/common/utilities/ValidationUtils/ValidationUtils";
import { useLazyGetrunHistoryDataQuery } from "src/queries/runHistoryApi";
import {
  RunHistoryRequestType,
  RunHistoryResponseType,
} from "src/types/runHistoryType";
import ErrorTooltip from "./ErrorTooltip";
import RunHistoryDetailsPopup from "./RunHistoryDetailsPopup";

export interface BatchConfigProps {
  currentTabIndex: number;
}

export interface IRunHistoryData {
  audit_batch_id: number;
}

const AddhocBatchConfig = (batchConfigProps: BatchConfigProps) => {
  const { currentTabIndex } = batchConfigProps;
  const [batchData, setBatchData] = useState<batchDataResponseType[]>([]);
  const [selectedStartDate, setSelectedStartDate] = useState<Dayjs | null>(
    dayjs(date7DaysAgo())
  );
  const [selectedEndDate, setSelectedEndDate] = useState<Dayjs | null>(
    dayjs(new Date())
  );
  const [isDateValid, setIsDateValid] = useState(true);
  const [showDetailPopup, setShowDetailPopup] = useState(false);

  const [runHistoryData, setRunHistoryData] = useState<
    RunHistoryResponseType[]
  >([]);
  const AdHocTableRef = useRef<AgGridReact<batchDataResponseType> | null>(null);

  const handleStartDateChange = (date: dayjs.Dayjs | null) => {
    setSelectedStartDate(date);
    setIsDateValid(validateStartEndDatePeriod(date, selectedEndDate, true));
  };

  const handleEndDateChange = (date: dayjs.Dayjs | null) => {
    setSelectedEndDate(date);
    setIsDateValid(validateStartEndDatePeriod(selectedStartDate, date, true));
  };

  const handleModalClose = () => {
    setShowDetailPopup(false);
  };

  const handleModalOpen = () => {
    setShowDetailPopup(true);
  };

  const [adHocBatchListTrigger] = useLazyGetAdHocScheduledListDataQuery();
  const getAdHocScheduledBatchesData = (data: batchDataRequestType) => {
    adHocBatchListTrigger(data)
      .then((resp) => {
        const respData: {
          status: QueryStatus;
          data: batchDataResponseType[] | undefined;
          error: string;
        } = {
          status: resp.status,
          data: resp.data as unknown as batchDataResponseType[],
          error: getErrorMessageFromError(resp.error as ErrorType),
        };
        return respData;
      })
      .then((d) => {
        if (d.status === "fulfilled") {
          if (d.data && d.data.length > 0) {
            setBatchData(d.data);
          } else {
            setBatchData([]);
            SnackBarUtils.warning("No data Available ", snackbarOption);
          }
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
  const [runHistoryDetailsDataTrigger] = useLazyGetrunHistoryDataQuery();
  const getRunHistoryData = (auditBatchId: number) => {
    const runHisotryRequestParams: RunHistoryRequestType = {
      audit_batch_id: auditBatchId,
    };
    runHistoryDetailsDataTrigger(runHisotryRequestParams)
      .then((resp) => {
        const respData: {
          status: QueryStatus;
          data: RunHistoryResponseType[] | undefined;
          error: string;
        } = {
          status: resp.status,
          data: resp.data as RunHistoryResponseType[],
          error: getErrorMessageFromError(resp.error as ErrorType),
        };
        return respData;
      })
      .then((d) => {
        if (d.status === "fulfilled") {
          if (d.data) {
            setRunHistoryData(d.data);
            handleModalOpen();
          } else {
            setRunHistoryData([]);
            SnackBarUtils.warning("No data Available ", snackbarOption);
          }
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

  const flagCellRenderer = (params: {
    data: { vbt_flag: boolean; schedule_flag: boolean; is_critical: boolean };
  }) => {
    return (
      <div>
        {params.data.vbt_flag ? <InsertChart /> : null}
        {params.data.schedule_flag ? <AccessTime /> : null}
        {params.data.is_critical ? <Copyright /> : null}
      </div>
    );
  };

  const toolTipValueGetter = (params: ITooltipParams) => {
    return params.value as ITooltipParams;
  };

  const gridOptions = {
    columnDefs: [
      {
        field: "vbt_flag",
        headerName: "Flag",
        minWidth: 30,
        maxWidth: 110,
        wrapHeaderText: true,
        cellRenderer: flagCellRenderer,
      },

      {
        field: "batch_name",
        headerName: "Batch Name",
        minWidth: 200,
        wrapHeaderText: true,
      },
      {
        field: "run_date",
        headerName: "Run Date",
        minWidth: 110,
        wrapHeaderText: true,
      },
      {
        field: "run_time",
        headerName: "Run Time[UTC]",
        minWidth: 200,
        type: "numericColumn",
        wrapHeaderText: true,
      },
      {
        field: "task_started_timestamp",
        headerName: "Start Time[UTC]",
        minWidth: 200,
        type: "numericColumn",
        wrapHeaderText: true,
      },

      {
        field: "task_ended_timestamp",
        headerName: "End Time [UTC]",
        minWidth: 210,
        type: "numericColumn",
        wrapHeaderText: true,
      },
      {
        field: "task_status",
        headerName: "Service Status",
        minWidth: 170,
        wrapHeaderText: true,
      },
      {
        field: "success_failure_status",
        headerName: "Batch Status",
        minWidth: 160,
        wrapHeaderText: true,
      },
      {
        field: "error_message",
        headerName: "Error",
        minWidth: 110,
        wrapHeaderText: true,
        tooltipValueGetter: toolTipValueGetter,
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

  const onBtnExport = useCallback(() => {
    const excelParams = {
      fileName: `${
        currentTabIndex === 1 ? "AdHocBatchesData" : "ScheduledBatchesData"
      }_${formattedDateTime()}.csv`,
    };
    AdHocTableRef?.current?.api?.exportDataAsCsv(excelParams);
  }, [AdHocTableRef, currentTabIndex]);

  const getContextMenuItems = useCallback(
    (params: GetContextMenuItemsParams<IRunHistoryData>) => {
      return [
        {
          name: "Run History",
          action: () => {
            const auditBatchId: number | undefined =
              params?.node?.data?.audit_batch_id;
            if (auditBatchId) getRunHistoryData(auditBatchId);
            else getRunHistoryData(0 as number);
          },
        },
      ];
    },
    [] // eslint-disable-line
  );

  const handleApply = () => {
    const data: batchDataRequestType = {
      task_type: currentTabIndex === 1 ? "adhoc" : "scheduled",
      start_date: getYYYYMMDDFormattedDateString(selectedStartDate as Dayjs),
      end_date: getYYYYMMDDFormattedDateString(selectedEndDate as Dayjs),
    };
    getAdHocScheduledBatchesData(data);
  };
  useEffect(() => {
    handleApply();
  }, []); // eslint-disable-line

  return (
    <div>
      <MuiBox className="tw-inline-block tw-float-right tw-my-">
        <MuiBox className="tw-flex tw-float-right tw-mr-1">
          <MuiBox className="tw-flex tw-pr-2">
            <MuiTypography className="tw-text-sm tw-pt-1 tw-mr-1 ">
              Start Date :
            </MuiTypography>
            <MuiDatePicker
              onChange={handleStartDateChange}
              value={selectedStartDate}
            />
          </MuiBox>
          <MuiBox className="tw-flex tw-pr-2">
            <MuiTypography className="tw-text-sm tw-pt-1 tw-mr-1">
              End Date :
            </MuiTypography>
            <MuiDatePicker
              onChange={handleEndDateChange}
              value={selectedEndDate}
              disableFuture
            />
          </MuiBox>
          <MuiBox>
            <MuiButton
              onClick={handleApply}
              disabled={!isDateValid}
              className="tw-bg-slate-100 tw-h-8"
            >
              Apply
            </MuiButton>
            <MuiTooltip title="Download">
              <MuiIconButton size="small" onClick={onBtnExport}>
                <Download />
              </MuiIconButton>
            </MuiTooltip>
          </MuiBox>
        </MuiBox>
        <MuiBox>
          {!isDateValid && (
            <p className="tw-text-red-700 tw-text-sm">
              Start Date and End Date are required and Start Date must be less
              than End Date.
            </p>
          )}
        </MuiBox>
      </MuiBox>

      <MuiContainer
        className="tw-w-fit tw-min-w-full tw-p-0 tw-m-0 "
        style={{ maxHeight: "1050px" }}
      >
        <div className="fx-conduit-container tw-w-full tw-h-full tw-flow-root ag-theme-alpine tw-mt-1">
          <AgGridReact
            ref={AdHocTableRef}
            rowData={batchData}
            columnDefs={gridOptions.columnDefs}
            defaultColDef={defaultColDef}
            getContextMenuItems={getContextMenuItems}
            pagination
            paginationPageSize={15}
            paginationPageSizeSelector={[5, 15, 20]}
            suppressDragLeaveHidesColumns
            suppressCellFocus
            tooltipInteraction
            domLayout="autoHeight"
            tooltipShowDelay={0}
          />
        </div>
        {showDetailPopup && (
          <RunHistoryDetailsPopup
            runHistoryData={runHistoryData}
            handleModal={handleModalClose}
            isModalOpen={showDetailPopup}
          />
        )}
      </MuiContainer>
    </div>
  );
};

export default AddhocBatchConfig;
