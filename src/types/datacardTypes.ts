export type DataCardResponseType = {
  cardId: number;
  title: string;
  seq_number: number;
  value: string;
  isSelected: boolean;
  backgroundColor: string;
};

export type DataCardRequestType = {
  run_id: number;
};

export type DynamicCardRequestType = {
  title: string;
  cardId: number;
};
