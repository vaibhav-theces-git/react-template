export type VarTrendResponseType = {
  date: string;
  VAR100: number;
  VAR95: number;
  VAR99: number;
};

export type VarTrendRequestType = {
  run_id: number;
  bus_date: string;
};
