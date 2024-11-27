export type MissingPricesResponseType = {
  id: number;
  missing_count: number;
  missing_dates: string[];
  run_id: number;
  status: string;
  symbol: string;
};

export type MissingPricesRequestType = {
  run_id: number;
};
