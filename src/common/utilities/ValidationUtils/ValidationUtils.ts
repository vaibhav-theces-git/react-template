import {
  BatchAggregationResponseType,
  BatchRunMeasure,
  LegalEntity,
  ScenarioGrid,
} from "src/types/batchConfigurationTypes";
import dayjs, { Dayjs } from "dayjs";
import SnackBarUtils, {
  snackbarOption,
} from "src/common/components/SnackBarUtilsConfigurator";
import { ShowMarketDataResponseType } from "src/types/marketDataTypes";
import {
  supportedInstrumentTypes,
  supportedSOUTypes,
} from "src/common/constants/sytheticPortfolioConstants";
import { BATCH_TYPES } from "src/common/constants/batchTypeConstant";
import { runDaysMeasures } from "./batchConfigConstants";

const allDays = "All Days";
const weekDays = "weekdays";
const months = "months";
const years = "years";
const weeks = "weeks";
const days = "days";
const Days = {
  Sun: "Su",
  Mon: "M",
  Tue: "Tu",
  Wed: "W",
  Th: "Th",
  Fri: "F",
  Sat: "Sa",
};
const GetDays = {
  Sun: "Sun",
  Mon: "Mon",
  Tue: "Tue",
  Wed: "Wed",
  Thu: "Thu",
  Fri: "Fri",
  Sat: "Sat",
};

export const validateEmptyBatchName = (bName: string) => {
  const isBatchNameEmpty = bName.trim() === "";
  return isBatchNameEmpty;
};
export const validatePeriod = (
  period: string,
  isCustomPeriodSelected: boolean,
  periodMeasure: string
) => {
  let isValid = true;
  if (!isCustomPeriodSelected) {
    if (period !== "" && !period.includes(".")) {
      const pvalue = Number(period);
      if (pvalue && periodMeasure.toLowerCase() === months) {
        isValid = pvalue >= 3 && pvalue <= 24;
      } else if (pvalue && periodMeasure.toLowerCase() === years) {
        isValid = pvalue > 0 && pvalue <= 2;
      } else if (pvalue && periodMeasure.toLowerCase() === weeks) {
        isValid = pvalue >= 12 && pvalue <= 104;
      } else if (period && periodMeasure.toLowerCase() === days) {
        isValid = pvalue >= 90 && pvalue <= 730;
      } else {
        isValid = false;
      }
    } else {
      isValid = false;
    }
  }
  return isValid;
};
export const validateSchedule = (
  time: string,
  rundays: BatchRunMeasure[],
  isScheduledBatch: boolean
) => {
  let isValid = true;
  if (isScheduledBatch) {
    isValid = rundays && rundays.length > 0;
  }
  return isValid;
};

export const validateStartEndDatePeriod = (
  startdate: dayjs.Dayjs | null,
  enddate: dayjs.Dayjs | null,
  isCustomPeriodSelected: boolean
) => {
  let isValid = true;
  if (isCustomPeriodSelected) {
    if (startdate && enddate) {
      isValid = startdate <= enddate;
    } else {
      isValid = false;
    }
  }
  return isValid;
};

export const validateHoldingPeriod = (holdPeriod: string) => {
  let isValid = true;
  if (holdPeriod && holdPeriod !== "" && !holdPeriod.includes(".")) {
    const hperiod = Number(holdPeriod);
    isValid = hperiod > 0 && hperiod <= 10;
  } else {
    isValid = false;
  }
  return isValid;
};

export const validateHierarchies = (
  hierarchies: BatchAggregationResponseType[]
) => {
  let isValidList = true;
  const set = new Set();
  if (!hierarchies || hierarchies.length > 0) {
    if (
      hierarchies.some(
        (object) => set.size === (set.add(object.value), set.size)
      )
    ) {
      isValidList = false;
      SnackBarUtils.warning(
        "Duplicate values are not allowed in hierarchies",
        snackbarOption
      );
    }
  } else {
    isValidList = false;
    SnackBarUtils.warning(
      "Aggregation Hierarchy list can not be empty",
      snackbarOption
    );
  }
  return isValidList;
};

export const validateHierarchy = (selectedLevels: string[]) => {
  if (selectedLevels.length === 0) {
    SnackBarUtils.error("Select at least one hierarchy", snackbarOption);
    return false;
  }
  return true;
};

