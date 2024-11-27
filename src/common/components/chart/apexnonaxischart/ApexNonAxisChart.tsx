import React, { useEffect, useState } from "react";
import ReactApexChart from "react-apexcharts";
import { MuiTypography } from "src/common/components/typography/MuiTypography/MuiTypography";
import { MuiButtonGroup } from "src/common/components/button/MuiButtons/MuiButtonGroup";
import { MuiIconButton } from "src/common/components/button/MuiButtons/MuiIconButton";
import { Fullscreen, FullscreenExit, Settings } from "@mui/icons-material";
import { MenuItem, SelectChangeEvent } from "@mui/material";
import { noDataMessage } from "src/common/constants/testids";
import ApexNonAxisChartProps, {
  ApexNonAxisChartType,
} from "./ApexNonAxisChartProps";
import { CustomModal } from "../../modal/MuiModal/CustomModal";
import MuiSelect from "../../select/MuiSelect";
import { MuiBox } from "../../box/MuiBox";
import { ReportDownload } from "../../download/ReportDownload";

const ApexNonAxisChart = (props: ApexNonAxisChartProps) => {
  const {
    chartTitle,
    apexChartType,
    apexChartOptions,
    apexChartSeries,
    apexNonAxisChartExportData,
    charttypechangecallback,
    togglecallback,
  } = props;

  const apexAxisChartTypeList = [
    {
      value: "pie",
      label: "Pie",
    },
    {
      value: "donut",
      label: "Donut",
    },
    {
      value: "polarArea",
      label: "Polar Area",
    },
  ];

  const [blockZoomed, setBlockZoomed] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [selectedChartType, setSelectedChartType] =
    useState<ApexNonAxisChartType>(apexChartType);

  const handleChartTypeSelectionChange = (
    event: SelectChangeEvent<unknown>
  ) => {
    setSelectedChartType(event?.target.value as ApexNonAxisChartType);
    charttypechangecallback(event?.target.value as ApexNonAxisChartType);
  };

  const handleZoom = () => {
    setBlockZoomed(!blockZoomed);
  };

  const handleChartSettings = () => {
    setShowSettings(!showSettings);
  };

  useEffect(() => {
    togglecallback(blockZoomed);
  }, [
    blockZoomed,
    togglecallback,
    selectedChartType,
    apexNonAxisChartExportData,
  ]);

  return (
    <div className="fx-conduit-container tw-w-full tw-h-full tw-overflow-hidden">
      <div className="fx-conduit-header tw-h-7 tw-pl-1 tw-pr-1 tw-bg-slate-500 tw-align-middle tw-justify-between tw-flex">
        <div className="fx-conduit-title tw-flex tw-items-center">
          <MuiTypography className="tw-text-sm tw-mr-5 tw-font-bold">
            {chartTitle}
          </MuiTypography>
        </div>
        <div className="fx-conduit-buttons tw-flex tw-items-center">
          <MuiButtonGroup className="tw-flex tw-items-center">
            <MuiIconButton
              size="small"
              disabled={apexChartSeries?.length === 0}
            >
              {apexNonAxisChartExportData && (
                <ReportDownload
                  formattedTableData={apexNonAxisChartExportData}
                  fileName={"MvDistributionData"}
                />
              )}
            </MuiIconButton>
            <MuiIconButton
              size="small"
              onClick={handleChartSettings}
              disabled={apexChartSeries?.length === 0}
            >
              <Settings fontSize="small" />
            </MuiIconButton>
            <MuiIconButton
              size="small"
              onClick={handleZoom}
              disabled={apexChartSeries?.length === 0}
            >
              {blockZoomed && <FullscreenExit fontSize="small" />}
              {!blockZoomed && <Fullscreen fontSize="small" />}
            </MuiIconButton>
          </MuiButtonGroup>
        </div>
      </div>
      <div className="fx-conduit-content tw-align-middle tw-h-[calc(100%-28px)]">
        {apexChartOptions && apexChartSeries && (
          <ReactApexChart
            key={"APX_".concat(selectedChartType.toString() ?? "")}
            type={selectedChartType as any}
            options={apexChartOptions}
            height={apexChartOptions.chart?.height}
            width={apexChartOptions.chart?.width}
            series={apexChartSeries}
          />
        )}
        {(!apexChartSeries || !apexChartOptions) && (
          <div className=" tw-flex tw-text-sm tw-text-center tw-items-center tw-justify-center tw-h-full tw-w-full">
            <span>{noDataMessage}</span>
          </div>
        )}
      </div>
      <CustomModal
        isOpen={showSettings}
        handleClose={handleChartSettings}
        title={chartTitle}
        classNames="tw-p-0"
        headerClassName="tw-text-sm tw-font-bold"
      >
        <MuiBox className="tw-grid tw-grid-cols-2 tw-gap-2 tw-mt-5">
          <MuiTypography className="tw-text-xs tw-mr-5">
            Select Chart Type :
          </MuiTypography>
          <MuiSelect
            labelId="ApexAxisChartTypeListSelectBoxLabel"
            id="ApexAxisChartTypeListSelectBoxId"
            value={selectedChartType}
            onChange={handleChartTypeSelectionChange}
            className="tw-text-xs tw-py-3 tw-px-0 tw-text-left"
          >
            {apexAxisChartTypeList.map((option) => (
              <MenuItem
                key={option.value}
                value={option.value}
                className="tw-text-xs"
              >
                {option.label}
              </MenuItem>
            ))}
          </MuiSelect>
        </MuiBox>
      </CustomModal>
    </div>
  );
};

export default ApexNonAxisChart;
