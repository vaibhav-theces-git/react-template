import React from "react";
import {
  Autocomplete,
  AutocompleteProps,
  createFilterOptions,
  FilterOptionsState,
} from "@mui/material";

export type MuiAutocompleteProps<
  T,
  Multiple extends boolean | undefined,
  DisableClearable extends boolean | undefined,
  FreeSolo extends boolean | undefined
> = AutocompleteProps<T, Multiple, DisableClearable, FreeSolo>;

export const MuiAutocomplete = <
  T,
  Multiple extends boolean | undefined,
  DisableClearable extends boolean | undefined,
  FreeSolo extends boolean | undefined
>(
  props: MuiAutocompleteProps<T, Multiple, DisableClearable, FreeSolo>
) => {
  const { classes, ...otherProps } = props;
  const updatedClasses = {
    ...(classes ?? {}),
    paper: "tw-bg-secondary",
  };
  // eslint-disable-next-line react/jsx-props-no-spreading
  return <Autocomplete {...otherProps} classes={updatedClasses} />;
};

export const muiCreateFilterOptions = createFilterOptions;
export type MuiFilterOptionsState<T> = FilterOptionsState<T>;
