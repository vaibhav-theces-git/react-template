export const SETUPTYPE = {
  NEW: "new",
  EXISTING: "existing",
  BATCH: "batch",
};

export const undTypes = ["SPOT", "FUTURE"];
export const optionType = ["CALL", "PUT"];
export const instrumentTypes = [
  " SPOT",
  "PERPETUAL",
  "NDFPERP",
  "FUTURE",
  "NDFDATED",
  "OPTION",
  "BINARYOPTION",
];
export const supportedInstrumentTypes = [
  "future",
  "ndfdated",
  "option",
  "binaryoption",
];
export const supportedSOUTypes = ["option", "binaryoption"];

export const POSITION_MODES = {
  ADD: "add",
  EDIT: "edit",
};

export const JOB_STATUS = {
  WORKING: "working",
};

export const PORTFOLIO_STATUS = {
  RESULT: "Results available",
  FAILED: "Failed",
};
