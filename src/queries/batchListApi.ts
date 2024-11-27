import {
  BatchListResponseType,
  BatchRunRequestType,
} from "src/types/batchConfigurationTypes";
import { batchDataRequestType } from "src/types/batchDataTypes";
import { baseUniversalApi } from "./baseUniversalApi";

export const batchListApiSlice = baseUniversalApi.injectEndpoints({
  endpoints: (builder) => {
    return {
      getBatchListData: builder.query<Array<BatchListResponseType>, boolean>({
        query: () => {
          return {
            url: `/batch/get_batchconfig_details`,
            method: "GET",
          };
        },
      }),
    };
  },
});

export const { useGetBatchListDataQuery, useLazyGetBatchListDataQuery } =
  batchListApiSlice;

export const disabledBatchListApiSlice = baseUniversalApi.injectEndpoints({
  endpoints: (builder) => {
    return {
      getDisabledBatchListData: builder.query<
        Array<BatchListResponseType>,
        void
      >({
        query: () => {
          return {
            url: `/batch/get_batchconfig_details?is_disabled=true`,
            method: "GET",
          };
        },
      }),
    };
  },
});

export const {
  useGetDisabledBatchListDataQuery,
  useLazyGetDisabledBatchListDataQuery,
} = disabledBatchListApiSlice;

export const batchRunApiSlice = baseUniversalApi.injectEndpoints({
  endpoints: (builder) => ({
    runAdhocBatch: builder.query<void, BatchRunRequestType>({
      query: (args) => ({
        url: `batch/save_adhoc_tasks`,
        method: "POST",
        data: args,
      }),
    }),
  }),
});

export const { useRunAdhocBatchQuery, useLazyRunAdhocBatchQuery } =
  batchRunApiSlice;

export const adHocScheduledBatchApiSlice = baseUniversalApi.injectEndpoints({
  endpoints: (builder) => {
    return {
      getAdHocScheduledListData: builder.query<
        Array<BatchListResponseType>,
        batchDataRequestType
      >({
        query: (args) => {
          return {
            url: `/batch/get_run_details?task_type=${args.task_type}&start_date=${args.start_date}&end_date=${args.end_date}`,
            method: "GET",
          };
        },
      }),
    };
  },
});

export const {
  useGetAdHocScheduledListDataQuery,
  useLazyGetAdHocScheduledListDataQuery,
} = adHocScheduledBatchApiSlice;
