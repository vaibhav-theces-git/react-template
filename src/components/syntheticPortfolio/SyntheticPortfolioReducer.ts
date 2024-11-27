import { GridApi } from "ag-grid-enterprise";
import {
  batchListResponseType,
  gridResponseType,
  newPortfolioNameResponseType,
  portfolioListResponseType,
  portfoliStatusResponseType,
} from "src/types/syntheticPortfolioTypes";

export type SyntheticPortfolioState = {
  currentTabIndex: number;
  optionValue: number | null;
  isSetupPortfolioOpen: boolean;
  isSelectAccountOpen: boolean;
  isPortfolioEditOpen: boolean;
  isDiscardModalOpen: boolean;
  newPortfolioName: string;
  porfolioRespName: newPortfolioNameResponseType | undefined;
  existingPortfolioList: portfolioListResponseType[] | undefined;
  batchList: batchListResponseType[] | undefined;
  selectedExistingPortfolioId: number;
  selectedExistingPortfolio: string;
  selectedGridPortfolio: gridResponseType[] | undefined;
  gridPositionsData: gridResponseType[] | undefined;
  groupId: number;
  selectedBatch: portfolioListResponseType | batchListResponseType | undefined;
  jobStatus: portfoliStatusResponseType | undefined;
  mode: string;
  gridApi: GridApi | null;
};

export type SyntheticPortfolioAction =
  | { type: "SET_CURRENT_TAB_INDEX"; payload: number }
  | { type: "SET_OPTION_VALUE"; payload: number | null }
  | { type: "SET_IS_SETUP_PORTFOLIO_OPEN"; payload: boolean }
  | { type: "SET_IS_SELECT_ACCOUNT_OPEN"; payload: boolean }
  | { type: "SET_IS_PORTFOLIO_EDIT_OPEN"; payload: boolean }
  | { type: "SET_IS_DISCARD_MODAL_OPEN"; payload: boolean }
  | { type: "SET_NEW_PORTFOLIO_NAME"; payload: string }
  | {
      type: "SET_PORFOLIO_RESP_NAME";
      payload: newPortfolioNameResponseType | undefined;
    }
  | {
      type: "SET_EXISTING_PORTFOLIO_LIST";
      payload: portfolioListResponseType[] | undefined;
    }
  | { type: "SET_BATCH_LIST"; payload: batchListResponseType[] | undefined }
  | { type: "SET_SELECTED_EXISTING_PORTFOLIO_ID"; payload: number }
  | { type: "SET_SELECTED_EXISTING_PORTFOLIO"; payload: string }
  | {
      type: "SET_SELECTED_GRID_PORTFOLIO";
      payload: gridResponseType[] | undefined;
    }
  | { type: "SET_GRID_POSITIONS_DATA"; payload: gridResponseType[] | undefined }
  | { type: "SET_GROUP_ID"; payload: number }
  | {
      type: "SET_SELECTED_BATCH";
      payload: portfolioListResponseType | batchListResponseType | undefined;
    }
  | {
      type: "SET_STATUS";
      payload: portfoliStatusResponseType | undefined;
    }
  | {
      type: "SET_MODE";
      payload: string;
    }
  | {
      type: "SET_GRID_API";
      payload: GridApi;
    };

export const syntheticPortfolioreducer = (
  state: SyntheticPortfolioState,
  action: SyntheticPortfolioAction
): SyntheticPortfolioState => {
  switch (action.type) {
    case "SET_CURRENT_TAB_INDEX":
      return { ...state, currentTabIndex: action.payload };
    case "SET_OPTION_VALUE":
      return { ...state, optionValue: action.payload };
    case "SET_IS_SETUP_PORTFOLIO_OPEN":
      return { ...state, isSetupPortfolioOpen: action.payload };
    case "SET_IS_SELECT_ACCOUNT_OPEN":
      return { ...state, isSelectAccountOpen: action.payload };
    case "SET_IS_PORTFOLIO_EDIT_OPEN":
      return { ...state, isPortfolioEditOpen: action.payload };
    case "SET_IS_DISCARD_MODAL_OPEN":
      return { ...state, isDiscardModalOpen: action.payload };
    case "SET_NEW_PORTFOLIO_NAME":
      return { ...state, newPortfolioName: action.payload };
    case "SET_PORFOLIO_RESP_NAME":
      return {
        ...state,
        porfolioRespName: action.payload,
      };
    case "SET_EXISTING_PORTFOLIO_LIST":
      return { ...state, existingPortfolioList: action.payload };
    case "SET_BATCH_LIST":
      return { ...state, batchList: action.payload };
    case "SET_SELECTED_EXISTING_PORTFOLIO_ID":
      return { ...state, selectedExistingPortfolioId: action.payload };
    case "SET_SELECTED_EXISTING_PORTFOLIO":
      return { ...state, selectedExistingPortfolio: action.payload };
    case "SET_SELECTED_GRID_PORTFOLIO":
      return { ...state, selectedGridPortfolio: action.payload };
    case "SET_GRID_POSITIONS_DATA":
      return { ...state, gridPositionsData: action.payload };
    case "SET_GROUP_ID":
      return { ...state, groupId: action.payload };
    case "SET_SELECTED_BATCH":
      return { ...state, selectedBatch: action.payload };
    case "SET_STATUS":
      return { ...state, jobStatus: action.payload };
    case "SET_MODE":
      return { ...state, mode: action.payload };
    case "SET_GRID_API":
      return { ...state, gridApi: action.payload };
    default:
      return state;
  }
};

export const sytheticPortfolioIntialState = {
  currentTabIndex: 0,
  optionValue: null,
  isSetupPortfolioOpen: false,
  isSelectAccountOpen: false,
  isPortfolioEditOpen: false,
  isDiscardModalOpen: false,
  newPortfolioName: "",
  porfolioRespName: undefined,
  existingPortfolioList: [],
  batchList: [],
  selectedExistingPortfolioId: 0,
  selectedExistingPortfolio: "",
  selectedGridPortfolio: undefined,
  gridPositionsData: [],
  groupId: 0,
  selectedBatch: undefined,
  jobStatus: undefined,
  mode: "",
  gridApi: null,
};
