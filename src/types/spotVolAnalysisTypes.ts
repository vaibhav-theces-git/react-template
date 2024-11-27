export type spotVolResponse = {
  columns: number[];
  data: spotVolResponseData[];
  index: number[];
};

export type spotVolResponseData = {
  firstColumn: string;
  "-25": number;
  "-20": number;
  "-15": number;
  "-10": number;
  "-5": number;
  "0": number;
  "5": number;
  "10": number;
  "15": number;
  "20": number;
  "25": number;
};

export type spotVolAnalysisV1Request = {
  run_id: number;
  metrics_sub_type: string;
  display_type: string;
};

export type spotVolPortfolioRequest = {
  run_date: string;
};

export type spotVolPortfolioResponse = {
  batch_id: number;
  portfolio_name: string;
  run_id: number;
};

export type spotVolShiftTypesRequest = {
  run_id: number;
  change_type: string;
};

export type spotVolAnalysisV2Request = {
  run_id: number;
  change_type: string;
  shift_type: string;
  display_type: string;
};
