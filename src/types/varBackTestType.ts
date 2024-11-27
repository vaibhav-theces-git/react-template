export type varBackTestPortfolioResponseType = {
  batch_id: number;
  portfolio_name: string;
  run_id: number;
};

export type varBackTestDataRequestType = {
  batch_id: number;
};
export type varBackTestDataResponseType = {
  daily_pnl: string;
  date: string;
  var_95_left: string;
  var_95_right: string;
  var_99_left: string;
  var_99_right: string;
  breach_95: string;
  breach_99: string;
};
