import { stringify } from "query-string";
import {
  AggregationRequestType,
  AggregationResponseType,
} from "src/types/aggregationType";
import { baseUniversalApi } from "./baseUniversalApi";

export const aggregationTypeSlice = baseUniversalApi.injectEndpoints({
  endpoints: (builder) => {
    return {
      getAggregationTypesData: builder.query<
        Array<AggregationResponseType>,
        AggregationRequestType
      >({
        query: (args) => {
          return {
            url: `/dashboard/agg_types?${stringify(args)}`,
            method: "GET",
          };
        },
      }),
    };
  },
});

export const {
  useGetAggregationTypesDataQuery,
  useLazyGetAggregationTypesDataQuery,
} = aggregationTypeSlice;
