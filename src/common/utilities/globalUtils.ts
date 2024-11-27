import capitalize from "lodash/capitalize";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import { ErrorDetails, ErrorType } from "src/types/apiErrorTypes";

dayjs.extend(utc);

const VenueDisplayNameMap = {
  falconx: "FalconX Orderbook",
  ftx: "FTX",
  "falconx otc": "FalconX OTC",
  "falconx custody": "FalconX Custody",
};

type VenueKeys = keyof typeof VenueDisplayNameMap;

export const transformVenueNameForDisplay = (exchange: string) => {
  const key = exchange.toLowerCase() as VenueKeys;
  if (VenueDisplayNameMap[key]) {
    return VenueDisplayNameMap[key];
  }
  return capitalize(exchange);
};

export const getErrorMessageFromError = (error: ErrorType) => {
  let message = "";
  if (error) {
    if (error.status === undefined || error.status === 404) {
      message = error.data as string;
    } else {
      const err = error.data as ErrorDetails;
      message = err.error;
    }
  }
  return message;
};

/* eslint-disable */
export const getArrayFromData = (newData: any[]) => {
  const pData: any[] = [];
  newData.map((d) => {
    if (d && d.data) {
      d.data.forEach((x: any) => {
        pData.push(x);
      });
    }
    return;
  });
  return pData;
};

// column filter compare on price column in marketData
export const columnFilterComparator = (a: string, b: string) => {
  if (a === null || a === undefined || a === "") return -1;
  if (b === null || b === undefined || b === "") return 1;
  return a.localeCompare(b);
};
