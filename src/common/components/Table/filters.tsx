/* eslint-disable max-lines */
/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable react/jsx-props-no-spreading */
import { FilterProps } from "react-table";
// import MuiDateTimePicker from "src/common/components/datePicker/MuiDatePicker";
import {
  MuiInputAdornment,
  MuiOutlinedInput,
  MuiTextField,
} from "src/common/components/input/MuiInputs";
import IconButton from "@mui/material/IconButton";
import SearchIcon from "@mui/icons-material/Search";
import { MuiBox } from "src/common/components/box/MuiBox";
import { MuiCheckbox } from "src/common/components/checkbox/MuiCheckbox";
import { MuiFormControlLabel } from "src/common/components/form/MuiForms";
import {
  FormControlLabelProps,
  InputAdornmentProps,
  OutlinedInputProps,
  TooltipProps,
  TextFieldProps,
  AutocompleteProps,
  AutocompleteValue,
  AutocompleteChangeReason,
  AutocompleteChangeDetails,
} from "@mui/material";
import MuiTooltip from "../tooltip/MuiTooltip";
import { MuiAutocomplete } from "../autocomplete/MuiAutocomplete";
// import FXDateTimeRangePicker from "../dateTimeRangePicker/FXDateTimeRangePicker";
// import { DateFilterValueType } from "./types";

const getLabel = (
  label: string,
  toolTipText?: string,
  toolTipPlacement?: TooltipProps["placement"]
) => {
  if (!toolTipText) {
    return label;
  }
  return (
    <MuiTooltip placement={toolTipPlacement} title={toolTipText} arrow>
      <span>{label}</span>
    </MuiTooltip>
  );
};

export const CheckBoxFilter =
  (
    label: string,
    labelPlacement: FormControlLabelProps["labelPlacement"],
    toolTipText?: string,
    toolTipPlacement?: TooltipProps["placement"]
  ) =>
  <D extends object>({
    column: { setFilter },
    gotoPage,
    state,
  }: FilterProps<D>) => {
    return (
      <MuiBox className="tw-pl-8">
        <MuiFormControlLabel
          control={
            <MuiCheckbox
              onChange={(event) => {
                if (state.pageIndex !== 0) {
                  gotoPage(0);
                }
                setFilter(event.target.checked);
              }}
              disableRipple
            />
          }
          label={getLabel(label, toolTipText, toolTipPlacement)}
          labelPlacement={labelPlacement}
        />
      </MuiBox>
    );
  };

export const TextBoxFilter =
  (
    placeholder: string,
    searchIconPosition?: InputAdornmentProps["position"],
    className?: OutlinedInputProps["className"],
    wrapperClassName?: string
  ) =>
  <D extends object>({
    column: { setFilter },
    gotoPage,
    state,
  }: FilterProps<D>) => {
    return (
      <MuiBox>
        <MuiOutlinedInput
          id="search-by-token"
          onChange={(event) => {
            if (state.pageIndex !== 0) {
              gotoPage(0);
            }
            setFilter(event.target.value);
          }}
          type="text"
          autoComplete="off"
          placeholder={placeholder}
          className={`tw-pl-0 ${className || ""}`}
          wrapperClassName={wrapperClassName || ""}
          {...(searchIconPosition !== undefined
            ? {
                startAdornment: (
                  <MuiInputAdornment
                    position={searchIconPosition}
                    disablePointerEvents
                  >
                    <IconButton>
                      <SearchIcon />
                    </IconButton>
                  </MuiInputAdornment>
                ),
              }
            : {})}
        />
      </MuiBox>
    );
  };

type DateFilterType = {
  onChange: (dateData: {
    startDate: Date | null | string;
    endDate: Date | null | string;
  }) => void;
  value: { startDate: Date | null | string; endDate: Date | null | string };
};

export const FilterDateComponent = (props: DateFilterType) => {
  const { onChange, value } = props;
  let startDate: Date | null | string = "";
  let endDate: Date | null | string = "";

  startDate = value ? value.startDate : "";
  endDate = value ? value.endDate : "";

  const handleDateChange = (date: Date | null, field: string) => {
    if (field === "startDate" && endDate) {
      onChange({ startDate: date, endDate });
    } else if (field === "endDate" && startDate) {
      onChange({ startDate, endDate: date });
    } else {
      onChange({
        startDate: field === "startDate" ? date : startDate,
        endDate: field === "endDate" ? date : endDate,
      });
    }
  };

  return (
    <div className="tw-flex">
      {/* <div className="tw-mr-2">
        <MuiDateTimePicker
          value={value.startDate || null}
          maxDateTime={value.endDate || null}
          onChange={(date: Date) => handleDateChange(date as Date, "startDate")}
          renderInput={(params: JSX.IntrinsicAttributes & TextFieldProps) => (
            <MuiTextField
              {...params}
              className="lg:tw-w-56 xl:tw-w-64 datefieldFilter"
              label="Start Time"
              size="small"
            />
          )}
          className="tw-mr-2 tw-mt-2"
        />
      </div> */}
      {/* <div className="tw-mr-2">
        <MuiDateTimePicker
          minDateTime={value.startDate || null}
          value={value.endDate || null}
          onChange={(date: Date) => handleDateChange(date as Date, "endDate")}
          renderInput={(params: JSX.IntrinsicAttributes & TextFieldProps) => (
            <MuiTextField
              {...params}
              className="lg:tw-w-56 xl:tw-w-64 datefieldFilter"
              label="End Time"
              size="small"
            />
          )}
          className="tw-mr-2 tw-mt-2"
        />
      </div> */}
    </div>
  );
};

