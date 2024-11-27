import { Radio, RadioGroup, SelectChangeEvent } from "@mui/material";
import dayjs from "dayjs";
import React from "react";
import { MuiBox } from "src/common/components/box/MuiBox";
import MuiDatePicker from "src/common/components/datepicker/MuiDatePicker";
import { MuiFormControlLabel } from "src/common/components/form/MuiForms";
import MuiGrid from "src/common/components/grid/MuiGrid";
import { MuiTextField } from "src/common/components/input/MuiInputs";
import { MuiMenuItem } from "src/common/components/menu/MuiMenu";
import MuiSelect from "src/common/components/select/MuiSelect";
import { MuiTypography } from "src/common/components/typography/MuiTypography/MuiTypography";
import {
  MenuProps,
  periodMeasures,
} from "src/common/utilities/ValidationUtils/batchConfigConstants";
import {
  datePickerProps,
  aggregationHierarchyTextFieldStyle,
} from "src/common/utilities/styleUtils/batchConfigStyles";
import { BatchPeriodMeasure } from "src/types/batchConfigurationTypes";

export interface PeriodCustomSelectionProps {
  isCustomPeriodSelected: boolean;
  IsVarBackTestBatch: boolean;
  handlePeriodChangeCallback: (
    event: React.ChangeEvent<HTMLInputElement>
  ) => void;
  periodValue: string;
  handlePeriodValueChangeCallback: (event: {
    target: { value: string };
  }) => void;
  isPeriodValid: boolean;
  periodMeasure: string;
  handlePeriodMeasureChangeCallback: (
    event: SelectChangeEvent<unknown>
  ) => void;
  holdingPeriodValue: string;
  handleholdingPeriodValueChangeCallback: (event: {
    target: { value: string };
  }) => void;
  handleCustomPeriodCheckBoxChangeCallback: (
    event: React.ChangeEvent<HTMLInputElement>
  ) => void;
  handleStartDateChangeCallback: (date: dayjs.Dayjs | null) => void;
  isHoldingPeriodValid: boolean;
  startDate: dayjs.Dayjs | null;
  handleEndDateChangeCallback: (date: dayjs.Dayjs | null) => void;
  endDate: dayjs.Dayjs | null;
  isValidCustomPeriod: boolean;
}

