import { stringify } from "query-string";
import {
  RunHistoryRequestType,
  RunHistoryResponseType,
} from "src/types/runHistoryType";
import { baseUniversalApi } from "./baseUniversalApi";

export const runHistoryDetailsSlice = baseUniversalApi.injectEndpoints({
  endpoints: (builder) => ({
    getrunHistoryData: builder.query<
      RunHistoryResponseType[],
      RunHistoryRequestType
    >({
      query: (args) => {
        return {
          url: `batch/get_run_batch_details?${stringify(args)}`,
          method: "GET",
        };
      },
    }),
  }),
});

export const { useGetrunHistoryDataQuery, useLazyGetrunHistoryDataQuery } =
  runHistoryDetailsSlice;
