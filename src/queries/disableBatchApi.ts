import { BatchDisableRequestType } from "src/types/batchConfigurationTypes";
import { baseUniversalApi } from "./baseUniversalApi";

export const batchConfigSlice = baseUniversalApi.injectEndpoints({
  endpoints: (builder) => ({
    disableBatchConfiguration: builder.query<string, BatchDisableRequestType>({
      query: (args) => ({
        url: `/batch/disable_batch`,
        method: "POST",
        data: args,
      }),
    }),
  }),
});

export const {
  useDisableBatchConfigurationQuery,
  useLazyDisableBatchConfigurationQuery,
} = batchConfigSlice;
