import { stringify } from "query-string";
import { positionSummaryDownloadRequestTye } from "../types/positionSummaryDownloadType";
import { baseUniversalApi } from "./baseUniversalApi";

export const positionGridDownloadSlice = baseUniversalApi.injectEndpoints({
  endpoints: (builder) => ({
    positionGridDownload: builder.query<
      string,
      positionSummaryDownloadRequestTye
    >({
      query: (args) => ({
        url: `/dashboard/download_datagrid_csv?${stringify(args)}`,
        method: "GET",
      }),
    }),
  }),
});

export const {
  usePositionGridDownloadQuery,
  useLazyPositionGridDownloadQuery,
} = positionGridDownloadSlice;
