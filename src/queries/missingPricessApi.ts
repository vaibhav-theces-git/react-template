import { stringify } from "query-string";
import {
  MissingPricesRequestType,
  MissingPricesResponseType,
} from "src/types/missingPricesTypes";
import { baseUniversalApi } from "./baseUniversalApi";

export const missingPricesSlice = baseUniversalApi.injectEndpoints({
  endpoints: (builder) => ({
    getMissingPrices: builder.query<
      Array<MissingPricesResponseType>,
      MissingPricesRequestType
    >({
      query: (args) => ({
        url: `/dashboard/missing_prices?${stringify(args)}`,
        method: "GET",
      }),
    }),
  }),
});

export const { useGetMissingPricesQuery, useLazyGetMissingPricesQuery } =
  missingPricesSlice;
