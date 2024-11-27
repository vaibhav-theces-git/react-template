import { stringify } from "query-string";
import { baseUniversalApi } from "./baseUniversalApi";
import {
  VarGridDataRequestType,
  VarGridDataResponseType,
} from "../types/varGridData";

export const varGridSlice = baseUniversalApi.injectEndpoints({
  endpoints: (builder) => {
    return {
      getVaRGridData: builder.query<
        Array<VarGridDataResponseType>,
        VarGridDataRequestType
      >({
        query: (args) => {
          return {
            url: `/dashboard/var_grid?${stringify(args)}`,
            method: "GET",
          };
        },
      }),
    };
  },
});

export const { useGetVaRGridDataQuery, useLazyGetVaRGridDataQuery } =
  varGridSlice;
