export type VarGridDataResponseType = {
  COB: number;
  Confidence_Levels: string;
  COB_LEFT: number;
  COB_RIGHT: number;
  DOD: number;
  DOD_change_flag: string;
  MOM: number;
  MOM_change_flag: string;
  WOW: number;
  WOW_change_flag: string;
};

export type VarGridDataRequestType = {
  run_id: number;
  bus_date: string;
};