export const validatePortifolioList = (
  legelEntityTableData: LegalEntity[],
  selectedBatchType: string
) => {
  let isListValid = true;

  if (selectedBatchType === BATCH_TYPES.UNIT_VAR) {
    isListValid = true;
  } else if (!legelEntityTableData || legelEntityTableData.length <= 0) {
    isListValid = false;
    SnackBarUtils.warning("Portfolio can not be empty", snackbarOption);
  }
  return isListValid;
};

export const setRunDaysArrayFromString = (
  rundays: string
): BatchRunMeasure[] => {
  let rundayArr: BatchRunMeasure[];
  if (rundays && rundays.toLowerCase() === allDays.toLowerCase()) {
    rundayArr = runDaysMeasures.map((dayObj) => dayObj);
  } else if (rundays && rundays.toLowerCase() === weekDays) {
    rundayArr = runDaysMeasures.filter(
      (dayObj) => dayObj.measure !== "Sun" && dayObj.measure !== "Sat"
    );
  } else if (rundays) {
    const daystrarr = rundays.split(",");
    rundayArr = daystrarr.map((day) => {
      let dayStr = "";
      switch (day) {
        case Days.Sun:
          dayStr = "Sun";
          break;
        case Days.Mon:
          dayStr = "Mon";
          break;
        case Days.Tue:
          dayStr = "Tue";
          break;
        case Days.Wed:
          dayStr = "Wed";
          break;
        case Days.Th:
          dayStr = "Thu";
          break;
        case Days.Fri:
          dayStr = "Fri";
          break;
        case Days.Sat:
          dayStr = "Sat";
          break;
        default:
          break;
      }
      return runDaysMeasures.find((m) => m.measure === dayStr);
    }) as BatchRunMeasure[];
  } else {
    return [];
  }
  return rundayArr;
};

export const getRunDaysToSave = (
  selectedRunDays: BatchRunMeasure[]
): string => {
  const selectedRunDayArr = selectedRunDays.map((day) => day?.measure);
  let returnStr = "";
  if (selectedRunDays.length === 7) {
    returnStr = allDays;
  } else if (
    selectedRunDays.length === 5 &&
    !selectedRunDayArr.includes("Sun") &&
    !selectedRunDayArr.includes("Sat")
  ) {
    returnStr = "Weekdays";
  } else {
    const finalArr = selectedRunDayArr.map((day) => {
      switch (day) {
        case GetDays.Sun:
          return "Su";
        case GetDays.Mon:
          return "M";
        case GetDays.Tue:
          return "Tu";
        case GetDays.Wed:
          return "W";
        case GetDays.Thu:
          return "Th";
        case GetDays.Fri:
          return "F";
        case GetDays.Sat:
          return "Sa";
        default:
          return "";
      }
    });
    returnStr = finalArr.join(",");
  }
  return returnStr;
};

