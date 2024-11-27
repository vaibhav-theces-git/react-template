import { ColDef } from "ag-grid-enterprise";
import { AgGridReact } from "ag-grid-react";
import { useCallback, useMemo, useRef } from "react";
import { SelectChangeEvent } from "@mui/material";
import { MuiBox } from "src/common/components/box/MuiBox";
import MuiContainer from "src/common/components/container/MuiContainer";
import { MuiMenuItem } from "src/common/components/menu/MuiMenu";
import MuiSelect from "src/common/components/select/MuiSelect";
import MuiToolbar from "src/common/components/toolbar/MuiToolbar";
import { MuiTypography } from "src/common/components/typography/MuiTypography/MuiTypography";
import MuiTooltip from "src/common/components/tooltip/MuiTooltip";
import { MuiIconButton } from "src/common/components/button/MuiButtons/MuiIconButton";
import { Download } from "@mui/icons-material";
import { formattedDateTime } from "src/common/utilities/formatUtils/dateUtils";
import { MenuProps } from "src/common/utilities/ValidationUtils/batchConfigConstants";
import { spotVolResponseData } from "src/types/spotVolAnalysisTypes";
import { noDataMessage } from "src/common/constants/testids";
import {
  SpotVolDisplayTypes,
  SpotVolMetricTypes,
} from "./spotVolAnalysisContants";

export interface SpotVolAnalysisV1GridProps {
  spotvolGridColumns: ColDef[];
  spotvolGridData: spotVolResponseData[];
  spotVolMetric: string;
  spotVolDisplayType: string;
  handleSpotVolMetricChange: (metric: string) => void;
  handleSpotVolDisplayChange: (display: string) => void;
}

const SpotVolAnalysisV1Grid = (spotvolProps: SpotVolAnalysisV1GridProps) => {
  const {
    spotvolGridColumns,
    spotvolGridData,
    spotVolMetric,
    spotVolDisplayType,
    handleSpotVolMetricChange,
    handleSpotVolDisplayChange,
  } = spotvolProps;
  const spotvolV1TableRef = useRef<AgGridReact<spotVolResponseData[]> | null>(
    null
  );
  const defaultColDef = useMemo<ColDef>(() => {
    return {
      sortable: false,
      resizable: false,
      filter: false,
      flex: 1,
      menuTabs: [],
      shownorowsoverlay: true,
      unSortIcon: false,
    };
  }, []);

  const handleMetricChange = (e: SelectChangeEvent<unknown>) => {
    handleSpotVolMetricChange(e.target.value as string);
  };

  const handleDisplayChange = (e: SelectChangeEvent<unknown>) => {
    handleSpotVolDisplayChange(e.target.value as string);
  };

  const onBtnExport = useCallback(() => {
    const excelParams = {
      fileName: `${"SV_View1"}_${formattedDateTime()}.csv`,
    };
    spotvolV1TableRef?.current?.api?.exportDataAsCsv(excelParams);
  }, [spotvolV1TableRef]);

  return (
    <MuiContainer className="tw-min-w-full tw-h-full tw-m-0 tw-p-0 tw-bg-slate-25">
      <MuiToolbar
        variant="dense"
        className="tw-bg-slate-25 tw-grid tw-grid-cols-3"
      >
        <MuiBox className="tw-w-full tw-h-full tw-flex tw-items-center tw-justify-start">
          <MuiTypography className="tw-text-sm tw-mr-1">Metric :</MuiTypography>
          <MuiSelect
            role="combobox"
            className="tw-w-40 tw-text-xs tw-py-3 tw-px-0 tw-text-left"
            value={spotVolMetric}
            onChange={handleMetricChange}
            MenuProps={MenuProps}
          >
            {Object.values(SpotVolMetricTypes).map((key) => (
              <MuiMenuItem key={key} value={key}>
                {key}
              </MuiMenuItem>
            ))}
          </MuiSelect>
        </MuiBox>
        <MuiBox className="tw-w-full tw-h-full tw-flex tw-items-center tw-justify-center">
          <MuiTypography className="tw-text-sm tw-font-bold tw-mr-1">
            Vol Shift
          </MuiTypography>
        </MuiBox>
        <MuiBox className="tw-w-full tw-h-full tw-flex tw-items-center tw-justify-end">
          <MuiTypography className="tw-text-sm tw-mr-1">
            Display Type :
          </MuiTypography>
          <MuiSelect
            role="combobox"
            className="tw-w-40 tw-text-xs tw-py-3 tw-px-0 tw-text-left"
            value={spotVolDisplayType}
            onChange={handleDisplayChange}
            MenuProps={MenuProps}
          >
            {Object.values(SpotVolDisplayTypes).map((key) => (
              <MuiMenuItem key={key} value={key}>
                {key}
              </MuiMenuItem>
            ))}
          </MuiSelect>
          <MuiTooltip title="Download">
            <MuiIconButton size="small" onClick={onBtnExport}>
              <Download />
            </MuiIconButton>
          </MuiTooltip>
        </MuiBox>
      </MuiToolbar>
      <MuiBox className="tw-flex tw-w-full tw-h-[calc(100%-48px)]">
        <MuiBox className="tw-flex tw-items-center">
          <MuiTypography
            id="spotvolv1-y-axis-title"
            className="tw-text-sm tw-font-bold tw-mr-1"
          >
            Spot Shift
          </MuiTypography>
        </MuiBox>
        <MuiBox
          id="SpotVolAnalysisV1Grid"
          className="ag-theme-alpine tw-w-full"
        >
          {spotvolGridData && spotvolGridData.length > 0 ? (
            <AgGridReact
              ref={spotvolV1TableRef}
              rowData={spotvolGridData}
              columnDefs={spotvolGridColumns}
              defaultColDef={defaultColDef}
              rowHeight={27}
              pagination={false}
              suppressPaginationPanel
              suppressDragLeaveHidesColumns
              rowSelection="single"
            />
          ) : (
            <MuiTypography className="tw-text-center tw-text-sm tw-m-6 tw-text-white">
              {noDataMessage}
            </MuiTypography>
          )}
        </MuiBox>
      </MuiBox>
    </MuiContainer>
  );
};

export default SpotVolAnalysisV1Grid;
