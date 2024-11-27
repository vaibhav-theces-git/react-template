import {
  BatchPeriodMeasure,
  BatchRunMeasure,
  BatchVarResponseType,
} from "src/types/batchConfigurationTypes";

export type BatchEditModes = "new" | "edit" | "clone";
export const periodMeasures: BatchPeriodMeasure[] = [
  {
    id: 1,
    measure: "Days",
  },
  {
    id: 2,
    measure: "Weeks",
  },
  {
    id: 3,
    measure: "Months",
  },
  {
    id: 4,
    measure: "Years",
  },
];
export const runDaysMeasures: BatchRunMeasure[] = [
  {
    id: 1,
    measure: "Sun",
  },
  {
    id: 2,
    measure: "Mon",
  },
  {
    id: 3,
    measure: "Tue",
  },
  {
    id: 4,
    measure: "Wed",
  },
  {
    id: 5,
    measure: "Thu",
  },
  {
    id: 6,
    measure: "Fri",
  },
  {
    id: 7,
    measure: "Sat",
  },
];
export const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: 200,
    },
  },
};

export const varLevels: BatchVarResponseType[] = [
  {
    name: "VAR95",
    value: "95%",
  },
  {
    name: "VAR99",
    value: "99%",
  },
  {
    name: "VAR100",
    value: "100%",
  },
];

export const pattern = /^\s+|\s+$/g;
