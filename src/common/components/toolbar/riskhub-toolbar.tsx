import React, { useEffect, useState } from "react";
import { SelectChangeEvent, ToolbarProps } from "@mui/material";
import { Sync } from "@mui/icons-material";
import { MuiTypography } from "src/common/components/typography/MuiTypography/MuiTypography";
import MuiSelect from "src/common/components/select/MuiSelect";
import { MuiMenuItem } from "src/common/components/menu/MuiMenu";
import { DateValidationError } from "@mui/x-date-pickers";
import { PickerChangeHandlerContext } from "@mui/x-date-pickers/internals/hooks/usePicker/usePickerValue.types";
import dayjs, { Dayjs } from "dayjs";
import MuiToolbar from "./MuiToolbar";
import MuiGrid from "../grid/MuiGrid";
import MuiDatePicker from "../datepicker/MuiDatePicker";
import { MuiButton } from "../button/MuiButtons/MuiButton";

export interface RiskHubToolbarProps extends ToolbarProps {
  portfoliolist: Portfolio[];
  cobdate: Dayjs;
  portfolio: string;
  cobdatechangecallback: (date: Dayjs) => void;
  portfoliochangecallback: (portfolio: string) => void;
  showApplyButton: boolean;
  applyClickCallback: null | (() => void);
  showRefreshButton: boolean;
  refreshBatchIdsCallback: null | (() => void);
}

export interface Portfolio {
  runId: number;
  portfolioName: string;
}
export const RiskHubToolbar: React.FC<RiskHubToolbarProps> = (
  props: RiskHubToolbarProps
) => {
  const {
    portfoliolist,
    cobdate,
    portfolio,
    cobdatechangecallback,
    portfoliochangecallback,
    showApplyButton,
    applyClickCallback,
    showRefreshButton,
    refreshBatchIdsCallback,
  } = props;

  const [selectedCOBDate, setCOBDate] = useState(cobdate);
  const [selectedEntity, setEntity] = useState(
    portfoliolist && portfoliolist.length > 0
      ? portfoliolist.find((p) => p.portfolioName === portfolio)?.portfolioName
      : ""
  );

  useEffect(() => {
    if (portfoliolist && portfoliolist.length > 0) {
      setEntity(
        portfoliolist.find((p) => p.portfolioName === portfolio)?.portfolioName
      );
    }
    setCOBDate(cobdate);
  }, [cobdate, portfoliolist, portfolio]);

  const MenuProps = {
    PaperProps: {
      style: {
        maxHeight: 200,
      },
    },
  };

  const handleEntityChange = (event: SelectChangeEvent<unknown>) => {
    setEntity(event.target.value as string);
    portfoliochangecallback(event.target.value as string);
  };

  const handleCOBDateChange = (
    value: Dayjs | null,
    context: PickerChangeHandlerContext<DateValidationError>
  ) => {
    if (value) {
      setCOBDate(value);
      cobdatechangecallback(value);
      console.log(context);
    }
  };
  const todaysDate = dayjs();
  return (
    <MuiToolbar {...props}>
      <MuiGrid
        container
        item
        className="tw-grid md:tw-grid-cols-2 sm:tw-grid-cols-2 lg:tw-grid-cols-2 tw-grow"
      >
        <MuiGrid
          item
          className="tw-inline-flex  tw-m-1 tw-mt-2.5 md:tw-grid-cols-2 sm:tw-grid-cols-2 lg:tw-grid-cols-2 md:tw-justify-start lg:tw-justify-start sm:tw-justify-start"
          alignItems="center"
        >
          <MuiTypography className="tw-text-sm tw-mr-1">Date :</MuiTypography>
          <MuiDatePicker
            onChange={handleCOBDateChange}
            defaultValue={selectedCOBDate}
            value={selectedCOBDate}
            maxDate={todaysDate}
          />
        </MuiGrid>
        <MuiGrid
          item
          className="tw-inline-flex  tw-m-1 md:tw-grid-cols-2 sm:tw-grid-cols-2 lg:tw-grid-cols-2 md:tw-justify-end lg:tw-justify-end sm:tw-justify-end"
          alignItems="center"
        >
          <MuiTypography className="tw-text-sm tw-mr-1">
            Batch Run :
          </MuiTypography>
          <MuiSelect
            data-testid="riskhub-toolbar-portfolio-select"
            labelId="ToolbarSelectEntityLabel"
            id="ToolbarSelectEntityId"
            value={selectedEntity}
            onChange={handleEntityChange}
            className="tw-w-64 tw-text-xs tw-py-3 tw-px-0 tw-text-left"
            MenuProps={MenuProps}
          >
            {portfoliolist &&
              portfoliolist.map((p: Portfolio) => (
                <MuiMenuItem
                  key={p.runId}
                  value={p.portfolioName}
                  className="tw-text-xs"
                >
                  {p.portfolioName}
                </MuiMenuItem>
              ))}
          </MuiSelect>
          {showRefreshButton && (
            <MuiButton
              className=" tw-bg-slate-500 tw-text-white tw-m-0.5 tw-text-xs tw-font-normal "
              sx={{
                fontSize: "12px",
                fontWeight: "normal",
                width: "24px",
                minWidth: "24px",
                height: "24px",
              }}
              onClick={refreshBatchIdsCallback as () => void}
            >
              <Sync />
            </MuiButton>
          )}

          {showApplyButton && (
            <MuiButton
              className=" tw-h-6 tw-w-10 tw-bg-slate-500"
              onClick={applyClickCallback as () => void}
              sx={{ fontSize: "12px", fontWeight: "normal" }}
            >
              Apply
            </MuiButton>
          )}
        </MuiGrid>
      </MuiGrid>
    </MuiToolbar>
  );
};

export default RiskHubToolbar;
