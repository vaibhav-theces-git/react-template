import { stringify } from "query-string";
import { baseUniversalApi } from "./baseUniversalApi";
import {
  PortfolioRequestType,
  PortfolioResponseType,
} from "../types/portfolioData";

export const portfolioSlice = baseUniversalApi.injectEndpoints({
  endpoints: (builder) => ({
    getPortfolioData: builder.query<
      Array<PortfolioResponseType>,
      PortfolioRequestType
    >({
      query: (args) => ({
        url: `/dashboard/portfolio?${stringify(args)}`,
        method: "GET",
      }),
    }),
  }),
});

export const { useGetPortfolioDataQuery, useLazyGetPortfolioDataQuery } =
  portfolioSlice;
