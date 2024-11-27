import dayjs, { Dayjs } from "dayjs";
import { useCallback, useEffect, useState } from "react";
import { MuiBox } from "src/common/components/box/MuiBox";
import MuiContainer from "src/common/components/container/MuiContainer";
import {
  MuiTab,
  MuiTabContext,
  MuiTabPanel,
  MuiTabs,
} from "src/common/components/tab";
import { ColDef } from "ag-grid-enterprise";
import { QueryStatus } from "@reduxjs/toolkit/dist/query";
import RiskHubToolbar, {
  Portfolio,
} from "src/common/components/toolbar/riskhub-toolbar";
import SnackBarUtils, {
  snackbarOption,
} from "src/common/components/SnackBarUtilsConfigurator";
import {
  useLazyGetSpotVolAnalysisV1Query,
  useLazyGetSpotVolAnalysisV2Query,
} from "src/queries/spotVolAnalysisApi";
import { useLazyGetCurrentBusinessDateQuery } from "src/queries/currentBusinessDateApi";
import { useLazyGetSpotVolPortfoliosQuery } from "src/queries/spotVolPortfolioApi";
import { useLazyGetSpotVolShiftTypesQuery } from "src/queries/spotVolShiftTypesApi";
import {
  spotVolAnalysisV1Request,
  spotVolAnalysisV2Request,
  spotVolPortfolioRequest,
  spotVolPortfolioResponse,
  spotVolResponse,
  spotVolResponseData,
  spotVolShiftTypesRequest,
} from "src/types/spotVolAnalysisTypes";
import { getYYYYMMDDFormattedDateString } from "src/common/utilities/formatUtils/dateUtils";
import { CurrentBusinessDateType } from "src/types/currentBusinessDate";
import { ErrorType } from "src/types/apiErrorTypes";
import { errorPrefix } from "src/common/constants/testids";
import { getErrorMessageFromError } from "src/common/utilities/globalUtils";
import {
  getSpotVolGridColDef,
  getSpotVolGridTransformedData,
} from "./spotVolAnalysisUtil";
import SpotVolAnalysisV1Grid from "./SpotVolAnalysisV1Grid";
import {
  SpotVolDisplayTypes,
  SpotVolMetricTypes,
  SpotVolViewTypes,
} from "./spotVolAnalysisContants";
import SpotVolAnalysisV2Grid from "./SpotVolAnalysisV2Grid";

