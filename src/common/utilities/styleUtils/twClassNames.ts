import classNames from "classnames";

const prefixedKw = (klassStr: string) =>
  // could be 1 class or multiple space-limited classes
  klassStr
    .split(/\s+/)
    .map((klass) => `tw-${klass}`)
    .join(" ");

export const twClassNames = (...klasses: string[]) =>
  classNames(klasses.map((klassStr: string) => prefixedKw(klassStr)));
