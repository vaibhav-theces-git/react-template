import { Row } from "react-table";

const compareBasic = <T extends number | string>(a: T, b: T) =>
  a === b ? 0 : a > b ? 1 : -1;

const getRowValueByColumnID = (row: Row, columnId: string): unknown => {
  return row.values[columnId];
};

/**
 * Sort strings by ignoring case
 * For with case , basic should be able to handle it
 * @param rowA
 * @param rowB
 * @param columnId
 * @returns boolean
 */
export const sortStringWithoutCase = (
  rowA: Row,
  rowB: Row,
  columnId: string
) => {
  let a = getRowValueByColumnID(rowA, columnId) as string | null | undefined;
  let b = getRowValueByColumnID(rowB, columnId) as string | null | undefined;
  // Handle null or undefined
  a = (a || "").toLowerCase();
  b = (b || "").toLowerCase();
  return compareBasic(a, b);
};

export const sortUserNameObjectWithoutCase = (
  rowA: Row,
  rowB: Row,
  columnId: string
) => {
  const a = getRowValueByColumnID(rowA, columnId) as {
    first_name: string;
    last_name: string;
  };
  const b = getRowValueByColumnID(rowB, columnId) as {
    first_name: string;
    last_name: string;
  };
  const fullName = ({
    first_name,
    last_name,
  }: {
    first_name: string;
    last_name: string;
  }) => `${first_name} ${last_name}`;
  // Handle null or undefined
  const userA = (fullName(a) || "").toLowerCase();
  const userB = (fullName(b) || "").toLowerCase();
  return compareBasic(userA, userB);
};

export const sortNumbers = (rowA: Row, rowB: Row, columnId: string) => {
  let a = getRowValueByColumnID(rowA, columnId) as number | null | undefined;
  let b = getRowValueByColumnID(rowB, columnId) as number | null | undefined;

  a = Number(a || 0);
  b = Number(b || 0);
  return compareBasic(a, b);
};

export const sortAbsoluteNumbers = (rowA: Row, rowB: Row, columnId: string) => {
  let a = getRowValueByColumnID(rowA, columnId) as number | null | undefined;
  let b = getRowValueByColumnID(rowB, columnId) as number | null | undefined;

  a = Number(a || 0);
  b = Number(b || 0);
  return compareBasic(Math.abs(a), Math.abs(b));
};

export const sortDate = <D extends object>(
  rowA: Row<D>,
  rowB: Row<D>,
  columnId: string
) => {
  const dateA = rowA.values[columnId] as string;
  const dateB = rowB.values[columnId] as string;
  const a = new Date(dateA);
  const b = new Date(dateB);
  if (a.getTime() < b.getTime()) {
    return -1;
  }
  if (a.getTime() > b.getTime()) {
    return 1;
  }
  return 0;
};
