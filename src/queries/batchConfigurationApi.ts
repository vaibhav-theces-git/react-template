import { BatchConfiguration } from "src/types/batchConfigurationTypes";
import { baseUniversalApi } from "./baseUniversalApi";

export const batchConfigSlice = baseUniversalApi.injectEndpoints({
  endpoints: (builder) => ({
    updateBatchConfiguration: builder.query<
      BatchConfiguration,
      BatchConfiguration
    >({
      query: (args) => ({
        url: `batch/save_batch`,
        method: "POST",
        data: args,
      }),
    }),
  }),
});

export const {
  useUpdateBatchConfigurationQuery,
  useLazyUpdateBatchConfigurationQuery,
} = batchConfigSlice;
