import { CurrentBusinessDateType } from "src/types/currentBusinessDate";
import { baseUniversalApi } from "./baseUniversalApi";

export const aggregationTypeSlice = baseUniversalApi.injectEndpoints({
  endpoints: (builder) => {
    return {
      getCurrentBusinessDate: builder.query<
        Array<CurrentBusinessDateType>,
        void
      >({
        query: () => {
          return {
            url: `/dashboard/current_date`,
            method: "GET",
          };
        },
      }),
    };
  },
});

export const {
  useGetCurrentBusinessDateQuery,
  useLazyGetCurrentBusinessDateQuery,
} = aggregationTypeSlice;
