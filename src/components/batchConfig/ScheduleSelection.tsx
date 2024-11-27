import { MuiBox } from "src/common/components/box/MuiBox";
import { MuiCheckbox } from "src/common/components/checkbox/MuiCheckbox";
import MuiTimePicker from "src/common/components/datepicker/MuiTimePicker";
import MuiGrid from "src/common/components/grid/MuiGrid";
import { MuiTypography } from "src/common/components/typography/MuiTypography/MuiTypography";
import { MuiFormControlLabel } from "src/common/components/form/MuiForms";
import { Dayjs } from "dayjs";
import { BatchRunMeasure } from "src/types/batchConfigurationTypes";
import { timePickerSlotProps } from "src/common/utilities/styleUtils/batchConfigStyles";
import { runDaysMeasures } from "../../common/utilities/ValidationUtils/batchConfigConstants";

export interface ScheduleProps {
  isHoldingPeriodValid: boolean;
  isScheduledBatch: boolean;
  handleScheduleCheckboxValueChange: (event: {
    target: { checked: boolean };
  }) => void;
  scheduleTimeValue: Dayjs;
  handleScheduleTimeValueChange: (e: Dayjs) => void;
  selectedRunDays: BatchRunMeasure[];
  hanndleRunDayTypeCheck: (value: BatchRunMeasure) => void;
  isScheduleValid: boolean;
  IsVarBackTestBatch: boolean;
}

const ScheduleSelection = (scheduleProps: ScheduleProps) => {
  const {
    isHoldingPeriodValid,
    isScheduledBatch,
    handleScheduleCheckboxValueChange,
    scheduleTimeValue,
    handleScheduleTimeValueChange,
    selectedRunDays,
    hanndleRunDayTypeCheck,
    isScheduleValid,
    IsVarBackTestBatch,
  } = scheduleProps;
  return (
    <>
      <MuiBox
        className={
          !isHoldingPeriodValid
            ? "tw-inline-flex tw-mt-7 tw-p-1 tw-w-full tw-h-7 tw-bg-slate-800"
            : "tw-inline-flex tw-mt-7 tw-p-1 tw-w-full tw-h-7 tw-bg-slate-800"
        }
      >
        <MuiCheckbox
          checked={isScheduledBatch}
          value={isScheduledBatch}
          onChange={handleScheduleCheckboxValueChange}
          disabled={IsVarBackTestBatch}
        />
        <MuiTypography
          className={
            IsVarBackTestBatch ? "tw-text-sm tw-text-gray-600" : "tw-text-sm"
          }
        >
          Schedule
        </MuiTypography>
      </MuiBox>
      <MuiBox className="tw-h-12 tw-mb-2">
        <MuiGrid
          container
          item
          className="tw-grid lg:tw-grid-cols-1 md:tw-grid-cols-1 sm:tw-grid-cols-1 tw-grow tw-gap-px tw-h-full tw-bg-green"
        >
          <MuiGrid
            item
            className="tw-mt-0.5 lg:tw-grid-cols-6 md:tw-grid-cols-6 sm:tw-grid-cols-6 tw-h-12"
          >
            <MuiBox className="tw-flex tw-ml-1">
              <MuiBox className="tw-flex">
                <MuiTypography
                  className={
                    IsVarBackTestBatch
                      ? "tw-text-sm tw-p-2 tw-mt-1 tw-text-base tw-text-gray-600"
                      : "tw-text-sm tw-p-2 tw-mt-1 tw-text-base"
                  }
                >
                  Time [UTC]:
                </MuiTypography>
                <MuiTimePicker
                  slotProps={timePickerSlotProps}
                  ampmInClock={false}
                  format="HH:mm"
                  disabled={!isScheduledBatch}
                  value={scheduleTimeValue}
                  onChange={(val) =>
                    handleScheduleTimeValueChange(val as Dayjs)
                  }
                  className="tw-p-2"
                />
              </MuiBox>
              <MuiBox className="tw-flex tw-ml-2">
                <MuiTypography
                  className={
                    IsVarBackTestBatch
                      ? "tw-text-sm tw-p-2 tw-mt-1 tw-text-base tw-text-gray-600"
                      : "tw-text-sm tw-p-2 tw-mt-1 tw-text-base"
                  }
                >
                  Rundays :
                </MuiTypography>
                {runDaysMeasures &&
                  runDaysMeasures.map((measure) => {
                    return (
                      <MuiFormControlLabel
                        key={`MFC-${measure.measure}`}
                        className="tw-text-sm"
                        label={
                          <MuiTypography className="tw-text-sm tw-text-base">
                            {measure.measure}
                          </MuiTypography>
                        }
                        control={
                          <MuiCheckbox
                            key={measure.measure}
                            checked={selectedRunDays.includes(measure)}
                            disabled={!isScheduledBatch}
                            onChange={() => hanndleRunDayTypeCheck(measure)}
                          />
                        }
                      />
                    );
                  })}
              </MuiBox>
            </MuiBox>
            <MuiBox className="tw-block">
              {!isScheduleValid && isScheduledBatch && (
                <p className="tw-text-red-700 tw-text-sm">
                  Time and Rundays are required.
                </p>
              )}
            </MuiBox>
          </MuiGrid>
        </MuiGrid>
      </MuiBox>
    </>
  );
};

export default ScheduleSelection;
