export type AggregationResponseType = {
  agg_id: number;
  agg_name: string;
};

export type AggregationRequestType = {
  run_id: number;
};

export type HierarchyLevel =
  | "LegalEntity|Account|Symbol|Position"
  | "LegalEntity|Account|Position"
  | "LegalEntity|Symbol|Position"
  | "Symbol|Position";
