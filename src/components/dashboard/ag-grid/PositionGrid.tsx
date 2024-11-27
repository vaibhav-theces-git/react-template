import { Download, Fullscreen, FullscreenExit } from "@mui/icons-material";
import { SelectChangeEvent } from "@mui/material";
import { useEffect, useState } from "react";
import { MuiBox } from "src/common/components/box/MuiBox";
import { MuiButtonGroup } from "src/common/components/button/MuiButtons/MuiButtonGroup";
import { MuiIconButton } from "src/common/components/button/MuiButtons/MuiIconButton";
import { MuiMenuItem } from "src/common/components/menu/MuiMenu";
import MuiSelect from "src/common/components/select/MuiSelect";
import { MuiTypography } from "src/common/components/typography/MuiTypography/MuiTypography";
import { AggregationResponseType } from "src/types/aggregationType";
import { PositionSummaryResponseType } from "src/types/positionSummaryData";
import { errorPrefix, noDataMessage } from "src/common/constants/testids";
import { useLazyGetPnlDataQuery } from "src/queries/pnlDataApi";
import { QueryStatus } from "@reduxjs/toolkit/dist/query";
import { getErrorMessageFromError } from "src/common/utilities/globalUtils";
import { formattedDateTime } from "src/common/utilities/formatUtils/dateUtils";
import SnackBarUtils, {
  snackbarOption,
} from "src/common/components/SnackBarUtilsConfigurator";
import { ErrorType } from "src/types/apiErrorTypes";
import { HistogramResponseType, PnlResponseType } from "src/types/pnlTypes";
import { positionSummaryDownloadRequestTye } from "src/types/positionSummaryDownloadType";
import { useLazyPositionGridDownloadQuery } from "src/queries/PositionGridDownloadApi";
import AgGridRowDetailPopup from "./AgGridRowDetailPopup";
import AgDataGrid from "./AgDataGrid";

export interface PositionGridProps {
  positiongriddata: PositionSummaryResponseType[];
  aggregationtypelist: AggregationResponseType[];
  selectedaggregationtype: string;
  togglecallback: (val: boolean) => void;
  aggregationtypechangecallback: (val: string) => void;
  runId: number;
  aggId: number | undefined;
  busDate: string;
}

const PositionGrid = (positionGridProps: PositionGridProps) => {
  const {
    positiongriddata,
    aggregationtypelist,
    selectedaggregationtype,
    aggregationtypechangecallback,
    togglecallback,
    runId,
    aggId,
    busDate,
  } = positionGridProps;
  const [PnlDataTrigger] = useLazyGetPnlDataQuery();
  const [positionGridDownloadTrigger] = useLazyPositionGridDownloadQuery();
  const [blockZoomed, setBlockZoomed] = useState(false);
  const [showDetailPopup, setShowDetailPopup] = useState(false);
  const [pnlData, setPnlData] = useState<PnlResponseType[]>([]);
  const [histogramData, setHistogramData] = useState<HistogramResponseType[]>(
    []
  );
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

  const handleModalClose = () => {
    setShowDetailPopup(false);
  };

  const hanleModalOpen = () => {
    setShowDetailPopup(true);
  };

  /* eslint-disable */
  const getPnlVectorData = (pnlId: any) => {
    const pnlVectorParams: any = {
      run_id: runId,
      id: JSON.stringify(pnlId),
    };
    PnlDataTrigger(pnlVectorParams)
      .then((resp) => {
        const respData: {
          status: QueryStatus;
          data: any | undefined;
          error: string;
        } = {
          status: resp.status,
          data: resp.data,
          error: getErrorMessageFromError(resp.error as ErrorType),
        };
        return respData;
      })
      .then((d) => {
        if (d.status === "fulfilled") {
          setHistogramData(d.data?.histogram as HistogramResponseType[]);
          setPnlData(d.data?.total_pnl as PnlResponseType[]);
          hanleModalOpen();
        } else {
          SnackBarUtils.warning("No PnL Data available", snackbarOption);
        }
      })
      .catch((e) => {
        const errorMsg = `${errorPrefix} Technical Error :`.concat(e);
        SnackBarUtils.error(errorMsg, snackbarOption);
      });
  };
  /* eslint-disable */
  const downloadPositiongrid = (
    busDate: string,
    runId: number,
    aggId: number
  ) => {
    const positiongridDownloadParams: positionSummaryDownloadRequestTye = {
      bus_date: busDate,
      run_id: runId,
      agg_id: aggId,
    };
    positionGridDownloadTrigger(positiongridDownloadParams)
      .then((resp) => {
        if (resp.status === "fulfilled") {
          const blb = new Blob([resp.data], { type: "plain/text" });
          const fileurl = window.URL.createObjectURL(blb);
          let link = document.createElement("a");
          link.href = fileurl;
          link.download =
            "Position_Summary_" +
            `${busDate}_` +
            `${runId}_` +
            `${aggId}_${formattedDateTime()}.csv`;
          link.click();
        } else {
          SnackBarUtils.warning("No Postion Data available", snackbarOption);
        }
      })

      .catch((e) => {
        const errorMsg = `${errorPrefix} Technical Error :`.concat(e);
        SnackBarUtils.error(errorMsg, snackbarOption);
      });
  };

  return (
    <MuiBox className="fx-conduit-container tw-w-full tw-h-full">
      <MuiBox className="fx-conduit-header tw-h-7 tw-pl-1 tw-pr-1 tw-bg-slate-500 tw-align-middle tw-justify-between tw-flex">
        <MuiBox className="fx-conduit-title tw-flex tw-items-center">
          <MuiTypography className="tw-text-sm tw-mr-5 tw-font-bold">
            Position Summary
          </MuiTypography>
        </MuiBox>
        <MuiBox className="fx-conduit-buttons tw-flex tw-items-center">
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
            <MuiIconButton
              size="small"
              onClick={() =>
                downloadPositiongrid(busDate, runId, aggId as number)
              }
            >
              <Download />
            </MuiIconButton>
            <MuiIconButton size="small" onClick={handleToggle}>
              {blockZoomed && <FullscreenExit fontSize="small" />}
              {!blockZoomed && <Fullscreen fontSize="small" />}
            </MuiIconButton>
          </MuiButtonGroup>
        </MuiBox>
      </MuiBox>
      {positiongriddata && positiongriddata.length > 0 ? (
        <AgDataGrid
          data={positiongriddata}
          getPnlVectorData={getPnlVectorData}
          aggregation={aggregationtypelist}
          selectedaggregationtype={selectedaggregationtype}
          blockzoomed={blockZoomed}
        />
      ) : (
        <MuiTypography className="tw-text-center tw-text-sm tw-m-6 tw-text-white">
          {noDataMessage}
        </MuiTypography>
      )}
      <MuiBox>
        {showDetailPopup && (
          <AgGridRowDetailPopup
            isModalOpen={showDetailPopup}
            handleModal={handleModalClose}
            pnlVectorData={pnlData}
            histogramData={histogramData}
          />
        )}
      </MuiBox>
    </MuiBox>
  );
};

export default PositionGrid;