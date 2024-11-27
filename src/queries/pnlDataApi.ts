import { stringify } from "query-string";
import { baseUniversalApi } from "./baseUniversalApi";

export const pnlDataSlice = baseUniversalApi.injectEndpoints({
  endpoints: (builder) => {
    return {
      getPnlData: builder.query<any, any>({
        query: (args) => {
          return {
            url: `/dashboard/pnl_data_datagrid?${stringify(args)}`,
            method: "GET",
          };
        },
      }),
    };
  },
});

export const { useGetPnlDataQuery, useLazyGetPnlDataQuery } = pnlDataSlice;
