import { useCallback, useEffect, useState } from "react";
import ApexAxisChart from "src/common/components/chart/apexaxischart/ApexAxisChart";
import ApexNonAxisChart from "src/common/components/chart/apexnonaxischart/ApexNonAxisChart";
import MuiContainer from "src/common/components/container/MuiContainer";
import MuiGrid from "src/common/components/grid/MuiGrid";
import { MuiBox } from "src/common/components/box/MuiBox";
import dayjs, { Dayjs } from "dayjs";
import SnackBarUtils, {
  snackbarOption,
} from "src/common/components/SnackBarUtilsConfigurator";
import {
  Portfolio,
  RiskHubToolbar,
} from "src/common/components/toolbar/riskhub-toolbar";
import { useLazyGetCurrentBusinessDateQuery } from "src/queries/currentBusinessDateApi";
import { useLazyGetPortfolioDataQuery } from "src/queries/portfolioApi";
import { useLazyGetDataCardsDataQuery } from "src/queries/datacardApi";
import { useLazyGetVaRTrendDataQuery } from "src/queries/varTrendApi";
import { useLazyGetMVTrendDataQuery } from "src/queries/mvTrendApi";
import { useLazyGetVaRGridDataQuery } from "src/queries/varGridApi";
import { useLazyGetAggregationTypesDataQuery } from "src/queries/aggregationTypesApi";
import { useLazyGetPostionSummaryDataQuery } from "src/queries/positionSummaryApi";
import { VarTrendRequestType, VarTrendResponseType } from "src/types/varTrend";
import { QueryStatus } from "@reduxjs/toolkit/dist/query";
import { CurrentBusinessDateType } from "src/types/currentBusinessDate";
import {
  MVDistributionRequestType,
  MVDistributionResponseType,
} from "src/types/mvDistribution";
import {
  PortfolioRequestType,
  PortfolioResponseType,
} from "src/types/portfolioData";
import {
  DataCardRequestType,
  DataCardResponseType,
} from "src/types/datacardTypes";
import {
  VarGridDataRequestType,
  VarGridDataResponseType,
} from "src/types/varGridData";
import {
  AggregationRequestType,
  AggregationResponseType,
} from "src/types/aggregationType";
import {
  PositionSummaryResponseType,
  PositionSummaryRequestType,
} from "src/types/positionSummaryData";
import { ApexAxisChartType } from "src/common/components/chart/apexaxischart/ApexAxisChartProps";
import { ApexNonAxisChartType } from "src/common/components/chart/apexnonaxischart/ApexNonAxisChartProps";
import { useGlobalNotificationState, useRunId } from "src/globalRunId";
import { getYYYYMMDDFormattedDateString } from "src/common/utilities/formatUtils/dateUtils";
import { ErrorType } from "src/types/apiErrorTypes";
import { getErrorMessageFromError } from "src/common/utilities/globalUtils";
import { errorPrefix, noDataMessage } from "src/common/constants/testids";
import DataCard from "./datacards/DataCard";
import VaRTable from "./var-data/VaRTable";
import PositionGrid from "./ag-grid/PositionGrid";

