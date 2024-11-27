import { BatchVarResponseType } from "src/types/batchConfigurationTypes";
import { baseUniversalApi } from "./baseUniversalApi";

export const batchVarApiSlice = baseUniversalApi.injectEndpoints({
  endpoints: (builder) => {
    return {
      getBatchVarLevelsData: builder.query<Array<BatchVarResponseType>, void>({
        query: () => {
          return {
            url: `/batch/get_var_levels`,
            method: "GET",
          };
        },
      }),
    };
  },
});

export const {
  useGetBatchVarLevelsDataQuery,
  useLazyGetBatchVarLevelsDataQuery,
} = batchVarApiSlice;