const SpotVolAnalysis = () => {
  const [selectedDate, setSelectedDate] = useState<Dayjs>(dayjs(new Date()));
  const [batchList, setBatchList] = useState<Portfolio[]>([]);
  const [selectedBatch, setSelectedBatch] = useState<string>("");
  const [selectedBatchRunId, setSelectedBatchRunId] = useState<number>(0);
  const [tabValue, setTabValue] = useState(1);
  const [showapplybutton] = useState(false);
  const [spotVolV1Grid1Metric, setSpotVolV1Grid1Metric] = useState<string>(
    SpotVolMetricTypes.MarketValue.toString()
  );
  const [spotVolV1Grid1DisplayType, setSpotVolV1Grid1DisplayType] =
    useState<string>(SpotVolDisplayTypes.Actual.toString());
  const [spotVolV1Grid1Cols, setSpotVolV1Grid1Cols] = useState<ColDef[]>([]);
  const [spotVolV1Grid1Data, setSpotVolV1Grid1Data] = useState<
    spotVolResponseData[]
  >([]);
  const [spotVolV1Grid2Metric, setSpotVolV1Grid2Metric] = useState<string>(
    SpotVolMetricTypes.MarketValue.toString()
  );
  const [spotVolV1Grid2DisplayType, setSpotVolV1Grid2DisplayType] =
    useState<string>(SpotVolDisplayTypes.Change.toString());
  const [spotVolV1Grid2Cols, setSpotVolV1Grid2Cols] = useState<ColDef[]>([]);
  const [spotVolV1Grid2Data, setSpotVolV1Grid2Data] = useState<
    spotVolResponseData[]
  >([]);

  const [spotVolV2Grid1ShiftTypes, setSpotVolV2Grid1ShiftTypes] = useState<
    string[]
  >([]);
  const [spotVolV2Grid2ShiftTypes, setSpotVolV2Grid2ShiftTypes] = useState<
    string[]
  >([]);
  const [spotVolV2Grid1Cols, setSpotVolV2Grid1Cols] = useState<ColDef[]>([]);
  const [spotVolV2Grid2Cols, setSpotVolV2Grid2Cols] = useState<ColDef[]>([]);
  const [spotVolV2Grid1DisplayType, setSpotVolV2Grid1DisplayType] =
    useState<string>(SpotVolDisplayTypes.Actual.toString());
  const [spotVolV2Grid2DisplayType, setSpotVolV2Grid2DisplayType] =
    useState<string>(SpotVolDisplayTypes.Actual.toString());
  const [spotVolV2Grid1ShiftValue, setSpotVolV2Grid1ShiftValue] =
    useState<string>("0");
  const [spotVolV2Grid2ShiftValue, setSpotVolV2Grid2ShiftValue] =
    useState<string>("0");
  const [spotVolV2Grid1Data, setSpotVolV2Grid1Data] = useState<
    spotVolResponseData[]
  >([]);
  const [spotVolV2Grid2Data, setSpotVolV2Grid2Data] = useState<
    spotVolResponseData[]
  >([]);

  const [porfolioDataTrigger] = useLazyGetSpotVolPortfoliosQuery();
  const [businessDateTrigger] = useLazyGetCurrentBusinessDateQuery();
  const [spotVolV1Trigger] = useLazyGetSpotVolAnalysisV1Query();
  const [spotVolShiftTrigger] = useLazyGetSpotVolShiftTypesQuery();
  const [spotVolV2Trigger] = useLazyGetSpotVolAnalysisV2Query();

  const handleSelectedDateChange = (date: Dayjs) => {
    setSelectedDate(date);
    setSpotVolV1Grid1Metric(SpotVolMetricTypes.MarketValue.toString());
    setSpotVolV1Grid1DisplayType(SpotVolDisplayTypes.Actual.toString());
    setSpotVolV1Grid2Metric(SpotVolMetricTypes.MarketValue.toString());
    setSpotVolV1Grid2DisplayType(SpotVolDisplayTypes.Change.toString());
    setSpotVolV2Grid1DisplayType(SpotVolDisplayTypes.Actual.toString());
    setSpotVolV2Grid2DisplayType(SpotVolDisplayTypes.Change.toString());
  };

  const handleSelectedBatchChange = (batch: string) => {
    setSelectedBatch(batch);
    setSelectedBatchRunId(
      batchList.find((p) => p.portfolioName === batch)?.runId as number
    );
    setSpotVolV1Grid1Metric(SpotVolMetricTypes.MarketValue.toString());
    setSpotVolV1Grid1DisplayType(SpotVolDisplayTypes.Actual.toString());
    setSpotVolV1Grid2Metric(SpotVolMetricTypes.MarketValue.toString());
    setSpotVolV1Grid2DisplayType(SpotVolDisplayTypes.Change.toString());
    setSpotVolV2Grid1DisplayType(SpotVolDisplayTypes.Actual.toString());
    setSpotVolV2Grid2DisplayType(SpotVolDisplayTypes.Change.toString());
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleSpotVolV1Grid1MetricChange = (metric: string) => {
    setSpotVolV1Grid1Metric(metric);
  };

  const handleSpotVolV1Grid1DisplayTypeChange = (display: string) => {
    setSpotVolV1Grid1DisplayType(display);
  };

  const handleSpotVolV1Grid2MetricChange = (metric: string) => {
    setSpotVolV1Grid2Metric(metric);
  };

  const handleSpotVolV1Grid2DisplayTypeChange = (display: string) => {
    setSpotVolV1Grid2DisplayType(display);
  };

  const handleSpotVolV2Grid1DisplayTypeChange = (display: string) => {
    setSpotVolV2Grid1DisplayType(display);
  };

  const handleSpotVolV2Grid2DisplayTypeChange = (display: string) => {
    setSpotVolV2Grid2DisplayType(display);
  };

  const handleSpotVolV2Grid1ShiftValueChange = (value: string) => {
    setSpotVolV2Grid1ShiftValue(value);
  };

  const handleSpotVolV2Grid2ShiftValueChange = (value: string) => {
    setSpotVolV2Grid2ShiftValue(value);
  };

  const getPortfolioList = useCallback(
    (date: string) => {
      const portfolioParams: spotVolPortfolioRequest = {
        run_date: date,
      };
      porfolioDataTrigger(portfolioParams)
        .then((resp) => {
          const respData: {
            status: QueryStatus;
            data: spotVolPortfolioResponse[] | undefined;
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
            if (d.data?.length === 0) {
              setBatchList([]);
              setSelectedBatchRunId(0);
              setSelectedBatch("");
              setSpotVolV1Grid1Data([]);
              setSpotVolV1Grid2Data([]);
              setSpotVolV2Grid1Data([]);
              setSpotVolV2Grid2Data([]);
            } else {
              const portfolios = d.data?.map((p: spotVolPortfolioResponse) => {
                return {
                  runId: p?.run_id,
                  portfolioName: p?.portfolio_name,
                };
              }) as Portfolio[];
              setBatchList(portfolios);
              setSelectedBatchRunId(portfolios[0]?.runId);
              setSelectedBatch(portfolios[0]?.portfolioName);
            }
          } else {
            setBatchList([]);
            setSelectedBatchRunId(0);
            setSelectedBatch("");
            const errorMsg = `${errorPrefix} Technical Error : ${d.error}`;
            SnackBarUtils.error(errorMsg, snackbarOption);
          }
        })
        .catch((e) => {
          const errorMsg = `${errorPrefix} Technical Error :`.concat(e);
          SnackBarUtils.error(errorMsg, snackbarOption);
        });
    },
    [porfolioDataTrigger]
  );

  useEffect(() => {
    getPortfolioList(getYYYYMMDDFormattedDateString(selectedDate));
  }, [selectedDate, getPortfolioList]);

  const getCurrentBusinessDate = useCallback(() => {
    businessDateTrigger()
      .then((resp) => {
        const respData: {
          status: QueryStatus;
          data: CurrentBusinessDateType[] | undefined;
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
          let currentDate = new Date();
          const qbDateStr = d.data ? d.data[0].bus_date : "9999-12-31";
          currentDate = new Date(qbDateStr);
          const defaultBusinessDate = dayjs(
            new Date(
              currentDate.getFullYear(),
              currentDate.getMonth(),
              currentDate.getDate()
            )
          );
          setSelectedDate(defaultBusinessDate);
          getPortfolioList(getYYYYMMDDFormattedDateString(defaultBusinessDate));
        } else {
          const errorMsg = `${errorPrefix} Technical Error : ${d.error}`;
          SnackBarUtils.error(errorMsg, snackbarOption);
        }
      })
      .catch((e) => {
        const errorMsg = `${errorPrefix} Technical Error :`.concat(e);
        SnackBarUtils.error(errorMsg, snackbarOption);
      });
  }, [businessDateTrigger, getPortfolioList]);

  useEffect(() => {
    getCurrentBusinessDate();
  }, [getCurrentBusinessDate]);

  const getSpotVolShiftTypes = useCallback(
    (changeType: string) => {
      const shiftTypeParams: spotVolShiftTypesRequest = {
        run_id: selectedBatchRunId,
        change_type: changeType,
      };
      if (
        shiftTypeParams &&
        shiftTypeParams.run_id !== 0 &&
        shiftTypeParams.change_type
      ) {
        spotVolShiftTrigger(shiftTypeParams)
          .then((resp) => {
            const respData: {
              status: QueryStatus;
              data: string[] | undefined;
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
              if (d.data !== undefined && d.data?.length > 0) {
                const zeroIndex = d.data.findIndex((x) => Number(x) === 0);
                if (changeType === "spot") {
                  setSpotVolV2Grid2ShiftTypes(d.data);
                  setSpotVolV2Grid2ShiftValue(d.data[zeroIndex]);
                } else {
                  setSpotVolV2Grid1ShiftTypes(d.data);
                  setSpotVolV2Grid1ShiftValue(d.data[zeroIndex]);
                }
              } else {
                setSpotVolV2Grid1ShiftTypes([]);
                setSpotVolV2Grid2ShiftTypes([]);
                setSpotVolV2Grid1ShiftValue("");
                setSpotVolV2Grid2ShiftValue("");
              }
            } else {
              setSpotVolV2Grid1ShiftTypes([]);
              setSpotVolV2Grid2ShiftTypes([]);
              setSpotVolV2Grid1ShiftValue("");
              setSpotVolV2Grid2ShiftValue("");
              const errorMsg = `${errorPrefix} Technical Error : ${d.error}`;
              SnackBarUtils.error(errorMsg, snackbarOption);
            }
          })
          .catch((e) => {
            const errorMsg = `${errorPrefix} Technical Error :`.concat(e);
            SnackBarUtils.error(errorMsg, snackbarOption);
          });
      }
    },
    [spotVolShiftTrigger, selectedBatchRunId]
  );

  useEffect(() => {
    getSpotVolShiftTypes("spot");
    getSpotVolShiftTypes("vol");
  }, [getSpotVolShiftTypes, selectedDate, selectedBatchRunId]);

  const getSpotVolAnalysisV1Grid1Data = useCallback(() => {
    const g1Params: spotVolAnalysisV1Request = {
      run_id: selectedBatchRunId,
      metrics_sub_type: spotVolV1Grid1Metric.replace(" ", "_").toLowerCase(),
      display_type: spotVolV1Grid1DisplayType.toLowerCase(),
    };
    if (g1Params && g1Params.run_id !== 0) {
      spotVolV1Trigger(g1Params)
        .then((resp) => {
          const respData: {
            status: QueryStatus;
            data: spotVolResponse | undefined;
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
            setSpotVolV1Grid1Cols(
              getSpotVolGridColDef(
                d.data as spotVolResponse,
                SpotVolViewTypes.View1
              )
            );
            setSpotVolV1Grid1Data(
              getSpotVolGridTransformedData(d.data as spotVolResponse)
            );
          } else {
            setSpotVolV1Grid1Cols([]);
            setSpotVolV1Grid1Data([]);

            const errorMsg = `${errorPrefix} Technical Error : ${d.error}`;
            SnackBarUtils.error(errorMsg, snackbarOption);
          }
        })
        .catch((e) => {
          const errorMsg = `${errorPrefix} Technical Error :`.concat(e);
          SnackBarUtils.error(errorMsg, snackbarOption);
        });
    }
  }, [
    spotVolV1Trigger,
    selectedBatchRunId,
    spotVolV1Grid1Metric,
    spotVolV1Grid1DisplayType,
  ]);

  useEffect(() => {
    getSpotVolAnalysisV1Grid1Data();
  }, [getSpotVolAnalysisV1Grid1Data]);

  const getSpotVolAnalysisV1Grid2Data = useCallback(() => {
    const g2Params: spotVolAnalysisV1Request = {
      run_id: selectedBatchRunId,
      metrics_sub_type: spotVolV1Grid2Metric.replace(" ", "_").toLowerCase(),
      display_type: spotVolV1Grid2DisplayType.toLowerCase(),
    };
    if (g2Params && g2Params.run_id !== 0) {
      spotVolV1Trigger(g2Params)
        .then((resp) => {
          const respData: {
            status: QueryStatus;
            data: spotVolResponse | undefined;
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
            setSpotVolV1Grid2Cols(
              getSpotVolGridColDef(
                d.data as spotVolResponse,
                SpotVolViewTypes.View1
              )
            );
            setSpotVolV1Grid2Data(
              getSpotVolGridTransformedData(d.data as spotVolResponse)
            );
          } else {
            setSpotVolV1Grid2Cols([]);
            setSpotVolV1Grid2Data([]);
            const errorMsg = `${errorPrefix} Technical Error : ${d.error}`;
            SnackBarUtils.error(errorMsg, snackbarOption);
          }
        })
        .catch((e) => {
          const errorMsg = `${errorPrefix} Technical Error :`.concat(e);
          SnackBarUtils.error(errorMsg, snackbarOption);
        });
    }
  }, [
    spotVolV1Trigger,
    selectedBatchRunId,
    spotVolV1Grid2Metric,
    spotVolV1Grid2DisplayType,
  ]);

  useEffect(() => {
    getSpotVolAnalysisV1Grid2Data();
  }, [getSpotVolAnalysisV1Grid2Data]);

  const getSpotVolAnalysisV2Grid1Data = useCallback(() => {
    const v2g1Params: spotVolAnalysisV2Request = {
      run_id: selectedBatchRunId,
      change_type: "spot",
      shift_type: spotVolV2Grid1ShiftValue,
      display_type: spotVolV2Grid1DisplayType.toLowerCase(),
    };
    if (v2g1Params && v2g1Params.run_id !== 0) {
      spotVolV2Trigger(v2g1Params)
        .then((resp) => {
          const respData: {
            status: QueryStatus;
            data: spotVolResponse | undefined;
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
            setSpotVolV2Grid1Cols(
              getSpotVolGridColDef(
                d.data as spotVolResponse,
                SpotVolViewTypes.View2
              )
            );
            setSpotVolV2Grid1Data(
              getSpotVolGridTransformedData(d.data as spotVolResponse)
            );
          } else {
            setSpotVolV2Grid1Cols([]);
            setSpotVolV2Grid1Data([]);
            const errorMsg = `${errorPrefix} Technical Error : ${d.error}`;
            SnackBarUtils.error(errorMsg, snackbarOption);
          }
        })
        .catch((e) => {
          const errorMsg = `${errorPrefix} Technical Error :`.concat(e);
          SnackBarUtils.error(errorMsg, snackbarOption);
        });
    }
  }, [
    spotVolV2Trigger,
    selectedBatchRunId,
    spotVolV2Grid1ShiftValue,
    spotVolV2Grid1DisplayType,
  ]);

  useEffect(() => {
    getSpotVolAnalysisV2Grid1Data();
  }, [getSpotVolAnalysisV2Grid1Data]);

  const getSpotVolAnalysisV2Grid2Data = useCallback(() => {
    const v2g2Params: spotVolAnalysisV2Request = {
      run_id: selectedBatchRunId,
      change_type: "vol",
      shift_type: spotVolV2Grid2ShiftValue,
      display_type: spotVolV2Grid2DisplayType.toLowerCase(),
    };
    if (v2g2Params && v2g2Params.run_id !== 0) {
      spotVolV2Trigger(v2g2Params)
        .then((resp) => {
          const respData: {
            status: QueryStatus;
            data: spotVolResponse | undefined;
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
            setSpotVolV2Grid2Cols(
              getSpotVolGridColDef(
                d.data as spotVolResponse,
                SpotVolViewTypes.View2
              )
            );
            setSpotVolV2Grid2Data(
              getSpotVolGridTransformedData(d.data as spotVolResponse)
            );
          } else {
            setSpotVolV2Grid2Cols([]);
            setSpotVolV2Grid2Data([]);
            const errorMsg = `${errorPrefix} Technical Error : ${d.error}`;
            SnackBarUtils.error(errorMsg, snackbarOption);
          }
        })
        .catch((e) => {
          const errorMsg = `${errorPrefix} Technical Error :`.concat(e);
          SnackBarUtils.error(errorMsg, snackbarOption);
        });
    }
  }, [
    spotVolV2Trigger,
    selectedBatchRunId,
    spotVolV2Grid2ShiftValue,
    spotVolV2Grid2DisplayType,
  ]);

  useEffect(() => {
    getSpotVolAnalysisV2Grid2Data();
  }, [getSpotVolAnalysisV2Grid2Data]);

  return (
    <MuiContainer className="tw-min-w-full tw-p-0 tw-h-full tw-max-h-screen tw-m-0 tw-bg-slate-25">
      <RiskHubToolbar
        data-testid="spot-vol-toolbar"
        variant="dense"
        className="tw-bg-slate-25 tw-mb-px"
        cobdate={selectedDate}
        portfoliolist={batchList}
        portfolio={selectedBatch}
        cobdatechangecallback={handleSelectedDateChange}
        portfoliochangecallback={handleSelectedBatchChange}
        showApplyButton={showapplybutton}
        applyClickCallback={null}
        showRefreshButton={showapplybutton}
        refreshBatchIdsCallback={null}
      />
      <MuiBox className="tw-min-w-full tw-p-1 tw-h-[calc(100%-62px)] tw-bg-slate-25">
        <MuiTabContext value={tabValue.toString()}>
          <MuiBox sx={{ borderBottom: 1, borderColor: "divider" }}>
            <MuiTabs
              value={tabValue}
              onChange={handleTabChange}
              aria-label="spot-vol analysis tabs"
              className="tw-flex tw-justify-center"
              centered
            >
              <MuiTab label="View 1" value={1} />
              <MuiTab label="View 2" value={2} />
            </MuiTabs>
          </MuiBox>
          <MuiTabPanel
            value="1"
            className="tw-px-3 tw-py-0 tw-h-[calc(100%-32px)]"
          >
            <MuiBox className="tw-w-full tw-h-[calc(100%-50%)]">
              <SpotVolAnalysisV1Grid
                data-testid="spot-vol-v1g1"
                spotvolGridColumns={spotVolV1Grid1Cols}
                spotvolGridData={spotVolV1Grid1Data}
                spotVolMetric={spotVolV1Grid1Metric}
                spotVolDisplayType={spotVolV1Grid1DisplayType}
                handleSpotVolMetricChange={handleSpotVolV1Grid1MetricChange}
                handleSpotVolDisplayChange={
                  handleSpotVolV1Grid1DisplayTypeChange
                }
              />
            </MuiBox>
            <MuiBox className="tw-w-full tw-h-[calc(100%-50%)]">
              <SpotVolAnalysisV1Grid
                data-testid="spot-vol-v1g2"
                spotvolGridColumns={spotVolV1Grid2Cols}
                spotvolGridData={spotVolV1Grid2Data}
                spotVolMetric={spotVolV1Grid2Metric}
                spotVolDisplayType={spotVolV1Grid2DisplayType}
                handleSpotVolMetricChange={handleSpotVolV1Grid2MetricChange}
                handleSpotVolDisplayChange={
                  handleSpotVolV1Grid2DisplayTypeChange
                }
              />
            </MuiBox>
          </MuiTabPanel>
          <MuiTabPanel
            value="2"
            className="tw-px-3 tw-py-0 tw-h-[calc(100%-32px)]"
          >
            {tabValue && tabValue === 2 && (
              <MuiBox className="tw-w-full tw-h-[calc(100%-50%)]">
                <SpotVolAnalysisV2Grid
                  data-testid="spot-vol-v2g1"
                  spotorvol="Spot"
                  spotvolGridColumns={spotVolV2Grid1Cols}
                  spotvolGridData={spotVolV2Grid1Data}
                  spotVolShiftTypes={spotVolV2Grid1ShiftTypes}
                  spotvolDisplayType={spotVolV2Grid1DisplayType}
                  spotvolShiftValue={spotVolV2Grid1ShiftValue}
                  handleSpotVolChange={handleSpotVolV2Grid1ShiftValueChange}
                  handleSpotVolDisplayChange={
                    handleSpotVolV2Grid1DisplayTypeChange
                  }
                />
              </MuiBox>
            )}
            {tabValue && tabValue === 2 && (
              <MuiBox className="tw-w-full tw-h-[calc(100%-50%)]">
                <SpotVolAnalysisV2Grid
                  data-testid="spot-vol-v2g2"
                  spotorvol="Vol"
                  spotvolGridColumns={spotVolV2Grid2Cols}
                  spotvolGridData={spotVolV2Grid2Data}
                  spotVolShiftTypes={spotVolV2Grid2ShiftTypes}
                  spotvolDisplayType={spotVolV2Grid2DisplayType}
                  spotvolShiftValue={spotVolV2Grid2ShiftValue}
                  handleSpotVolChange={handleSpotVolV2Grid2ShiftValueChange}
                  handleSpotVolDisplayChange={
                    handleSpotVolV2Grid2DisplayTypeChange
                  }
                />
              </MuiBox>
            )}
          </MuiTabPanel>
        </MuiTabContext>
      </MuiBox>
    </MuiContainer>
  );
};

export default SpotVolAnalysis;