const PeriodCustomSelection = (
  periodCustomSelectionProps: PeriodCustomSelectionProps
) => {
  const {
    isCustomPeriodSelected,
    IsVarBackTestBatch,
    handlePeriodChangeCallback,
    periodValue,
    handlePeriodValueChangeCallback,
    isPeriodValid,
    periodMeasure,
    handlePeriodMeasureChangeCallback,
    holdingPeriodValue,
    handleholdingPeriodValueChangeCallback,
    handleCustomPeriodCheckBoxChangeCallback,
    handleStartDateChangeCallback,
    isHoldingPeriodValid,
    startDate,
    handleEndDateChangeCallback,
    endDate,
    isValidCustomPeriod,
  } = periodCustomSelectionProps;
  return (
    <MuiBox>
      <MuiGrid
        container
        item
        className="tw-grid lg:tw-grid-cols-2 md:tw-grid-cols-2 sm:tw-grid-cols-1"
      >
        <MuiBox className="tw-flex lg:tw-grid-cols-1 md:tw-grid-cols-1 sm:tw-grid-cols-1">
          <RadioGroup
            aria-labelledby="demo-controlled-radio-buttons-group"
            name="controlled-radio-buttons-group"
            value={!isCustomPeriodSelected}
            onChange={handlePeriodChangeCallback}
            className="tw-mt-1.5 tw-text-sm"
          >
            <MuiFormControlLabel
              value="period"
              control={<Radio checked={!isCustomPeriodSelected} />}
              label={
                <MuiTypography className="tw-text-sm">Period</MuiTypography>
              }
            />
          </RadioGroup>
          <MuiTextField
            value={periodValue}
            disabled={isCustomPeriodSelected}
            onChange={handlePeriodValueChangeCallback}
            sx={aggregationHierarchyTextFieldStyle}
            variant="outlined"
            helperText={
              !isPeriodValid
                ? "Period must be whole number between 3 months and 2 years."
                : ""
            }
            error={!isPeriodValid}
          />
          <MuiSelect
            id="runconfigperioddropdown"
            defaultValue={"Months"}
            value={periodMeasure}
            disabled={isCustomPeriodSelected}
            onChange={handlePeriodMeasureChangeCallback}
            className=" tw-mt-3 tw-ml-4 tw-text-xs tw-text-left"
            MenuProps={MenuProps}
            style={{ height: 30, width: 118 }}
          >
            {periodMeasures &&
              periodMeasures.map((m: BatchPeriodMeasure) => (
                <MuiMenuItem
                  key={m.id}
                  value={m.measure.toLowerCase()}
                  className="tw-text-xs"
                >
                  {m.measure}
                </MuiMenuItem>
              ))}
          </MuiSelect>
        </MuiBox>
        <MuiBox className="tw-flex md:tw-justify-end sm:tw-justify-start  lg:tw-grid-cols-1 md:tw-grid-cols-1 sm:tw-grid-cols-1">
          <MuiTypography className="tw-text-sm tw-mr-3 tw-mt-4 ">
            Holding Period
          </MuiTypography>
          <MuiTextField
            value={holdingPeriodValue}
            onChange={handleholdingPeriodValueChangeCallback}
            datatype="number"
            sx={{
              paddingLeft: "5px",
              marginTop: "12px",
              width: "118px",
              "& .MuiInputBase-root": {
                height: 30,
              },
            }}
            variant="outlined"
            error={!isHoldingPeriodValid}
            helperText={
              !isHoldingPeriodValid
                ? "Value must be whole number between 1-10"
                : ""
            }
          />
          <MuiTypography className="tw-text-sm tw-mr-3 tw-ml-3 tw-mt-4">
            Days
          </MuiTypography>
        </MuiBox>
      </MuiGrid>
      <MuiGrid className="tw-flex lg:tw-grid-cols-1 md:tw-grid-cols-1 sm:tw-grid-cols-1  tw-m-0.5 tw-h-fit tw-w-full">
        <MuiBox>
          <RadioGroup
            aria-labelledby="demo-controlled-radio-buttons-group"
            name="controlled-radio-buttons-group"
            value={isCustomPeriodSelected}
            onChange={handleCustomPeriodCheckBoxChangeCallback}
          >
            <MuiFormControlLabel
              value="Custom"
              control={<Radio checked={isCustomPeriodSelected} />}
              label={
                <MuiTypography
                  className={
                    IsVarBackTestBatch
                      ? "tw-text-sm tw-mt-1 tw-text-gray-600"
                      : "tw-text-sm tw-mt-1"
                  }
                >
                  Custom
                </MuiTypography>
              }
              disabled={IsVarBackTestBatch}
            />
          </RadioGroup>
        </MuiBox>
        <MuiBox className="tw-flex tw-mt-2.5">
          <MuiTypography
            className={
              IsVarBackTestBatch || !isCustomPeriodSelected
                ? "tw-text-sm tw-mt-1 tw-mr-0.5 tw-text-gray-600"
                : "tw-text-sm tw-mt-1 tw-mr-0.5 "
            }
          >
            Start Date:
          </MuiTypography>
          <MuiDatePicker
            onChange={handleStartDateChangeCallback}
            disabled={!isCustomPeriodSelected}
            value={startDate}
            slotProps={datePickerProps}
          />
        </MuiBox>
        <MuiBox className="tw-flex tw-ml-2.5  tw-mt-2.5">
          <MuiTypography
            className={
              IsVarBackTestBatch || !isCustomPeriodSelected
                ? "tw-text-sm tw-mt-1 tw-mr-0.5 tw-text-gray-600"
                : "tw-text-sm tw-mt-1 tw-mr-0.5 "
            }
          >
            End Date:
          </MuiTypography>
          <MuiDatePicker
            onChange={handleEndDateChangeCallback}
            disabled={!isCustomPeriodSelected}
            value={endDate}
            slotProps={datePickerProps}
          />
        </MuiBox>
      </MuiGrid>
      <MuiGrid>
        {isCustomPeriodSelected && !isValidCustomPeriod && (
          <p className="tw-text-red-700 tw-text-sm">
            Start Date and End Date are required and Start Date must be less
            than End Date.
          </p>
        )}
      </MuiGrid>
    </MuiBox>
  );
};

export default PeriodCustomSelection;
