import { stringify } from "query-string";
import { spotVolShiftTypesRequest } from "src/types/spotVolAnalysisTypes";
import { baseUniversalApi } from "./baseUniversalApi";

export const spotVolShiftTypesDataSlice = baseUniversalApi.injectEndpoints({
  endpoints: (builder) => ({
    getSpotVolShiftTypes: builder.query<
      Array<string>,
      spotVolShiftTypesRequest
    >({
      query: (args) => ({
        url: `/spotvol/spotvol_shifts?${stringify(args)}`,
        method: "GET",
      }),
    }),
  }),
});
export const {
  useGetSpotVolShiftTypesQuery,
  useLazyGetSpotVolShiftTypesQuery,
} = spotVolShiftTypesDataSlice;
