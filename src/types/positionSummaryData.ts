export type PositionSummaryRequestType = {
  run_id: number;
  agg_id: number;
  bus_date: string;
};

export type PositionSummaryResponseType = {
  agg_level: number;
  legal_entity: string;
  account_id: string;
  symbol_pair: string;
  position_key: number;
  VAR100: number;
  VAR95: number;
  VAR99: number;
  market_value: number;
  quantity: number;
  exchange: string;
  instrument_type: string;
  children: PositionSummaryResponseType[];
  id: any;
};
