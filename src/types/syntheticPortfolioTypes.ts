export type newPortfolioNameRequestType = {
  portfolio_name: string;
  portfolio_status: string;
};

export type newPortfolioNameResponseType = {
  group_id: number;
  portfolio_id: number;
  portfolio_name: string;
  message: string;
  status: string;
};

export type portfolioListRequestType = {
  type: string;
};

export type portfolioListResponseType = {
  created_date: string;
  portfolio_id: number;
  portfolio_name: string;
  portfolio_details: any;
};

export type batchListResponseType = {
  audit_batch_id: number;
  portfolio_id: number;
  portfolio_name: string;
  portfolio_details: any;
};

export type gridPortfolioRequestType = {
  portfolio_id: number;
};

export type gridPortfolioByLeIdRequestType = {
  portfolio_id: number;
  le_accounts: any;
  group_id: number;
};

export type gridResponseType = {
  position_key: number;
  run_id: number;
  legal_entity_name: string;
  account_name: string;
  instrument_name: string;
  symbol_pair: string;
  quantity: number;
  maturity_date: string;
  instrument_type: string;
  exchange: number | null;
  strike: number;
  und_type: string;
  und_price: number | null;
  option_type: string;
  dollar_delta: number | null;
  dollar_gamma: number | null;
  dollar_theta: number | null;
  dollar_vega: number | null;
  imp_vol: number | null;
  is_pos_valid: boolean;
  error_codes: number | null;
  t_create: string;
  t_update: string;
};

export type gridPortfolioResponseType = {
  portfolio_id: number;
  portfolio_name: string;
  positions: gridResponseType[];
  record_id: number;
  status: string;
};

export type discardPortfolioRequestType = {
  portfolio_id: number;
  group_id: number;
};

export type deletePositionRequestType = {
  portfolio_id: number;
  group_id: number;
  position_keys: any;
};

export type positionEditRequestType = {
  position_key: number;
  run_id: number;
  instrument_type: string | undefined;
  quantity: string | null;
  Strike: number | null;
  Option_type: string | undefined;
  Symbol_pair: string | undefined;
  Und_type: string | undefined;
  maturity_date: string | undefined;
  group_id: number;
};

export type positionAddRequestType = {
  run_id: number;
  group_id: number;
  instrument_type: string | undefined;
  quantity: string;
  Strike: number | null;
  Option_type: string | undefined;
  Symbol_pair: string | undefined;
  Und_type: string | undefined;
  maturity_date: string | undefined;
};

export type batchPositionsRequestType = {
  portfolio_name: string | undefined;
  portfolio_details: any;
};

export type batchPositionsResponseType = {
  positions: gridResponseType[];
  portfolio_id: number;
  portfolio_name: string;
  group_id: number;
  status: string;
};

export type portfolioSaveRequestType = {
  portfolio_id: number;
  group_id: number;
  portfolio_name: string;
  over_write_flag: string;
};

export type portfolioSaveResponsetype = {
  portfolio_id: number;
  group_id: number;
  portfolio_name: string;
  status: string;
  positions: gridResponseType[];
};

export type calculatePortfolioRequestType = {
  portfolio_id: number;
  group_id: number;
};
export type calculatePortfolioResponseType = {
  message: string;
};

export type portfoliStatusRequestType = {
  portfolio_id: number;
};
export type dataCardsRequestType = {
  portfolio_id: number;
};
export type portfoliStatusResponseType = {
  status: string;
};

export type dataCardsResponseType = {
  backgroundColor: string;
  cardId: number;
  isSelected: boolean;
  seq_number: number;
  title: string;
  value: number;
};
export type resultDataTableResponseType = {
  VAR95: number;
  VAR99: number;
  VAR100: number;
  dollar_delta: number;
  dollar_theta: number;
  dollar_gamma: number;
  dollar_vega: number;
  error_codes: string;
  implied_vol: number;
  instrument_name: string;
  instrument_type: string;
  is_pos_valid: boolean;
  position_key: number;
  position_price: number;
  quantity: number;
  und_price: number;
};

export type portfolioStatusRequestType = {
  portfolio_id: number;
};
export type portfolioStatusResponseType = {
  status: boolean;
};
