import React from "react";
import { CellProps } from "react-table";

export const arrayValueFormatter =
  <K, U extends string | number | React.ReactNode>(
    transform: (value: K) => U
  ) =>
  <D extends object>({ value }: CellProps<D, K>) => {
    return <span>{transform(value)}</span>;
  };
