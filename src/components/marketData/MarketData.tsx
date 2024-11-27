import { useCallback, useEffect, useState } from "react";
import MuiContainer from "src/common/components/container/MuiContainer";
import { MuiTab, MuiTabs } from "src/common/components/tab";
import { SelectChangeEvent } from "@mui/material";
import {
  useLazyMarketDataDropdownQuery,
  useLazySaveOverRiddenPriceQuery,
  useLazyShowMarketDataQuery,
} from "src/queries/marketDataApi";
import { QueryStatus } from "@reduxjs/toolkit/dist/query";
import {
  MarketDataType,
  OverridePriceRequestType,
  ShowMarketDataRequestType,
  ShowMarketDataResponseType,
} from "src/types/marketDataTypes";
import { getErrorMessageFromError } from "src/common/utilities/globalUtils";
import { ErrorType } from "src/types/apiErrorTypes";
import { errorPrefix } from "src/common/constants/testids";
import SnackBarUtils, {
  snackbarOption,
} from "src/common/components/SnackBarUtilsConfigurator";
import dayjs, { Dayjs } from "dayjs";
import {
  convertDateToMuiFormat,
  getYYYYMMDDFormattedDateString,
} from "src/common/utilities/formatUtils/dateUtils";
import { validateStartEndDatePeriod } from "src/common/utilities/ValidationUtils/ValidationUtils";
import HistoricalData from "./HistoricalData";

