import {
  varBackTestDataRequestType,
  varBackTestDataResponseType,
} from "src/types/varBackTestType";
import { stringify } from "query-string";
import { baseUniversalApi } from "./baseUniversalApi";

export const varBackTedtDataSlice = baseUniversalApi.injectEndpoints({
  endpoints: (builder) => ({
    getVarBackTestData: builder.query<
      varBackTestDataResponseType,
      varBackTestDataRequestType
    >({
      query: (args) => ({
        url: `/var_back_test/vbt_details?${stringify(args)}`,
        method: "GET",
      }),
    }),
  }),
});
export const { useGetVarBackTestDataQuery, useLazyGetVarBackTestDataQuery } =
  varBackTedtDataSlice;
