import { stringify } from "query-string";
import { batchValidationRequestType } from "src/types/validationTypes";
import { baseUniversalApi } from "./baseUniversalApi";

export const batchValidationSlice = baseUniversalApi.injectEndpoints({
  endpoints: (builder) => ({
    batchValidation: builder.query<boolean, batchValidationRequestType>({
      query: (args) => ({
        url: `batch/verify_batch_name?${stringify(args)}`,
        method: "GET",
        data: args,
      }),
    }),
  }),
});

export const { useBatchValidationQuery, useLazyBatchValidationQuery } =
  batchValidationSlice;
