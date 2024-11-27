import { varBackTestPortfolioResponseType } from "src/types/varBackTestType";
import { baseUniversalApi } from "./baseUniversalApi";

export const VarBackTestPortfolioSlice = baseUniversalApi.injectEndpoints({
  endpoints: (builder) => {
    return {
      VarBackTestPortfolio: builder.query<
        varBackTestPortfolioResponseType[],
        void
      >({
        query: () => {
          return {
            url: `/var_back_test/vbt_portfolio`,
            method: "GET",
          };
        },
      }),
    };
  },
});
export const {
  useVarBackTestPortfolioQuery,
  useLazyVarBackTestPortfolioQuery,
} = VarBackTestPortfolioSlice;
