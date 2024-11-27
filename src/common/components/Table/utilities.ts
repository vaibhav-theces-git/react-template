import { Filters } from "react-table";
import { AutoCompleteFilterOption } from "src/common/components/Table/filters";

/**
 * Converts array of table filtes to o
 * @param filtered   Filters data for the table - array of filters
 * @returns simple object with key value, might be suitable for general cases , but not suitable for complex cases
 */
export const generateParamsForFilters = (
  filtered: Filters<Record<string, string>>
) => {
  return filtered.reduce(
    (acc, cv: { id: string; value: string | AutoCompleteFilterOption }) => {
      if (cv.value === null) {
        return acc;
      }
      if (typeof cv.value === "string") {
        return { ...acc, [cv.id]: cv.value.toLowerCase() };
      }

      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      return { ...acc, [cv.id]: cv.value?.value };
    },
    {}
  );
};
