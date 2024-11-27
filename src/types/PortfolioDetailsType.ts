export type PortfolioDetailResponseType = {
  account_id: string;
  contract_price: number;
  error_codes: string;
  instrument_type: string;
  legal_entity: string;
  maturity_date: null;
  pos_datetime: number;
  position_key: number;
  position_price: number;
  quantity: number;
  sec_key: number;
  symbol_pair: string;
  und_price: number;
  instrument_name: string;
};
export type PortfolioDetailRequestType = {
  run_id: number;
};
