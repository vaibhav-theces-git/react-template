export type BatchListResponseType = {
  agg_heirarchy_types: BatchAggregationResponseType[];
  batch_created: string;
  batch_id: number;
  run_batch_id: number;
  is_critical: boolean;
  is_disabled: boolean;
  batch_name: string;
  history_days: number;
  last_run_date: string;
  num_of_runs: number;
  portfolio_details: {
    portfolio: LegalEntity[];
  };
  request_type: string;
  risk_measure_types: BatchVarResponseType[];
  run_time: string;
  scenario_gap: number;
  schedule_flag: boolean;
  task_ended: string;
  task_started: string;
  task_status: string;
  period_start_date: string;
  period_end_date: string;
  period_no: number;
  period_type: string;
  run_days: string;
  spotvol_scenarios: SpotvolScenarios;
  batch_type: string;
  vbt_start_date: string;
  vbt_end_date: string;
  scheduled_start_time: string;
  var_gapping: number;
  success_failure_status: string;
  error_message: string;
};

export type batchListRequestType = {
  is_disabled: boolean;
};
export type BatchConfiguration = {
  batch_id: number;
  is_critical: boolean;
  scheduled_flag: boolean;
  scheduled_start_time: string;
  scheduled_run_days: string;
  batch_type: string;
  request_type: string;
  var_gapping: number;
  period_type: string;
  period_no: number;
  period_start_date: string;
  period_end_date: string;
  vbt_flag: boolean;
  vbt_start_date: string;
  vbt_end_date: string;
  spotvol_scenarios: SpotvolScenarios | null;
  var_levels: BatchVarResponseType[];
  agg_heirarchy: BatchAggregationResponseType[];
  batch_name: string;
  le_accounts: LegalEntityPostType[];
};

export type LegalEntity = {
  le_id: string;
  name: string;
  excluded_accts: LegelEntityAccountType[];
};

export type LegalEntityPostType = {
  le_id: string;
  excluded_accts: LegelEntityAccountType[];
};

export type LegelEntityIdsNamesResponseType = {
  le_id: string;
  name: string;
};

export type LegelEntityAccountType = {
  acc_id: string;
  name: string;
};

export type LegelEntityAccountResponseType = {
  account_ids: LegelEntityAccountType[];
  le_id: string;
};

export type BatchAggregationResponseType = {
  name: string;
  value: string;
};

export type BatchVarResponseType = {
  name: string;
  value: string;
};

export type BatchPeriodMeasure = {
  id: number;
  measure: string;
};

export type BatchRunMeasure = {
  id: number;
  measure: string;
};

export type BatchRunRequestType = {
  batch_ids: number[];
  run_batch_id: number[];
};

export type BatchDisableRequestType = {
  batch_id: number;
  audit_batch_id: number;
  is_disabled: boolean;
};

export type SpotvolScenarios = {
  spot_grid: number[] | null;
  vol_grid: number[] | null;
  scenario_metrics: ScenarioMetrics[] | null;
};

export type ScenarioGrid = {
  spotvol: string;
  n5: number;
  n4: number;
  n3: number;
  n2: number;
  n1: number;
  zero: number;
  p1: number;
  p2: number;
  p3: number;
  p4: number;
  p5: number;
};

export type ScenarioMetrics = {
  greeks: boolean;
  market_value: boolean;
  var: boolean;
};
