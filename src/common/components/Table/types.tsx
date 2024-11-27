// import { Nullable } from "src/midasv2/types/utils";
import { Column } from "react-table";

// export type DateFilterValueType = {
//   t_end: Nullable<Date>;
//   t_start: Nullable<Date>;
// };

// export type DateFilter = {
//   id: string;
//   value: DateFilterValueType;
// };

export type HidableColumn<D extends object> = Column<D> & {
  show?: boolean;
};
