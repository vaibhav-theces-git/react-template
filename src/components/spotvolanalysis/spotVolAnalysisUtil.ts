import { ColDef } from "ag-grid-enterprise";
import {
  spotVolResponse,
  spotVolResponseData,
} from "src/types/spotVolAnalysisTypes";
import { SpotVolRange, SpotVolViewTypes } from "./spotVolAnalysisContants";

const prepareRanges = (gridData: spotVolResponseData[]) => {
  let largest = Number.NEGATIVE_INFINITY;
  let smallest = Number.POSITIVE_INFINITY;
  let adder = 0;
  const spotVolRanges: SpotVolRange[] = [];
  const colors = [
    "#fa1b02",
    "#fa3d28",
    "#fc5744",
    "#fa8c7f",
    "#f79a8f",
    "#cad147",
    "#c4cc31",
    "#b2ba1e",
    "#9ea611",
    "#8e9603",
    "#4e9c56",
    "#3b9c45",
    "#289c34",
    "#169e24",
    "#029e12",
  ];
  gridData.forEach((item: spotVolResponseData) => {
    Object.values(item).forEach((value: string | number) => {
      const num = parseInt(value.toString().replace(/,/g, ""), 10);
      largest = Math.max(largest, num);
      smallest = Math.min(smallest, num);
    });
  });

  adder = Math.round((largest - smallest) / 15);
  let min = smallest;

  for (let i = 0; i < 15; i += 1) {
    const max = min + adder;
    const color = colors[i];
    spotVolRanges.push({ min, max, color });
    min = max + 1;
  }
  return spotVolRanges;
};

const getCellStyle =
  (spotVolRanges: SpotVolRange[]) => (param: { value: string }) => {
    const cellValue = parseInt(param?.value?.replaceAll(",", ""), 10);
    const cellStyle = { backgroundColor: "" };
    const spotVolRange = spotVolRanges.find(
      (range) => cellValue >= range.min && cellValue <= range.max
    );
    if (spotVolRange) {
      cellStyle.backgroundColor = spotVolRange.color;
    }
    return cellStyle;
  };

export const getSpotVolGridColDef = (
  spotVol: spotVolResponse,
  viewType: string
) => {
  const cols: ColDef[] = [];
  if (spotVol && spotVol.columns && spotVol.columns.length > 0) {
    const spotVolRanges: SpotVolRange[] = prepareRanges(spotVol.data);

    const firstCol: ColDef = {
      field: "firstColumn",
      headerName: "",
      type: "text",
      minWidth: 50,
      maxWidth: 150,
      cellStyle: { background: "#202739" },
      flex: 1,
      headerClass: "tw-text-center",
      cellClass: "tw-text-center",
    };
    cols.push(firstCol);

    spotVol?.columns
      ?.map((x: number) => {
        return {
          field: x.toString(),
          headerName: x.toString(),
          type: "numericColumn",
          flex: 1,
          headerClass: "text-center",
          cellClass: "tw-text-center",
          cellStyle:
            viewType === SpotVolViewTypes.View1
              ? getCellStyle(spotVolRanges)
              : undefined,
        };
      })
      ?.map((x) => cols.push(x));
  }
  return cols;
};

export const getSpotVolGridTransformedData = (spotVol: spotVolResponse) => {
  const gridData = spotVol?.data?.map((dataItem: spotVolResponseData) => {
    return {
      firstColumn: "",
      "-25": dataItem["-25"],
      "-20": dataItem["-20"],
      "-15": dataItem["-15"],
      "-10": dataItem["-10"],
      "-5": dataItem["-5"],
      "0": dataItem["0"],
      "5": dataItem["5"],
      "10": dataItem["10"],
      "15": dataItem["15"],
      "20": dataItem["20"],
      "25": dataItem["25"],
    };
  });

  for (let index = 0; index < spotVol?.index?.length; index += 1) {
    gridData[index].firstColumn = spotVol.index[index].toString();
  }

  return gridData;
};
