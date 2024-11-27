import {
  ScenarioGrid,
  ScenarioMetrics,
} from "src/types/batchConfigurationTypes";

export const matrixData: ScenarioMetrics[] = [
  {
    market_value: true,
    greeks: true,
    var: false,
  },
];
export const spotVoldata: ScenarioGrid[] = [
  {
    spotvol: "spot",
    n5: -25,
    n4: -20,
    n3: -15,
    n2: -10,
    n1: -5,
    zero: 0,
    p1: 5,
    p2: 10,
    p3: 15,
    p4: 20,
    p5: 25,
  },
  {
    spotvol: "vol",
    n5: -25,
    n4: -20,
    n3: -15,
    n2: -10,
    n1: -5,
    zero: 0,
    p1: 5,
    p2: 10,
    p3: 15,
    p4: 20,
    p5: 25,
  },
];
