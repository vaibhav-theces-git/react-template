import { SpotvolScenarios } from "./batchConfigurationTypes";
export type RunHistoryRequestType = {
  audit_batch_id: number;
};
export type RunHistoryResponseType = {
  agg_heirarchy_types: string[];
  batch_created: string;
  batch_id: number;
  batch_name: string;
  batch_type: string;
  history_period: string;
  is_critical: boolean;
  is_disabled: boolean;
  period_end_date: string;
  period_start_date: string;
  portfolio_details: PortfolioDetails;
  risk_measure_types: string;
  run_batch_id: number;
  var_gapping: number;
  vbt_end_date: string;
  vbt_flag: boolean;
  vbt_start_date: string;
  spotvol_scenarios: SpotvolScenarios | null;
};

export type PortfolioDetails = {
  portfolio: Portfolio[];
};

export type Portfolio = {
  excluded_accts: ExcludedAccounts[];
  le_id: number;
};

export type ExcludedAccounts = {
  acc_id: number;
  name: string;
};

export type aggregationHierarchyColumn = {
  agg_heirarchy_types: string;
};
export type varConfigurationColumn = {
  risk_measure_types: string;
};