const Dashboard = () => {
  const { setGlobalRunId } = useRunId(0);
  const { setGlobalNotificationState } = useGlobalNotificationState(true);

  const [initialRenderDone, setInititialRenderDone] = useState(false);
  const [zoomedGridItemNo, setZoomedGridItemNo] = useState<number>(0);
  const [selectedCOBDate, setSelectedCOBDate] = useState<Dayjs>(
    dayjs(new Date())
  );
  const [businessDate, setBusinessDate] = useState<string>(
    getYYYYMMDDFormattedDateString(selectedCOBDate)
  );
  const [portfolioList, setPortfolioList] = useState<Portfolio[]>([]);
  const [selectedPortfolio, setSelectedPortfolio] = useState<string>("");
  const [selectedPortfolioId, setSelectedPortfolioId] = useState<number>(0);
  const [cardData, setCardData] = useState<DataCardResponseType[]>();
  const [varTableData, setVarTableData] = useState<VarGridDataResponseType[]>(
    []
  );
  const [varTrendChartData, setVarTrendChartData] =
    useState<ApexAxisChartSeries>([]);
  const [varTrendChartOptions, setVarTrendChartOptions] = useState<
    ApexCharts.ApexOptions | undefined
  >(undefined);
  const [mvDistributionChartData, setMVDistributionChartData] =
    useState<ApexNonAxisChartSeries>([]);
  const [mvDistributionChartOptions, setMVDistributionChartOptions] = useState<
    ApexCharts.ApexOptions | undefined
  >(undefined);
  const [aggregationTypeList, setAggregationTypeList] = useState<
    AggregationResponseType[]
  >([]);
  const [selectedAggregationType, setSelectedAggregationType] =
    useState<string>("");
  const [positionSummaryGridData, setPositionSummaryGridData] = useState<
    PositionSummaryResponseType[]
  >([]);
  const [selectedVarTrendChartType, setSelectedVarTrendChartType] =
    useState<ApexAxisChartType>("bar");
  const [selectedMVDistributionChartType, setSelectedMVDistributionChartType] =
    useState<ApexNonAxisChartType>("pie");
  const [varTrendDataExport, setVaRTrendDataExport] = useState<
    VarTrendResponseType[]
  >([]);
  const [mvDistributionDataExport, setMVDistributionDataExport] = useState<
    MVDistributionResponseType[]
  >([]);
  const [selectedAggregationTypeId, setSelectedAggregationTypeId] =
    useState<number>();

  const [cobDateTrigger] = useLazyGetCurrentBusinessDateQuery();
  const [porfolioDataTrigger] = useLazyGetPortfolioDataQuery();
  const [datacardsTrigger] = useLazyGetDataCardsDataQuery();
  const [varTableDataTrigger] = useLazyGetVaRGridDataQuery();
  const [varTrendChartDataTrigger] = useLazyGetVaRTrendDataQuery();
  const [mvDistributionChartDataTrigger] = useLazyGetMVTrendDataQuery();
  const [aggregationTypesDataTrigger] = useLazyGetAggregationTypesDataQuery();
  const [positionSummaryDataTrigger] = useLazyGetPostionSummaryDataQuery();

  const getPortfolioList = useCallback(
    (date: string) => {
      const portfolioParams: PortfolioRequestType = {
        bus_date: date,
      };
      porfolioDataTrigger(portfolioParams)
        .then((resp) => {
          const respData: {
            status: QueryStatus;
            data: PortfolioResponseType[] | undefined;
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
            const portfolios = d.data?.map((p) => {
              return {
                runId: p.run_id,
                portfolioName: p.portfolio_name,
              };
            }) as Portfolio[];
            setPortfolioList(portfolios);
            setSelectedPortfolioId(portfolios[0]?.runId);
            setSelectedPortfolio(portfolios[0]?.portfolioName);
            setGlobalRunId(portfolios[0]?.runId);
            if (d.data?.length === 0) {
              SnackBarUtils.info("No runs available", snackbarOption);
            }
          } else {
            setPortfolioList([]);
            setSelectedPortfolioId(0);
            setSelectedPortfolio("");
            setGlobalRunId(0);
            const errorMsg = `${errorPrefix} Technical Error : ${d.error}`;
            SnackBarUtils.error(errorMsg, snackbarOption);
          }
        })
        .catch((e) => {
          const errorMsg = `${errorPrefix} Technical Error :`.concat(e);
          SnackBarUtils.error(errorMsg, snackbarOption);
        });
    },
    [porfolioDataTrigger, setGlobalRunId]
  );

  const getCurrentBusinessDate = useCallback(() => {
    cobDateTrigger()
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
          setSelectedCOBDate(defaultBusinessDate);
          setBusinessDate(getYYYYMMDDFormattedDateString(defaultBusinessDate));
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
  }, [cobDateTrigger, getPortfolioList]);

  const getDataCardsData = useCallback(() => {
    const dataCardParam: DataCardRequestType = {
      run_id: selectedPortfolioId,
    };
    datacardsTrigger(dataCardParam)
      .then((resp) => {
        const respData: {
          status: QueryStatus;
          data: DataCardResponseType | undefined;
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
          setCardData(d.data as DataCardResponseType[] | undefined);
        } else {
          setCardData(undefined);
          const errorMsg = `${errorPrefix} Technical Error : ${d.error}`;
          SnackBarUtils.error(errorMsg, snackbarOption);
        }
      })
      .catch((e) => {
        const errorMsg = `${errorPrefix} Technical Error :`.concat(e);
        SnackBarUtils.error(errorMsg, snackbarOption);
      });
  }, [datacardsTrigger, selectedPortfolioId]);

  const getVaRGridData = useCallback(() => {
    const varDataTableParams: VarGridDataRequestType = {
      run_id: selectedPortfolioId,
      bus_date: businessDate,
    };
    varTableDataTrigger(varDataTableParams)
      .then((resp) => {
        const respData: {
          status: QueryStatus;
          data: VarGridDataResponseType[] | undefined;
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
          setVarTableData(d.data !== undefined ? d.data : []);
        } else {
          setVarTableData([]);
          const errorMsg = `${errorPrefix} Technical Error : ${d.error}`;
          SnackBarUtils.error(errorMsg, snackbarOption);
        }
      })
      .catch((e) => {
        const errorMsg = `${errorPrefix} Technical Error :`.concat(e);
        SnackBarUtils.error(errorMsg, snackbarOption);
      });
  }, [businessDate, selectedPortfolioId, varTableDataTrigger]);

  const getVaRTrendChartData = useCallback(() => {
    const varTrendParams: VarTrendRequestType = {
      run_id: selectedPortfolioId,
      bus_date: businessDate,
    };
    varTrendChartDataTrigger(varTrendParams)
      .then((resp) => {
        const respData: {
          status: QueryStatus;
          data: VarTrendResponseType[] | undefined;
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
          setVaRTrendDataExport(d.data as VarTrendResponseType[]);
          const varTrendCategories = d.data?.map((rec) => rec.date);
          const tempVar95 = d.data?.map((rec) => rec.VAR95);
          const tempVar99 = d.data?.map((rec) => rec.VAR99);
          const tempVar100 = d.data?.map((rec) => rec.VAR100);
          const tempvarTrendData: ApexAxisChartSeries = [
            { name: "VaR95", data: tempVar95 as number[] },
            { name: "VaR99", data: tempVar99 as number[] },
            { name: "VaR100", data: tempVar100 as number[] },
          ];
          const tempvarTrendChartOptions: ApexCharts.ApexOptions = {
            chart: {
              height: "100%",
              width: "100%",
              zoom: {
                enabled: true,
              },
              foreColor: "#ffffff",
              background: "#141A2A",
              redrawOnWindowResize: true,
              redrawOnParentResize: true,
              toolbar: {
                show: false,
              },
            },
            theme: {
              mode: "dark",
              palette: "palette3",
            },
            xaxis: {
              categories: varTrendCategories,
              title: {
                text: "Dates",
                style: {
                  fontSize: "10px",
                  fontWeight: 200,
                },
              },
              labels: {
                style: {
                  fontSize: "8px",
                },
                formatter: (v) => {
                  let val = v;
                  if (v) {
                    val = v.toString();
                    const dtArr = v.split("-");
                    const dd = parseInt(dtArr[0], 10).toString();
                    const mm = parseInt(dtArr[1], 10).toString();
                    val = mm.concat("/", dd);
                  }
                  return val;
                },
                format: "dd/MMM",
                datetimeFormatter: { day: "dd MMM" },
              },
            },
            yaxis: {
              title: {
                text: "VaR[$]",
                style: {
                  fontSize: "10px",
                  fontWeight: 200,
                },
              },
              labels: {
                style: {
                  fontSize: "8px",
                },
                formatter: (val) => {
                  return parseFloat(val.toFixed(2)).toLocaleString("en-US");
                },
              },
            },
            dataLabels: {
              enabled: false,
              enabledOnSeries: undefined,
              style: {
                fontSize: "8px",
                fontWeight: "normal",
              },
            },
            legend: {
              position: "top",
              horizontalAlign: "right",
              fontSize: "8px",
              fontWeight: "normal",
            },
            stroke: {
              width: 1,
            },
            grid: {
              borderColor: "#202739",
              xaxis: {
                lines: {
                  show: false,
                },
              },
              yaxis: {
                lines: {
                  show: true,
                },
              },
              row: {
                opacity: 0.1,
              },
            },
            tooltip: {
              enabled: true,
              enabledOnSeries: undefined,
              style: {
                fontSize: "8px",
                fontFamily: undefined,
              },
            },
          };
          setVarTrendChartData(tempvarTrendData);
          setVarTrendChartOptions(tempvarTrendChartOptions);
        } else {
          setVarTrendChartData([]);
          setVarTrendChartOptions(undefined);
          const errorMsg = `${errorPrefix} Technical Error : ${d.error}`;
          SnackBarUtils.error(errorMsg, snackbarOption);
        }
      })
      .catch((e) => {
        const errorMsg = `${errorPrefix} Technical Error :`.concat(e);
        SnackBarUtils.error(errorMsg, snackbarOption);
      });
  }, [businessDate, selectedPortfolioId, varTrendChartDataTrigger]);

  const getMVDistributionChartData = useCallback(() => {
    const mvDistributionParams: MVDistributionRequestType = {
      run_id: selectedPortfolioId,
    };
    mvDistributionChartDataTrigger(mvDistributionParams)
      .then((resp) => {
        const respData: {
          status: QueryStatus;
          data: MVDistributionResponseType[] | undefined;
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
          setMVDistributionDataExport(d.data as MVDistributionResponseType[]);
          const mvDistributionChartLabels = d.data?.map((rec) => rec.symbol);
          const tempMVDistributionChartData: ApexNonAxisChartSeries =
            d.data?.map((rec) =>
              parseFloat(rec.absolute_market_value.replaceAll(",", ""))
            ) as ApexNonAxisChartSeries;
          const tempMVDistributionChartOptions: ApexCharts.ApexOptions = {
            chart: {
              height: "100%",
              width: "100%",
              zoom: {
                enabled: true,
              },
              foreColor: "#ffffff",
              background: "#141A2A",
              redrawOnWindowResize: true,
              redrawOnParentResize: true,
              toolbar: {
                show: false,
              },
            },
            theme: {
              mode: "dark",
              palette: "palette3",
            },
            xaxis: {
              categories: [],
              title: {
                text: "Dates",
                style: {
                  fontSize: "10px",
                },
              },
              labels: {
                style: {
                  fontSize: "8px",
                },
              },
            },
            yaxis: {
              title: {
                text: "Volumes",
                style: {
                  fontSize: "10px",
                },
              },
              labels: {
                style: {
                  fontSize: "8px",
                },
                formatter: (val) => {
                  const formNum = Intl.NumberFormat("en-US", {}).format(val);
                  return formNum.toString();
                },
              },
            },
            labels: mvDistributionChartLabels,
            dataLabels: {
              enabled: true,
              enabledOnSeries: undefined,
              style: {
                fontSize: "8px",
                fontWeight: "normal",
              },
            },
            legend: {
              position: "right",
              horizontalAlign: "center",
              fontSize: "8px",
              fontWeight: "normal",
            },
            stroke: {
              show: false,
              width: 0.1,
            },
            grid: {
              borderColor: "#202739",
              xaxis: {
                lines: {
                  show: false,
                },
              },
              yaxis: {
                lines: {
                  show: true,
                },
              },
            },
            tooltip: {
              enabled: true,
              enabledOnSeries: undefined,
              style: {
                fontSize: "8px",
                fontFamily: undefined,
              },
            },
          };
          setMVDistributionChartData(tempMVDistributionChartData);
          setMVDistributionChartOptions(tempMVDistributionChartOptions);
        } else {
          setMVDistributionChartData([]);
          setMVDistributionChartOptions(undefined);
          const errorMsg = `${errorPrefix} Technical Error : ${d.error}`;
          SnackBarUtils.error(errorMsg, snackbarOption);
        }
      })
      .catch((e) => {
        const errorMsg = `${errorPrefix} Technical Error :`.concat(e);
        SnackBarUtils.error(errorMsg, snackbarOption);
      });
  }, [mvDistributionChartDataTrigger, selectedPortfolioId]);

  const getPositionSummaryGridData = useCallback(
    (runId: number, aggId: number) => {
      const positionSummaryParams: PositionSummaryRequestType = {
        run_id: runId,
        agg_id: aggId,
        bus_date: businessDate,
      };
      positionSummaryDataTrigger(positionSummaryParams)
        .then((resp) => {
          const respData: {
            status: QueryStatus;
            data: PositionSummaryResponseType[] | undefined;
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
            setPositionSummaryGridData(
              d.data !== undefined
                ? d.data
                : ([] as PositionSummaryResponseType[])
            );
          } else {
            setPositionSummaryGridData([]);
            const errorMsg = `${errorPrefix} Technical Error : ${d.error}`;
            SnackBarUtils.error(errorMsg, snackbarOption);
          }
        })
        .catch((e) => {
          const errorMsg = `${errorPrefix} Technical Error :`.concat(e);
          SnackBarUtils.error(errorMsg, snackbarOption);
        });
    },
    [businessDate, positionSummaryDataTrigger]
  );

  const getAggregationTypesData = useCallback(() => {
    const aggregationParams: AggregationRequestType = {
      run_id: selectedPortfolioId,
    };
    aggregationTypesDataTrigger(aggregationParams)
      .then((resp) => {
        const respData: {
          status: QueryStatus;
          data: AggregationResponseType[] | undefined;
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
          setAggregationTypeList(d.data as AggregationResponseType[]);
          if (d.data !== undefined) {
            setSelectedAggregationType(d.data[0]?.agg_name);
            setSelectedAggregationTypeId(d.data[0]?.agg_id);
            if (selectedPortfolioId && selectedPortfolioId !== 0) {
              getPositionSummaryGridData(
                selectedPortfolioId,
                d.data[0]?.agg_id
              );
            }
          } else {
            setSelectedAggregationType("");
            setSelectedAggregationTypeId(0);
            getPositionSummaryGridData(selectedPortfolioId, 0);
          }
        } else {
          setAggregationTypeList([]);
          setSelectedAggregationType("");
          setSelectedAggregationTypeId(0);
          getPositionSummaryGridData(0, 0);
          const errorMsg = `${errorPrefix} Technical Error : ${d.error}`;
          SnackBarUtils.error(errorMsg, snackbarOption);
        }
      })
      .catch((e) => {
        const errorMsg = `${errorPrefix} Technical Error :`.concat(e);
        SnackBarUtils.error(errorMsg, snackbarOption);
      });
  }, [
    aggregationTypesDataTrigger,
    getPositionSummaryGridData,
    selectedPortfolioId,
  ]);

  const handleCOBDateChange = (date: Dayjs) => {
    setSelectedCOBDate(date);
    setBusinessDate(getYYYYMMDDFormattedDateString(date));
    getPortfolioList(getYYYYMMDDFormattedDateString(date));
    setCardData(undefined);
    setVarTableData([]);
    setVarTrendChartData([]);
    setVarTrendChartOptions(undefined);
    setMVDistributionChartData([]);
    setMVDistributionChartOptions(undefined);
    setPositionSummaryGridData([]);
    setAggregationTypeList([]);
  };

  const handlePortfolioChange = (portfolio: string) => {
    setSelectedPortfolio(
      portfolioList.find((p) => p.portfolioName === portfolio)
        ?.portfolioName as string
    );

    setSelectedPortfolioId(
      portfolioList.find((p) => p.portfolioName === portfolio)?.runId as number
    );

    setGlobalRunId(
      portfolioList.find((p) => p.portfolioName === portfolio)?.runId as number
    );
  };

  const handleAggregationTypeChange = (aggType: string) => {
    setSelectedAggregationType(
      aggregationTypeList.find((ag) => ag.agg_name === aggType)
        ?.agg_name as string
    );
    setSelectedAggregationTypeId(
      aggregationTypeList.find((ag) => ag.agg_name === aggType)
        ?.agg_id as number
    );

    const aggId = aggregationTypeList.find((ag) => ag.agg_name === aggType)
      ?.agg_id as number;

    getPositionSummaryGridData(selectedPortfolioId, aggId);
    getPositionSummaryGridData(selectedPortfolioId, aggId);
  };

  const handleVarTrendChartTypeChange = (
    varTrendChartType: ApexAxisChartType
  ) => {
    setSelectedVarTrendChartType(varTrendChartType);
  };

  const handleMVDistributionChartTypeChange = (
    mvDistributionChartType: ApexNonAxisChartType
  ) => {
    setSelectedMVDistributionChartType(mvDistributionChartType);
  };

  const handleToggleBlock3 = (enableZoom: boolean) => {
    window.dispatchEvent(new Event("resize"));
    if (enableZoom) setZoomedGridItemNo(3);
    else setZoomedGridItemNo(0);
  };

  const handleToggleBlock4 = (enableZoom: boolean) => {
    window.dispatchEvent(new Event("resize"));
    if (enableZoom) setZoomedGridItemNo(4);
    else setZoomedGridItemNo(0);
  };

  const handleToggleBlock5 = (enableZoom: boolean) => {
    if (enableZoom) setZoomedGridItemNo(5);
    else setZoomedGridItemNo(0);
  };

  const handleApplyClick = () => {
    setGlobalNotificationState(false);
    getAggregationTypesData();
    getDataCardsData();
    getVaRGridData();
    getVaRTrendChartData();
    getMVDistributionChartData();
  };

  const handlePortfolioRefresh = () => {
    getPortfolioList(businessDate);
  };

  useEffect(() => {
    if (!initialRenderDone) {
      getCurrentBusinessDate();
      getPortfolioList(businessDate);
      setInititialRenderDone(true);
    }
  }, [
    businessDate,
    selectedAggregationType,
    getCurrentBusinessDate,
    getAggregationTypesData,
    getDataCardsData,
    getMVDistributionChartData,
    getPortfolioList,
    getPositionSummaryGridData,
    getVaRGridData,
    getVaRTrendChartData,
    initialRenderDone,
    selectedAggregationTypeId,
    selectedPortfolioId,
  ]);

  return (
    <MuiContainer className="tw-w-fit tw-min-w-full tw-p-0 tw-h-full tw-max-h-screen tw-m-0">
      <RiskHubToolbar
        variant="dense"
        className="tw-bg-slate-25 tw-mb-px"
        portfoliolist={portfolioList}
        cobdate={selectedCOBDate}
        portfolio={selectedPortfolio}
        cobdatechangecallback={handleCOBDateChange}
        portfoliochangecallback={handlePortfolioChange}
        showApplyButton
        applyClickCallback={handleApplyClick}
        showRefreshButton
        refreshBatchIdsCallback={handlePortfolioRefresh}
      />
      <MuiGrid
        container
        item
        className={
          zoomedGridItemNo === 0
            ? "tw-grid lg:tw-grid-cols-2 md:tw-grid-cols-2 sm:tw-grid-cols-1 tw-grow tw-gap-px tw-h-[calc(100%-50px)]"
            : "tw-grid lg:tw-grid-cols-1 md:tw-grid-cols-1 sm:tw-grid-cols-1 tw-grow tw-gap-px tw-h-[calc(100%-50px)]"
        }
      >
        {zoomedGridItemNo === 0 && (
          <MuiGrid
            item
            className="tw-grow-0 lg:tw-grid-cols-1 md:tw-grid-cols-1 sm:tw-grid-cols-1 tw-space-x-6 tw-bg-slate-50 tw-relative tw-h-auto"
          >
            {cardData && (
              <DataCard
                dynamicCardsdata={cardData}
                getDataCardsData={getDataCardsData}
              />
            )}
            {(!cardData || cardData === undefined) && (
              <div className=" tw-flex tw-text-sm tw-text-center tw-items-center tw-justify-center tw-h-auto tw-w-full nodatamessage">
                <span>{noDataMessage}</span>
              </div>
            )}
          </MuiGrid>
        )}
        {zoomedGridItemNo === 0 && (
          <MuiGrid
            item
            className="tw-grow-0 tw-w-full lg:tw-grid-cols-6 md:tw-grid-cols-6 sm:tw-grid-cols-6 tw-bg-slate-50 tw-h-auto"
          >
            <VaRTable varData={varTableData} />
          </MuiGrid>
        )}
        {(zoomedGridItemNo === 0 || zoomedGridItemNo === 3) && (
          <MuiGrid
            item
            className={
              zoomedGridItemNo === 3
                ? "tw-grow-0 tw-w-full lg:tw-grid-cols-1 md:tw-grid-cols-1 sm:tw-grid-cols-1 tw-bg-slate-50 tw-h-full"
                : `tw-grow-0 tw-w-full lg:tw-grid-cols-6 md:tw-grid-cols-6 sm:tw-grid-cols-6 tw-bg-slate-50 ${
                    varTrendChartData && varTrendChartData.length > 0
                      ? "tw-h-72"
                      : "tw-h-full"
                  }`
            }
          >
            <ApexAxisChart
              chartTitle="VaR Trend"
              apexChartType={selectedVarTrendChartType}
              apexChartOptions={varTrendChartOptions as ApexCharts.ApexOptions}
              apexChartSeries={varTrendChartData}
              togglecallback={handleToggleBlock3}
              charttypechangecallback={handleVarTrendChartTypeChange}
              apexAxisChartExportData={varTrendDataExport}
            />
          </MuiGrid>
        )}
        {(zoomedGridItemNo === 0 || zoomedGridItemNo === 4) && (
          <MuiGrid
            item
            className={
              zoomedGridItemNo === 4
                ? "tw-grow-0 tw-w-full lg:tw-grid-cols-1 md:tw-grid-cols-1 sm:tw-grid-cols-1 tw-bg-slate-50 tw-h-full"
                : `tw-grow-0 tw-w-full lg:tw-grid-cols-6 md:tw-grid-cols-6 sm:tw-grid-cols-6 tw-bg-slate-50 ${
                    mvDistributionChartData &&
                    mvDistributionChartData.length > 0
                      ? "tw-h-72"
                      : "tw-h-full"
                  }`
            }
          >
            <ApexNonAxisChart
              chartTitle="Market Value Distribution"
              apexChartType={selectedMVDistributionChartType}
              apexChartOptions={
                mvDistributionChartOptions as ApexCharts.ApexOptions
              }
              apexChartSeries={mvDistributionChartData}
              togglecallback={handleToggleBlock4}
              charttypechangecallback={handleMVDistributionChartTypeChange}
              apexNonAxisChartExportData={mvDistributionDataExport}
            />
          </MuiGrid>
        )}
        {(zoomedGridItemNo === 0 || zoomedGridItemNo === 5) && (
          <MuiGrid
            item
            className={
              zoomedGridItemNo === 5
                ? "tw-grow-0 lg:tw-grid-cols-1 md:tw-grid-cols-1 sm:tw-grid-cols-1 tw-bg-slate-50 tw-h-full"
                : "tw-grow-0 lg:tw-grid-cols-1 md:tw-grid-cols-1 sm:tw-grid-cols-1 lg:tw-col-span-2 md:tw-col-span-2 sm:tw-col-span-1 tw-bg-slate-50 tw-h-full"
            }
          >
            <MuiBox className="tw-h-full tw-w-full  tw-bg-green">
              <PositionGrid
                positiongriddata={positionSummaryGridData}
                aggregationtypelist={aggregationTypeList}
                selectedaggregationtype={selectedAggregationType}
                togglecallback={handleToggleBlock5}
                aggregationtypechangecallback={handleAggregationTypeChange}
                runId={selectedPortfolioId}
                aggId={selectedAggregationTypeId}
                busDate={businessDate}
              />
            </MuiBox>
          </MuiGrid>
        )}
      </MuiGrid>
    </MuiContainer>
  );
};

export default Dashboard;
