import { stringify } from "query-string";
import { baseUniversalApi } from "./baseUniversalApi";
import { VarTrendResponseType, VarTrendRequestType } from "../types/varTrend";

export const varTrendApiSlice = baseUniversalApi.injectEndpoints({
  endpoints: (builder) => {
    return {
      getVaRTrendData: builder.query<
        Array<VarTrendResponseType>,
        VarTrendRequestType
      >({
        query: (args) => {
          return {
            url: `/dashboard/var_trend?${stringify(args)}`,
            method: "GET",
          };
        },
      }),
    };
  },
});

export const { useGetVaRTrendDataQuery, useLazyGetVaRTrendDataQuery } =
  varTrendApiSlice;