const MarketData = () => {
  const [currentTabIndex, setTabIndex] = useState(0);
  const [symbolData, setSymbolData] = useState<string[] | undefined>();
  const [selectedSymbol, setSelectedSymbol] = useState<string>("");
  const [seriesData, setSeriesData] = useState<string[][]>();
  const [dataSeries, setDataSeries] = useState<string[]>([]);
  const [selectedSeriesValue, setSelectedSeriesValue] = useState<string>("");
  const [sobDate, setSobDate] = useState<string[]>();
  const [cobDate, setCobDate] = useState<string[]>();
  const [selectedSOBDate, setSelectedSOBDate] = useState<Dayjs | null>(
    dayjs("")
  );
  const [selectedCOBDate, setSelectedCOBDate] = useState<Dayjs | null>(
    dayjs("")
  );
  const [newSOBDate, setnewSOBDate] = useState<Dayjs | null>(dayjs(""));
  const [newCOBDate, setnewCOBDate] = useState<Dayjs | null>(dayjs(""));
  const [gridMarketData, setGridMarketData] =
    useState<ShowMarketDataResponseType[]>();
  const [isDateValid, setIsDateValid] = useState(true);

  const [marketDataDropdownDataTrigger] = useLazyMarketDataDropdownQuery();
  const getDropdownMarketData = useCallback(() => {
    marketDataDropdownDataTrigger()
      .then((resp) => {
        const respData: {
          status: QueryStatus;
          data: MarketDataType | undefined;
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
          const dropdownData = d.data as MarketDataType;
          if (dropdownData.length === 0) {
            // Empty Portfolio List
          } else {
            const symbolPairsData = dropdownData?.map((data) => data?.symbol);
            const seriessData = dropdownData?.map((data) => data?.series);
            const startDate =
              dropdownData?.map((sdate) => sdate?.start_date) || [];
            const endDate = dropdownData?.map((edate) => edate?.end_date) || [];
            setSobDate(startDate);
            setCobDate(endDate);
            setSymbolData(symbolPairsData);
            setSelectedSymbol(symbolPairsData[0]);
            setSeriesData(seriessData);
            setDataSeries(seriessData[0]);
            setSelectedSeriesValue(seriessData[0][0]);
            setSelectedSOBDate(convertDateToMuiFormat(startDate[0]));
            setSelectedCOBDate(convertDateToMuiFormat(endDate[0]));
            setnewSOBDate(convertDateToMuiFormat(startDate[0]));
            setnewCOBDate(convertDateToMuiFormat(endDate[0]));
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
  }, [marketDataDropdownDataTrigger]);

  const [showMarketDataTrigger] = useLazyShowMarketDataQuery();
  const getShowMarketData = useCallback(
    (params: ShowMarketDataRequestType) => {
      showMarketDataTrigger(params)
        .then((resp) => {
          const respData: {
            status: QueryStatus;
            data: ShowMarketDataResponseType[] | undefined;
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
            const data = d.data?.map((row) => ({ ...row, flag: "old" }));
            setGridMarketData(data);
          } else {
            setGridMarketData(undefined);
            const errorMsg = `${errorPrefix} Technical Error : ${d.error}`;
            SnackBarUtils.error(errorMsg, snackbarOption);
          }
        })
        .catch((e) => {
          const errorMsg = `${errorPrefix} Technical Error :`.concat(e);
          SnackBarUtils.error(errorMsg, snackbarOption);
        });
    },
    [showMarketDataTrigger]
  );

  const [overRiddenPriceTrigger] = useLazySaveOverRiddenPriceQuery();
  const onOverRidePriceSave = (price: OverridePriceRequestType[]) => {
    overRiddenPriceTrigger(price)
      .then((resp) => {
        const respData: {
          status: QueryStatus;
          error: string;
        } = {
          status: resp.status,
          error: getErrorMessageFromError(resp.error as ErrorType),
        };
        return respData;
      })
      .then((d) => {
        if (d.status === "fulfilled") {
          SnackBarUtils.success("Prices updated successfully ", snackbarOption);
          const dataParams: ShowMarketDataRequestType = {
            symbol: selectedSymbol,
            series_type: selectedSeriesValue,
            start_date: getYYYYMMDDFormattedDateString(newSOBDate as Dayjs),
            end_date: getYYYYMMDDFormattedDateString(newCOBDate as Dayjs),
          };
          getShowMarketData(dataParams);
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

  const handleTabChange = (
    event: React.SyntheticEvent<Element, Event>,
    tabIndex: React.SetStateAction<number>
  ) => {
    setTabIndex(tabIndex);
  };
  const handleSelectedSymbol = (event: SelectChangeEvent<unknown>) => {
    const newSelectedSymbol = event.target.value as string;
    setSelectedSymbol(newSelectedSymbol);
    const index = symbolData?.indexOf(newSelectedSymbol);
    if (index !== undefined && index >= 0) {
      setDataSeries(seriesData![index] || []);
      setSelectedSeriesValue(seriesData![index][0] || "");
      const sdateStr = convertDateToMuiFormat(sobDate![index]);
      const edateStr = convertDateToMuiFormat(cobDate![index]);
      setSelectedSOBDate(sdateStr);
      setSelectedCOBDate(edateStr);
      setnewSOBDate(sdateStr);
      setnewCOBDate(edateStr);
    }
    setGridMarketData([]);
  };
  const handleSelectedSeries = (event: SelectChangeEvent<unknown>) => {
    const newSelectedSeriesValue = event.target.value as string;
    setSelectedSeriesValue(newSelectedSeriesValue);
  };
  const handleStartDateChange = (date: dayjs.Dayjs | null) => {
    setnewSOBDate(date);
    setIsDateValid(validateStartEndDatePeriod(date, newCOBDate, true));
  };
  const handleEndDateChange = (date: dayjs.Dayjs | null) => {
    setnewCOBDate(date);
    setIsDateValid(validateStartEndDatePeriod(newSOBDate, date, true));
  };

  const handleShowDataButtonClick = () => {
    const dataParams: ShowMarketDataRequestType = {
      symbol: selectedSymbol,
      series_type: selectedSeriesValue,
      start_date: getYYYYMMDDFormattedDateString(newSOBDate as Dayjs),
      end_date: getYYYYMMDDFormattedDateString(newCOBDate as Dayjs),
    };
    getShowMarketData(dataParams);
  };
  useEffect(() => {
    getDropdownMarketData();
  }, [getDropdownMarketData]);

  return (
    <MuiContainer
      className="tw-w-fit tw-min-w-full tw-p-0  tw-max-h-screen tw-m-0"
      data-testid="marketDataTestId"
    >
      <MuiTabs
        value={currentTabIndex}
        onChange={handleTabChange}
        className="tw-flex tw-justify-center"
        centered
        role="tab"
      >
        <MuiTab label="Historical Data" className="tw-text-xs tw-normal-case" />
        <MuiTab label="Overrides" className="tw-text-xs tw-normal-case" />
        <MuiTab label="Proxies" className="tw-text-xs tw-normal-case" />
      </MuiTabs>
      {currentTabIndex === 0 && (
        <HistoricalData
          selectedSymbolCallback={handleSelectedSymbol}
          symbolPairsData={symbolData}
          selectedSymbol={selectedSymbol}
          selectedSeriesCallback={handleSelectedSeries}
          selectedSeriesValue={selectedSeriesValue}
          selectedSeries={dataSeries}
          startDate={selectedSOBDate}
          endDate={selectedCOBDate}
          startDateChangeCallback={handleStartDateChange}
          endDateChangeCallback={handleEndDateChange}
          showDataButtonCallback={handleShowDataButtonClick}
          gridMarketData={gridMarketData}
          overridePriceSaveCallback={onOverRidePriceSave}
          isDateValid={isDateValid}
        />
      )}
    </MuiContainer>
  );
};

export default MarketData;
