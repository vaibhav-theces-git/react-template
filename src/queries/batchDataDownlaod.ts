import { stringify } from "query-string";
import { batchDataDownloadRequestType } from "src/types/batchDataDownloadRequestType";
import { baseUniversalApi } from "./baseUniversalApi";

export const positionGridDownloadSlice = baseUniversalApi.injectEndpoints({
  endpoints: (builder) => ({
    batchDataDownload: builder.query<any, batchDataDownloadRequestType>({
      query: (args) => ({
        url: `/dashboard/get_tabledata_by_runid?${stringify(args)}`,
        method: "GET",
        responseType: "arraybuffer",
      }),
    }),
  }),
});

export const { useBatchDataDownloadQuery, useLazyBatchDataDownloadQuery } =
  positionGridDownloadSlice;
