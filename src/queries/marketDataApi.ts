import { stringify } from "query-string";
import {
  MarketDataType,
  OverridePriceRequestType,
  ShowMarketDataRequestType,
  ShowMarketDataResponseType,
} from "../types/marketDataTypes";
import { baseUniversalApi } from "./baseUniversalApi";

export const marketDataDropdownSlice = baseUniversalApi.injectEndpoints({
  endpoints: (builder) => {
    return {
      marketDataDropdown: builder.query<MarketDataType, void>({
        query: () => {
          return {
            url: `/market_data_management/getdropdowns`,
            method: "GET",
          };
        },
      }),
    };
  },
});
export const { useMarketDataDropdownQuery, useLazyMarketDataDropdownQuery } =
  marketDataDropdownSlice;

export const showMarketDataApiSlice = baseUniversalApi.injectEndpoints({
  endpoints: (builder) => {
    return {
      showMarketData: builder.query<
        ShowMarketDataResponseType[],
        ShowMarketDataRequestType
      >({
        query: (args) => {
          return {
            url: `/market_data_management/getmarketdata?${stringify(args)}`,
            method: "GET",
          };
        },
      }),
    };
  },
});
export const { useShowMarketDataQuery, useLazyShowMarketDataQuery } =
  showMarketDataApiSlice;

export const overriddenPriceApiSlice = baseUniversalApi.injectEndpoints({
  endpoints: (builder) => ({
    saveOverRiddenPrice: builder.query<void, OverridePriceRequestType[]>({
      query: (args) => ({
        url: `/market_data_management/saveoverrideprices`,
        method: "POST",
        data: args,
      }),
    }),
  }),
});

export const { useSaveOverRiddenPriceQuery, useLazySaveOverRiddenPriceQuery } =
  overriddenPriceApiSlice;
