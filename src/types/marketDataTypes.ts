export type MarketDataType = {
  symbol: string;
  series: string[];
  start_date: string;
  end_date: string;
}[];

export type ShowMarketDataRequestType = {
  symbol: string | undefined;
  series_type: string;
  start_date: string | null;
  end_date: string | null;
};
export type ShowMarketDataResponseType = {
  date: string;
  dimension_id: number;
  maturity_date: string;
  override_price: number;
  price: number;
  risk_factor_id: number;
  flag: string;
};

export type OverridePriceRequestType = {
  date: string;
  dimension_id: number;
  maturity_date: string;
  override_price: number;
  price: number;
  risk_factor_id: number;
};
