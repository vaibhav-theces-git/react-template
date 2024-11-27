import { MuiBox } from "src/common/components/box/MuiBox";
import MuiGrid from "src/common/components/grid/MuiGrid";
import { MuiTypography } from "src/common/components/typography/MuiTypography/MuiTypography";
import MuiDatePicker from "src/common/components/datepicker/MuiDatePicker";
import dayjs from "dayjs";
import { Accordion, AccordionDetails, AccordionSummary } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useEffect, useState } from "react";
import { MuiIconButton } from "src/common/components/button/MuiButtons/MuiIconButton";
import { BATCH_TYPES } from "src/common/constants/batchTypeConstant";

export interface VarBackTestProps {
  IsVarBackTestBatch: boolean;
  isValidVarBackTestPeriod: boolean;
  startDate: dayjs.Dayjs | null;
  handleVarBackTestStartDateCallback: (date: dayjs.Dayjs | null) => void;
  endDate: dayjs.Dayjs | null;
  handleVarBackTestEndDateCallback: (date: dayjs.Dayjs | null) => void;
  selectedBatchType: string;
}
const VarBackTestSelection = (varBackTestProps: VarBackTestProps) => {
  const {
    IsVarBackTestBatch,
    isValidVarBackTestPeriod,
    startDate,
    handleVarBackTestStartDateCallback,
    endDate,
    handleVarBackTestEndDateCallback,
    selectedBatchType,
  } = varBackTestProps;
  const yesterdayDate = dayjs().subtract(1, "day");

  const [isVarBackExpanded, setIsVarBackExpanded] = useState(false);

  const handleChange = () => {
    if (selectedBatchType === BATCH_TYPES.VBT) {
      setIsVarBackExpanded(!isVarBackExpanded);
    }
  };

  useEffect(() => {
    setIsVarBackExpanded(selectedBatchType === BATCH_TYPES.VBT);
  }, [selectedBatchType]);

  return (
    <Accordion
      disabled={!(selectedBatchType === BATCH_TYPES.VBT)}
      expanded={isVarBackExpanded}
    >
      <AccordionSummary
        expandIcon={
          <MuiIconButton onClick={handleChange}>
            <ExpandMoreIcon />
          </MuiIconButton>
        }
        className="tw-text-sm tw-bg-slate-800"
      >
        VaR Back Test
      </AccordionSummary>
      <AccordionDetails className="tw-bg-slate-900">
        <MuiBox className="tw-h-10 tw-mb-2">
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
                <MuiBox className="tw-flex tw-ml-2 tw-items-baseline">
                  <MuiTypography className="tw-text-sm tw-p-2 tw-mt-1 tw-text-base">
                    Start Date :
                  </MuiTypography>
                  <MuiDatePicker
                    onChange={handleVarBackTestStartDateCallback}
                    disabled={!IsVarBackTestBatch}
                    value={startDate}
                  />
                </MuiBox>
                <MuiBox className="tw-flex tw-ml-2 tw-items-baseline">
                  <MuiTypography className="tw-text-sm tw-p-2 tw-mt-1 tw-text-base">
                    End Date :
                  </MuiTypography>
                  <MuiDatePicker
                    onChange={handleVarBackTestEndDateCallback}
                    disabled={!IsVarBackTestBatch}
                    value={endDate}
                    maxDate={yesterdayDate}
                  />
                </MuiBox>
              </MuiBox>
              <MuiBox />
            </MuiGrid>
          </MuiGrid>
          <MuiBox>
            {IsVarBackTestBatch && !isValidVarBackTestPeriod && (
              <p className="tw-text-red-700 tw-text-sm">
                Start Date and End Date are required and Start Date must be less
                than End Date.
              </p>
            )}
          </MuiBox>
        </MuiBox>
      </AccordionDetails>
    </Accordion>
  );
};

export default VarBackTestSelection;