export const validateSpotVolGridData = (spotVolData: ScenarioGrid[]) => {
  let isValid = true;
  if (Array.isArray(spotVolData) && spotVolData.length > 0) {
    const spotData = spotVolData.filter((spot) => spot.spotvol === "spot");
    const volData = spotVolData.filter((vol) => vol.spotvol === "vol");
    if (
      spotData[0].n1 < -100 ||
      spotData[0].n2 < -100 ||
      spotData[0].n3 < -100 ||
      spotData[0].n4 < -100 ||
      spotData[0].n5 < -100
    ) {
      SnackBarUtils.error(
        "Spot  shifts should be greater than -100",
        snackbarOption
      );
      isValid = false;
      return isValid;
    }
    if (
      spotData[0].n1 === null ||
      spotData[0].n2 === null ||
      spotData[0].n3 === null ||
      spotData[0].n4 === null ||
      spotData[0].n5 === null ||
      spotData[0].p1 === null ||
      spotData[0].p2 === null ||
      spotData[0].p3 === null ||
      spotData[0].p4 === null ||
      spotData[0].p5 === null ||
      volData[0].n1 === null ||
      volData[0].n2 === null ||
      volData[0].n3 === null ||
      volData[0].n4 === null ||
      volData[0].n5 === null ||
      volData[0].p1 === null ||
      volData[0].p2 === null ||
      volData[0].p3 === null ||
      volData[0].p4 === null ||
      volData[0].p5 === null
    ) {
      SnackBarUtils.error(
        "Spot & vol shifts should not be empty",
        snackbarOption
      );
      isValid = false;
      return isValid;
    }

    if (
      spotData[0].n1 === 0 ||
      spotData[0].n2 === 0 ||
      spotData[0].n3 === 0 ||
      spotData[0].n4 === 0 ||
      spotData[0].n5 === 0 ||
      spotData[0].p1 === 0 ||
      spotData[0].p2 === 0 ||
      spotData[0].p3 === 0 ||
      spotData[0].p4 === 0 ||
      spotData[0].p5 === 0 ||
      volData[0].n1 === 0 ||
      volData[0].n2 === 0 ||
      volData[0].n3 === 0 ||
      volData[0].n4 === 0 ||
      volData[0].n5 === 0 ||
      volData[0].p1 === 0 ||
      volData[0].p2 === 0 ||
      volData[0].p3 === 0 ||
      volData[0].p4 === 0 ||
      volData[0].p5 === 0
    ) {
      SnackBarUtils.error("Spot & vol shifts should not be 0", snackbarOption);
      isValid = false;
      return isValid;
    }

    if (
      spotData[0].n1 > 0 ||
      spotData[0].n2 > 0 ||
      spotData[0].n3 > 0 ||
      spotData[0].n4 > 0 ||
      spotData[0].n5 > 0 ||
      volData[0].n1 > 0 ||
      volData[0].n2 > 0 ||
      volData[0].n3 > 0 ||
      volData[0].n4 > 0 ||
      volData[0].n5 > 0 ||
      spotData[0].p1 < 0 ||
      spotData[0].p2 < 0 ||
      spotData[0].p3 < 0 ||
      spotData[0].p4 < 0 ||
      spotData[0].p5 < 0 ||
      volData[0].p1 < 0 ||
      volData[0].p2 < 0 ||
      volData[0].p3 < 0 ||
      volData[0].p4 < 0 ||
      volData[0].p5 < 0
    ) {
      SnackBarUtils.error(
        "Please check signs of spot/vol shifts",
        snackbarOption
      );
      isValid = false;
      return isValid;
    }
  }
  return isValid;
};

export const validateMarketData = (
  overRiddenPrice: ShowMarketDataResponseType[],
  existingRecords: ShowMarketDataResponseType[] | undefined
) => {
  const validationResult: { result: boolean; msg: string } = {
    result: true,
    msg: "",
  };

  overRiddenPrice.forEach((dateItem) => {
    if (dateItem.override_price < 0) {
      validationResult.result = false;
      validationResult.msg = "Override price should be positive";
      return;
    }

    if (dateItem.flag === "new") {
      const dateExists = existingRecords?.some((item) => {
        return dateItem.dimension_id === 2
          ? dateItem.date === item.date &&
              dateItem.maturity_date === item.maturity_date
          : dateItem.date === item.date;
      });

      if (dateExists) {
        validationResult.result = false;
        validationResult.msg =
          dateItem.dimension_id === 1
            ? "Date already exists in record"
            : "Date and maturity date combination already exists in record";
      }
    }
  });

  return validationResult;
};

// synthetic portfolio validation
export const validateMaturityDate = (
  selectedInsrumentType: string,
  date: Dayjs | null
) => {
  const todaysDate = dayjs();
  const isSupportedInstrumentType =
    typeof selectedInsrumentType !== "undefined" &&
    supportedInstrumentTypes.includes(
      selectedInsrumentType?.toLocaleLowerCase()
    );
  if (isSupportedInstrumentType && date === null) {
    SnackBarUtils.warning("Please select maturity date", snackbarOption);
    return false;
  }
  if (isSupportedInstrumentType && date !== null && date < todaysDate) {
    SnackBarUtils.warning(
      "Maturity date should be greater than today's date",
      snackbarOption
    );
    return false;
  }
  return true;
};

export const validateStrike = (
  instrumentType: string,
  selectedStrike: number | null
) => {
  const isSupportedSOUType =
    typeof instrumentType !== "undefined" &&
    supportedSOUTypes.includes(instrumentType.toLowerCase());
  const strikeValue = selectedStrike !== null ? Number(selectedStrike) : null;
  if (
    (isSupportedSOUType && selectedStrike === null) ||
    (strikeValue !== null && strikeValue <= 0)
  ) {
    SnackBarUtils.warning("Strike should be greater than 0", snackbarOption);
    return false;
  }
  return true;
};
