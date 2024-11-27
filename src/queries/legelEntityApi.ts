import {
  LegelEntityAccountResponseType,
  LegelEntityIdsNamesResponseType,
} from "src/types/batchConfigurationTypes";
import { baseUniversalApi } from "./baseUniversalApi";

export const legelEntityApiSlice = baseUniversalApi.injectEndpoints({
  endpoints: (builder) => {
    return {
      getLegelEntityIdsAndNamesData: builder.query<
        LegelEntityIdsNamesResponseType[],
        void
      >({
        query: () => {
          return {
            url: `/batch/get_all_leids_and_names`,
            method: "GET",
          };
        },
      }),
    };
  },
});
export const {
  useGetLegelEntityIdsAndNamesDataQuery,
  useLazyGetLegelEntityIdsAndNamesDataQuery,
} = legelEntityApiSlice;

export const legelEntityAccountApiSlice = baseUniversalApi.injectEndpoints({
  endpoints: (builder) => {
    return {
      getLegelEntityAccountsByIdData: builder.query<
        Array<LegelEntityAccountResponseType>,
        string
      >({
        query: (args) => {
          return {
            url: `/batch/get_accts_for_leid?le_id=${args}`,
            method: "GET",
          };
        },
      }),
    };
  },
});
export const {
  useGetLegelEntityAccountsByIdDataQuery,
  useLazyGetLegelEntityAccountsByIdDataQuery,
} = legelEntityAccountApiSlice;

export const allLegelEntityAccountApiSlice = baseUniversalApi.injectEndpoints({
  endpoints: (builder) => {
    return {
      getAllLegelEntityAccountsData: builder.query<
        Array<LegelEntityAccountResponseType>,
        void
      >({
        query: () => {
          return {
            url: `/batch/get_all_le_accounts`,
            method: "GET",
          };
        },
      }),
    };
  },
});
export const {
  useGetAllLegelEntityAccountsDataQuery,
  useLazyGetAllLegelEntityAccountsDataQuery,
} = allLegelEntityAccountApiSlice;
