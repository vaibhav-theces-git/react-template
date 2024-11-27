import {
  ScenarioGrid,
  SpotvolScenarios,
} from "src/types/batchConfigurationTypes";

export const spotVolGridCRequestConversion = (
  selectedSpotVolGrid: ScenarioGrid[] | null,
  type: string
) => {
  const record: ScenarioGrid = selectedSpotVolGrid
    ?.filter((spot) => spot.spotvol === type)
    ?.at(0) as ScenarioGrid;

  return [
    record.n5,
    record.n4,
    record.n3,
    record.n2,
    record.n1,
    record.zero,
    record.p1,
    record.p2,
    record.p3,
    record.p4,
    record.p5,
  ];
};

export const spotVolGridResponseConversion = (
  spotVolData: SpotvolScenarios
) => {
  const grid = [] as ScenarioGrid[];
  let spot: ScenarioGrid | null;
  let vol: ScenarioGrid | null;
  if (
    spotVolData &&
    spotVolData.spot_grid !== null &&
    spotVolData.vol_grid !== null
  ) {
    spot = {
      spotvol: "spot",
      n5: spotVolData.spot_grid[0],
      n4: spotVolData.spot_grid[1],
      n3: spotVolData.spot_grid[2],
      n2: spotVolData.spot_grid[3],
      n1: spotVolData.spot_grid[4],
      zero: spotVolData.spot_grid[5],
      p1: spotVolData.spot_grid[6],
      p2: spotVolData.spot_grid[7],
      p3: spotVolData.spot_grid[8],
      p4: spotVolData.spot_grid[9],
      p5: spotVolData.spot_grid[10],
    };
    vol = {
      spotvol: "vol",
      n5: spotVolData.vol_grid[0],
      n4: spotVolData.vol_grid[1],
      n3: spotVolData.vol_grid[2],
      n2: spotVolData.vol_grid[3],
      n1: spotVolData.vol_grid[4],
      zero: spotVolData.vol_grid[5],
      p1: spotVolData.vol_grid[6],
      p2: spotVolData.vol_grid[7],
      p3: spotVolData.vol_grid[8],
      p4: spotVolData.vol_grid[9],
      p5: spotVolData.vol_grid[10],
    };
    grid.push(spot, vol);
  }
  return grid;
};
