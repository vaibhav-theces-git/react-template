import { stringify } from "query-string";
import { baseUniversalApi } from "./baseUniversalApi";
import {
  MVDistributionRequestType,
  MVDistributionResponseType,
} from "../types/mvDistribution";

export const mvTrendApiSlice = baseUniversalApi.injectEndpoints({
  endpoints: (builder) => {
    return {
      getMVTrendData: builder.query<
        Array<MVDistributionResponseType>,
        MVDistributionRequestType
      >({
        query: (args) => {
          return {
            url: `/dashboard/mv_distribution?${stringify(args)}`,
            method: "GET",
          };
        },
      }),
    };
  },
});

export const { useGetMVTrendDataQuery, useLazyGetMVTrendDataQuery } =
  mvTrendApiSlice;