export type FilterDropdownProps<
  F,
  T,
  M extends boolean | undefined,
  D extends boolean | undefined
> = {
  filterProps: F;
  options: T[];
  label: string;
  placeholder?: string;
  dataTestId?: string;
  wrapperClassName?: string;
  accessor?: keyof T;
  onChange?: (
    event: React.SyntheticEvent<Element, Event>,
    value: AutocompleteValue<T, M, D, any>,
    reason: AutocompleteChangeReason,
    filterProps: F,
    details?: AutocompleteChangeDetails<T> | undefined
  ) => void;
  autoCompleteProps?: Omit<
    AutocompleteProps<T, M, D, any>,
    "options" | "renderInput" | "onChange"
  >;
  textFieldProps?: Omit<TextFieldProps, "label">;
};

export type AutoCompleteFilterOption = {
  value: string | number;
  label: string;
};

const findOptionLabel = (option: AutoCompleteFilterOption | string) => {
  if (typeof option === "string") {
    return option;
  }
  return option?.label;
};

export const FilterDropdown = <F extends object>({
  filterProps,
  options,
  dataTestId,
  label,
  wrapperClassName = "",
  onChange,
  autoCompleteProps,
  textFieldProps,
  placeholder,
}: // accessor,
FilterDropdownProps<
  FilterProps<F>,
  AutoCompleteFilterOption | string | any,
  boolean | undefined,
  boolean | undefined
>) => {
  const filter = filterProps.state.filters.find(
    (f) => f.id === filterProps.column.id
  );
  return (
    <div className={wrapperClassName}>
      <MuiAutocomplete
        {...autoCompleteProps}
        size="small"
        key={`filter-dropdown-${label}`}
        id={`filter-dropdown-${label}`}
        options={options}
        autoComplete
        value={filter?.value || null}
        multiple={false as boolean | undefined}
        data-testid={dataTestId}
        getOptionLabel={autoCompleteProps?.getOptionLabel || findOptionLabel}
        isOptionEqualToValue={
          autoCompleteProps?.isOptionEqualToValue
            ? autoCompleteProps?.isOptionEqualToValue
            : (option, value) => option === value
        }
        onChange={(event, newValue, reason, details) => {
          if (onChange) {
            onChange(event, newValue, reason, filterProps, details);
          } else {
            filterProps.column.setFilter(newValue);
          }
        }}
        renderInput={(params) => (
          <MuiTextField
            {...params}
            label={label}
            {...textFieldProps}
            placeholder={placeholder}
          />
        )}
      />
    </div>
  );
};

type FilterData = Omit<
  FilterDropdownProps<
    any,
    AutoCompleteFilterOption | string | any,
    boolean | undefined,
    boolean | undefined
  >,
  "filterProps"
>;

export const dropDownFilter = (
  params: FilterData,
  transform?: (
    arr: FilterData["options"]
  ) => (AutoCompleteFilterOption | string | any)[]
) => {
  const { options, wrapperClassName = "tw-w-32", ...rest } = params;
  const newArray = transform ? transform(options) : options;
  return <D extends object>(props: FilterProps<D>) => (
    <FilterDropdown
      wrapperClassName={wrapperClassName}
      filterProps={props}
      options={newArray}
      {...rest}
    />
  );
};

export const DateRangePickerFilter = <D extends object>({
  setFilter,
  column,
}: FilterProps<D>) => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const { filterValue } = column;
  const onChange = (startDate: Date | null, endDate: Date | null) => {
    // const value: DateFilterValueType = {
    //   t_start: startDate,
    //   t_end: endDate,
    // };
    // setFilter(column.id, value);
    setFilter(column.id, null);
  };

  return (
    <div></div>
    // <FXDateTimeRangePicker
    //   onChange={onChange}
    //   // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
    //   initialEndDate={filterValue?.t_end}
    //   // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
    //   initialStartDate={filterValue?.t_start}
    // />
  );
};
