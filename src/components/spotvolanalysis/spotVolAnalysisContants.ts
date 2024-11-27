export enum SpotVolMetricTypes {
  MarketValue = "Market Value",
  Delta = "Delta",
  Gamma = "Gamma",
  Theta = "Theta",
  Vega = "Vega",
  VaR95 = "VaR95",
  VaR99 = "VaR99",
  VaR100 = "VaR100",
}

export enum SpotVolDisplayTypes {
  Actual = "Actual",
  Change = "Change",
}

export enum SpotVolViewTypes {
  View1 = "View1",
  View2 = "View2",
}

export type SpotVolRange = {
  min: number;
  max: number;
  color: string;
};
