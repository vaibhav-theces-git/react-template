import { stringify } from "query-string";
import {
  DataCardRequestType,
  DataCardResponseType,
} from "src/types/datacardTypes";
import { baseUniversalApi } from "./baseUniversalApi";

export const datacardApiSlice = baseUniversalApi.injectEndpoints({
  endpoints: (builder) => {
    return {
      getDataCardsData: builder.query<
        DataCardResponseType,
        DataCardRequestType
      >({
        query: (args) => {
          return {
            url: `/dashboard/dynamic_datacards?${stringify(args)}`,
            method: "GET",
          };
        },
      }),
    };
  },
});

export const { useGetDataCardsDataQuery, useLazyGetDataCardsDataQuery } =
  datacardApiSlice;
