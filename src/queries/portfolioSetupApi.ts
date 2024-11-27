import {
  batchListResponseType,
  batchPositionsRequestType,
  batchPositionsResponseType,
  calculatePortfolioRequestType,
  calculatePortfolioResponseType,
  dataCardsRequestType,
  dataCardsResponseType,
  discardPortfolioRequestType,
  gridPortfolioByLeIdRequestType,
  gridPortfolioRequestType,
  gridPortfolioResponseType,
  gridResponseType,
  newPortfolioNameRequestType,
  newPortfolioNameResponseType,
  portfolioListRequestType,
  portfolioListResponseType,
  portfolioSaveRequestType,
  portfolioSaveResponsetype,
  portfolioStatusRequestType,
  portfolioStatusResponseType,
  portfoliStatusRequestType,
  portfoliStatusResponseType,
  positionAddRequestType,
  positionEditRequestType,
  resultDataTableResponseType,
} from "src/types/syntheticPortfolioTypes";
import { stringify } from "query-string";
import { baseUniversalApi } from "./baseUniversalApi";

export const portfolioSetupSlice = baseUniversalApi.injectEndpoints({
  endpoints: (builder) => ({
    PortfoliosetupData: builder.query<
      newPortfolioNameResponseType,
      newPortfolioNameRequestType
    >({
      query: (args) => ({
        url: `/spa/save_portfolio_name?${stringify(args)}`,
        method: "POST",
      }),
    }),
    getPortfolioList: builder.query<
      portfolioListResponseType[],
      portfolioListRequestType
    >({
      query: (args) => ({
        url: `/spa/get_spa_portfolio_list?${stringify(args)}`,
        method: "GET",
      }),
    }),
    getBatchList: builder.query<batchListResponseType[], void>({
      query: () => ({
        url: `/spa/get_spa_batch_portfolio_list`,
        method: "GET",
      }),
    }),
    getexistingPortfolioPositions: builder.query<
      portfolioListResponseType[],
      portfolioListRequestType
    >({
      query: (args) => ({
        url: `/spa/get_spa_portfolio_list?${stringify(args)}`,
        method: "GET",
      }),
    }),
    getGridPortfolioPositionById: builder.query<
      gridPortfolioResponseType[],
      gridPortfolioRequestType
    >({
      query: (args) => ({
        url: `/spa/create_from_existing_portfolio?${stringify(args)}`,
        method: "POST",
      }),
    }),
    getLatestGridPosition: builder.query<
      gridResponseType[],
      discardPortfolioRequestType
    >({
      query: (args) => ({
        url: `/spa/get_portfolio_positions?${stringify(args)}`,
        method: "GET",
      }),
    }),
    getBatchPosition: builder.query<
      batchPositionsResponseType[],
      batchPositionsRequestType
    >({
      query: (args) => ({
        url: `/spa/get_batch_positions?`,
        method: "POST",
        data: args,
      }),
    }),
    getGridPortfolioPositionByLeId: builder.query<
      gridResponseType[],
      gridPortfolioByLeIdRequestType
    >({
      query: (args) => ({
        url: `/spa/get_positions_by_accts?`,
        method: "POST",
        data: args,
      }),
    }),
    updatePosition: builder.query<gridResponseType[], positionEditRequestType>({
      query: (args) => ({
        url: `/spa/update_spa_position`,
        method: "PUT",
        data: args,
      }),
    }),
    addPosition: builder.query<gridResponseType[], positionAddRequestType>({
      query: (args) => ({
        url: `/spa/add_spa_position`,
        method: "POST",
        data: args,
      }),
    }),
    discardPortfolio: builder.query<any, discardPortfolioRequestType>({
      query: (args) => ({
        url: `/spa/delete_spa_positions`,
        method: "DELETE",
        data: args,
      }),
    }),
    deletePortfolio: builder.query<
      gridResponseType[],
      discardPortfolioRequestType
    >({
      query: (args) => ({
        url: `/spa/delete_spa_positions`,
        method: "DELETE",
        data: args,
      }),
    }),
    savePortfolio: builder.query<
      portfolioSaveResponsetype,
      portfolioSaveRequestType
    >({
      query: (args) => ({
        url: `/spa/save_spa_portfolio`,
        method: "POST",
        data: args,
      }),
    }),
    calculatePortfolio: builder.query<
      calculatePortfolioResponseType,
      calculatePortfolioRequestType
    >({
      query: (args) => ({
        url: `/spa/calculate_spa_var`,
        method: "POST",
        data: args,
      }),
    }),
    getPortfolioStatus: builder.query<
      portfoliStatusResponseType,
      portfoliStatusRequestType
    >({
      query: (args) => ({
        url: `/spa/get_spa_status?${stringify(args)}`,
        method: "GET",
      }),
    }),
    getDatacards: builder.query<dataCardsResponseType[], dataCardsRequestType>({
      query: (args) => ({
        url: `/spa/get_spa_results_datacards?${stringify(args)}`,
        method: "GET",
      }),
    }),
    updateDataCards: builder.query<any, any>({
      query: (args) => ({
        url: `/spa/update_spa_cardsconfig`,
        method: "POST",
        data: args,
      }),
    }),
    getResultsTableData: builder.query<
      resultDataTableResponseType[],
      dataCardsRequestType
    >({
      query: (args) => ({
        url: `/spa/get_spa_results_datagrid?${stringify(args)}`,
        method: "GET",
      }),
    }),
    getPortfolioSavedStatus: builder.query<
      portfolioStatusResponseType,
      portfolioStatusRequestType
    >({
      query: (args) => ({
        url: `/spa/get_spa_save_status?${stringify(args)}`,
        method: "GET",
      }),
    }),
  }),
});

export const {
  useLazyPortfoliosetupDataQuery,
  usePortfoliosetupDataQuery,
  useLazyGetPortfolioListQuery,
  useGetPortfolioListQuery,
  useLazyGetBatchListQuery,
  useGetBatchListQuery,
  useLazyGetBatchPositionQuery,
  useGetBatchPositionQuery,
  useLazyGetGridPortfolioPositionByIdQuery,
  useGetGridPortfolioPositionByIdQuery,
  useLazyGetLatestGridPositionQuery,
  useGetLatestGridPositionQuery,
  useLazyGetGridPortfolioPositionByLeIdQuery,
  useGetGridPortfolioPositionByLeIdQuery,
  useLazyUpdatePositionQuery,
  useUpdatePositionQuery,
  useLazyAddPositionQuery,
  useAddPositionQuery,
  useLazyDiscardPortfolioQuery,
  useDiscardPortfolioQuery,
  useLazyDeletePortfolioQuery,
  useDeletePortfolioQuery,
  useLazySavePortfolioQuery,
  useSavePortfolioQuery,
  useLazyCalculatePortfolioQuery,
  useLazyGetPortfolioStatusQuery,
  useLazyGetDatacardsQuery,
  useLazyUpdateDataCardsQuery,
  useLazyGetResultsTableDataQuery,
  useLazyGetPortfolioSavedStatusQuery,
} = portfolioSetupSlice;
