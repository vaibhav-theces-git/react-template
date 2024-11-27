import { stringify } from "query-string";
import {
  spotVolPortfolioRequest,
  spotVolPortfolioResponse,
} from "src/types/spotVolAnalysisTypes";
import { baseUniversalApi } from "./baseUniversalApi";

export const spotVolPortfolioDataSlice = baseUniversalApi.injectEndpoints({
  endpoints: (builder) => ({
    getSpotVolPortfolios: builder.query<
      Array<spotVolPortfolioResponse>,
      spotVolPortfolioRequest
    >({
      query: (args) => ({
        url: `/spotvol/spotvol_portfolio?${stringify(args)}`,
        method: "GET",
      }),
    }),
  }),
});
export const {
  useGetSpotVolPortfoliosQuery,
  useLazyGetSpotVolPortfoliosQuery,
} = spotVolPortfolioDataSlice;
