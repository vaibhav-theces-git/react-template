import { stringify } from "query-string";
import {
  spotVolAnalysisV1Request,
  spotVolAnalysisV2Request,
  spotVolResponse,
} from "src/types/spotVolAnalysisTypes";
import { baseUniversalApi } from "./baseUniversalApi";

export const spotVolAnalysisV1DataSlice = baseUniversalApi.injectEndpoints({
  endpoints: (builder) => ({
    getSpotVolAnalysisV1: builder.query<
      spotVolResponse,
      spotVolAnalysisV1Request
    >({
      query: (args) => ({
        url: `/spotvol/spotvol_details_view1?${stringify(args)}`,
        method: "GET",
      }),
    }),
  }),
});
export const {
  useGetSpotVolAnalysisV1Query,
  useLazyGetSpotVolAnalysisV1Query,
} = spotVolAnalysisV1DataSlice;

export const spotVolAnalysisV2DataSlice = baseUniversalApi.injectEndpoints({
  endpoints: (builder) => ({
    getSpotVolAnalysisV2: builder.query<
      spotVolResponse,
      spotVolAnalysisV2Request
    >({
      query: (args) => ({
        url: `/spotvol/spotvol_details_view2?${stringify(args)}`,
        method: "GET",
      }),
    }),
  }),
});
export const {
  useGetSpotVolAnalysisV2Query,
  useLazyGetSpotVolAnalysisV2Query,
} = spotVolAnalysisV2DataSlice;
