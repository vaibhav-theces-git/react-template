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
import { formattedDateTime } from "src/common/utilities/formatUtils/dateUtils";
import MuiTooltip from "src/common/components/tooltip/MuiTooltip";
import { MuiIconButton } from "src/common/components/button/MuiButtons/MuiIconButton";
import { Download } from "@mui/icons-material";
import { MenuProps } from "src/common/utilities/ValidationUtils/batchConfigConstants";
import { spotVolResponseData } from "src/types/spotVolAnalysisTypes";
import { noDataMessage } from "src/common/constants/testids";
import { SpotVolDisplayTypes } from "./spotVolAnalysisContants";

export interface SpotVolAnalysisV2GridProps {
  spotvolGridColumns: ColDef[];
  spotvolGridData: spotVolResponseData[];
  spotorvol: "Spot" | "Vol";
  spotVolShiftTypes: string[];
  spotvolShiftValue: string;
  spotvolDisplayType: string;
  handleSpotVolChange: (value: string) => void;
  handleSpotVolDisplayChange: (display: string) => void;
}

const SpotVolAnalysisV2Grid = (spotvolProps: SpotVolAnalysisV2GridProps) => {
  const {
    spotvolGridColumns,
    spotvolGridData,
    spotorvol,
    spotVolShiftTypes,
    spotvolShiftValue,
    spotvolDisplayType,
    handleSpotVolChange,
    handleSpotVolDisplayChange,
  } = spotvolProps;

  const spotvolV2TableRef = useRef<AgGridReact<spotVolResponseData[]> | null>(
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

  const handleSpotVolValueChange = (e: SelectChangeEvent<unknown>) => {
    handleSpotVolChange(e.target.value as string);
  };

  const handleDisplayChange = (e: SelectChangeEvent<unknown>) => {
    handleSpotVolDisplayChange(e.target.value as string);
  };
  const onBtnExport = useCallback(() => {
    const excelParams = {
      fileName: `${"SV_View2"}_${formattedDateTime()}.csv`,
    };
    spotvolV2TableRef?.current?.api?.exportDataAsCsv(excelParams);
  }, [spotvolV2TableRef]);

  return (
    <MuiContainer className="tw-min-w-full tw-h-full tw-m-0 tw-p-0 tw-bg-slate-25">
      <MuiToolbar
        variant="dense"
        className="tw-bg-slate-25 tw-grid tw-grid-cols-3"
      >
        <MuiBox className="tw-w-full tw-h-full tw-flex tw-items-center tw-justify-start">
          <MuiTypography className="tw-text-sm tw-mr-1">
            {spotorvol.toLocaleLowerCase() === "spot" ? "Vol" : "Spot"} :
          </MuiTypography>
          <MuiSelect
            className="tw-w-40 tw-text-xs tw-py-3 tw-px-0 tw-text-left"
            value={spotvolShiftValue}
            onChange={handleSpotVolValueChange}
            MenuProps={MenuProps}
            role="combobox"
          >
            {spotVolShiftTypes.map((key) => (
              <MuiMenuItem key={key} value={key}>
                {key}
              </MuiMenuItem>
            ))}
          </MuiSelect>
        </MuiBox>
        <MuiBox className="tw-w-full tw-h-full tw-flex tw-items-center tw-justify-center">
          <MuiTypography className="tw-text-sm tw-font-bold tw-mr-1">
            {spotorvol.toLocaleLowerCase() === "spot"
              ? "Spot Shift"
              : "Vol Shift"}
          </MuiTypography>
        </MuiBox>
        <MuiBox className="tw-w-full tw-h-full tw-flex tw-items-center tw-justify-end">
          <MuiTypography className="tw-text-sm tw-mr-1">
            Display Type :
          </MuiTypography>
          <MuiSelect
            className="tw-w-40 tw-text-xs tw-py-3 tw-px-0 tw-text-left"
            value={spotvolDisplayType}
            onChange={handleDisplayChange}
            MenuProps={MenuProps}
            role="combobox"
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
      <MuiBox
        id="SpotVolAnalysisV2Grid"
        className="ag-theme-alpine tw-w-full tw-h-[calc(100%-48px)]"
      >
        {spotvolGridData && spotvolGridData.length > 0 ? (
          <AgGridReact
            ref={spotvolV2TableRef}
            rowData={spotvolGridData}
            columnDefs={spotvolGridColumns}
            defaultColDef={defaultColDef}
            rowHeight={30}
            pagination={false}
            suppressPaginationPanel
            suppressContextMenu
            suppressDragLeaveHidesColumns
            rowSelection="single"
          />
        ) : (
          <MuiTypography className="tw-text-center tw-text-sm tw-m-6 tw-text-white">
            {noDataMessage}
          </MuiTypography>
        )}
      </MuiBox>
    </MuiContainer>
  );
};

export default SpotVolAnalysisV2Grid;
