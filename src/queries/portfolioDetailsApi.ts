import { stringify } from "query-string";
import {
  PortfolioDetailRequestType,
  PortfolioDetailResponseType,
} from "src/types/PortfolioDetailsType";
import { baseUniversalApi } from "./baseUniversalApi";

export const portfolioDetailSlice = baseUniversalApi.injectEndpoints({
  endpoints: (builder) => ({
    portfolioDetails: builder.query<
      Array<PortfolioDetailResponseType>,
      PortfolioDetailRequestType
    >({
      query: (args) => ({
        url: `/dashboard/get_positions_data?${stringify(args)}`,
        method: "GET",
      }),
    }),
  }),
});

export const { usePortfolioDetailsQuery, useLazyPortfolioDetailsQuery } =
  portfolioDetailSlice;
