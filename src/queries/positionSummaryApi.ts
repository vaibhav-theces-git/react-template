import { stringify } from "query-string";
import { baseUniversalApi } from "./baseUniversalApi";
import {
  PositionSummaryRequestType,
  PositionSummaryResponseType,
} from "../types/positionSummaryData";

export const positionSummarySlice = baseUniversalApi.injectEndpoints({
  endpoints: (builder) => {
    return {
      getPostionSummaryData: builder.query<
        PositionSummaryResponseType[],
        PositionSummaryRequestType
      >({
        query: (args) => {
          return {
            url: `/dashboard/datagrid?${stringify(args)}`,
            method: "GET",
          };
        },
      }),
    };
  },
});

export const {
  useGetPostionSummaryDataQuery,
  useLazyGetPostionSummaryDataQuery,
} = positionSummarySlice;
