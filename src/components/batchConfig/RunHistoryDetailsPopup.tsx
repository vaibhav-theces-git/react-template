import { Radio, Stack } from "@mui/material";
import { ColDef, ITooltipParams } from "ag-grid-enterprise";
import { AgGridReact } from "ag-grid-react";
import dayjs from "dayjs";
import { useMemo } from "react";

import { MuiBox } from "src/common/components/box/MuiBox";
import { MuiCheckbox } from "src/common/components/checkbox/MuiCheckbox";
import {
  MuiFormControl,
  MuiFormControlLabel,
} from "src/common/components/form/MuiForms";
import MuiGrid from "src/common/components/grid/MuiGrid";
import { MuiTextField } from "src/common/components/input/MuiInputs";
import { CustomModal } from "src/common/components/modal/MuiModal/CustomModal";
import { MuiRadioGroup } from "src/common/components/radio/MuiRadioGroup";
import { MuiStack } from "src/common/components/stack/MuiStack";
import { MuiTypography } from "src/common/components/typography/MuiTypography/MuiTypography";
import {
  ExcludedAccounts,
  RunHistoryResponseType,
} from "src/types/runHistoryType";
import {
  ScenarioGrid,
  ScenarioMetrics,
} from "src/types/batchConfigurationTypes";
import { spotVolGridResponseConversion } from "src/common/utilities/formatUtils/SpotVolaDataConversion";

export type RunHistoryDetailsPopupProps = {
  runHistoryData: RunHistoryResponseType[];
  isModalOpen: boolean;
  handleModal: () => void;
};

const RunHistoryDetailsPopup = (
  runHistoryDetailsPopupProps: RunHistoryDetailsPopupProps
) => {
  const { isModalOpen, handleModal, runHistoryData } =
    runHistoryDetailsPopupProps;
  const scenarioMatricsData = runHistoryData[0]?.spotvol_scenarios
    ?.scenario_metrics as ScenarioMetrics[];
  const excludedaccounts = (params: ITooltipParams) => {
    const excludedAccountsArray = params.value as ExcludedAccounts[];
    if (excludedAccountsArray && excludedAccountsArray.length > 0) {
      return excludedAccountsArray
        .map((account: ExcludedAccounts) => account.name)
        .join(", ");
    }
    return "";
  };
  const gridOptions = {
    portfolioColumnDefs: [
      {
        field: "le_id",
        headerName: "Entity",
        width: 90,
        align: "left",
        resizable: true,
      },
      {
        field: "excluded_accts",
        headerName: "Accounts Excluded",
        align: "left",
        minWidth: 500,
        cellRenderer: excludedaccounts,
      },
    ],
    aggregateColumnDefs: [
      {
        field: "agg_heirarchy_types",
        headerName: "Hierarchy",
        cellStyle: { textAlign: "center" },
      },
    ],
    varColumnDefs: [
      {
        field: "risk_measure_types",
        headerName: "Value",
        cellStyle: { textAlign: "center" },
      },
    ],
    spotVolColumnDefs: [
      {
        field: "spotvol",
        width: 50,
        editable: false,
      },
      {
        field: "n5",
        width: 28,
        editable: true,
      },
      {
        field: "n4",
        width: 28,
        editable: true,
      },
      {
        field: "n3",
        width: 28,
        editable: true,
      },
      {
        field: "n2",
        width: 28,
        editable: true,
      },
      {
        field: "n1",
        width: 28,
        editable: true,
      },
      {
        field: "zero",
        width: 28,
        editable: false,
        cellStyle: { backgroundColor: "#343A46" },
      },
      {
        field: "p1",
        width: 28,
        editable: true,
      },
      {
        field: "p2",
        width: 28,
        editable: true,
      },
      {
        field: "p3",
        width: 28,
        editable: true,
      },
      {
        field: "p4",
        width: 28,
        editable: true,
      },
      {
        field: "p5",
        width: 28,
        editable: true,
      },
    ],
  };

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
  const portfolioDefaultColDef = useMemo<ColDef>(() => {
    return {
      sortable: true,
      resizable: true,
      filter: false,
      flex: 1,
      menuTabs: ["generalMenuTab", "filterMenuTab"],
      shownorowsoverlay: true,
      unSortIcon: true,
    };
  }, []);
  const spotVolDefaultColDef = useMemo<ColDef>(() => {
    return {
      editable: true,
      cellDataType: true,
      sortable: false,
      resizable: false,
      filter: false,
      flex: 1,
      menuTabs: [],
      shownorowsoverlay: true,
      unSortIcon: true,
    };
  }, []);

  const spotVolData: ScenarioGrid[] = spotVolGridResponseConversion(
    runHistoryData[0]?.spotvol_scenarios as any
  );
  return (
    <CustomModal
      isOpen={isModalOpen}
      handleClose={handleModal}
      headerClassName="tw-text-xl tw-font-bold "
      title={<MuiBox>Configuration Details</MuiBox>}
      maxWidth="lg"
      classNames="tw-w-4/5 tw-h-fit"
    >
      <MuiBox className="tw-mt-1" component="form">
        <MuiBox className="tw-grid lg:tw-grid-cols-5 md:tw-grid-cols-5 sm:tw-grid-cols-1">
          <MuiBox className="tw-flex lg:tw-col-span-3 md:tw-col-span-3 sm:tw-col-span-1">
            <MuiTypography className="tw-text-md tw-mt-1.5 ">
              Batch Name: {runHistoryData[0]?.batch_name}
            </MuiTypography>

            <MuiBox className="tw-flex tw-ml-8">
              <MuiTypography className="tw-text-sm tw-mt-1.5 ">
                Critical Batch :
              </MuiTypography>
              <MuiCheckbox
                checked={runHistoryData[0]?.is_critical}
                sx={{
                  padding: 0,
                  margin: 0,
                  "&.MuiCheckbox-root": {
                    paddingLeft: "5px",
                    marginBottom: "100px",
                  },
                  "& .MuiSvgIcon-root": {
                    fontSize: 20,
                  },
                }}
              />
            </MuiBox>
          </MuiBox>
          <MuiBox className=" lg:tw-col-span-2 md:tw-col-span-2 sm:tw-col-span-1">
            <MuiTypography className="tw-text-sm">Batch Type</MuiTypography>
            <MuiFormControl>
              <MuiRadioGroup value={runHistoryData[0]?.batch_type}>
                <MuiFormControlLabel
                  value="regular"
                  control={<Radio size="small" />}
                  label={
                    <MuiTypography className="tw-text-sm">
                      Regular
                    </MuiTypography>
                  }
                />
                <MuiFormControlLabel
                  value="vbt"
                  control={<Radio size="small" />}
                  label={
                    <MuiTypography className="tw-text-sm">
                      VaR Back Test
                    </MuiTypography>
                  }
                />
                <MuiFormControlLabel
                  value="spotvol"
                  control={<Radio size="small" />}
                  label={
                    <MuiTypography className="tw-text-sm">
                      Spot-Vol
                    </MuiTypography>
                  }
                />
              </MuiRadioGroup>
            </MuiFormControl>
          </MuiBox>
        </MuiBox>
        <MuiBox className="tw-h-44 tw-mb-2">
          <MuiStack direction="row" justifyContent="space-between">
            <MuiBox>
              <MuiTypography className="tw-text-sm tw-mt-2">
                Portfolio
              </MuiTypography>
            </MuiBox>
          </MuiStack>
          <MuiBox className="tw-h-36 tw-overflow-auto ag-theme-alpine">
            <AgGridReact
              rowData={runHistoryData[0]?.portfolio_details.portfolio}
              columnDefs={gridOptions.portfolioColumnDefs}
              defaultColDef={portfolioDefaultColDef}
              suppressContextMenu
              suppressDragLeaveHidesColumns
              suppressCellFocus
              rowHeight={34}
              headerHeight={40}
              tooltipInteraction
              tooltipShowDelay={0}
            />
          </MuiBox>
        </MuiBox>
        <MuiGrid
          container
          item
          className="tw-grid lg:tw-grid-cols-2 md:tw-grid-cols-2 sm:tw-grid-cols-1 tw-grow tw-gap-px tw-h-full"
        >
          <MuiBox className=" lg:tw-grid-cols-1 md:tw-grid-cols-1 sm:tw-grid-cols-1  tw-m-0.5">
            <MuiStack direction="row" justifyContent="space-between">
              <MuiBox>
                <MuiTypography className="tw-text-sm">
                  Aggregation Hierarchy
                </MuiTypography>
              </MuiBox>
            </MuiStack>
            <MuiBox
              className="tw-h-36 tw-w-full ag-theme-alpine"
              id="batchConfigurationDetails"
            >
              <AgGridReact
                rowData={runHistoryData}
                columnDefs={gridOptions.aggregateColumnDefs}
                defaultColDef={defaultColDef}
                suppressContextMenu
                suppressDragLeaveHidesColumns
                suppressCellFocus
              />
            </MuiBox>
          </MuiBox>
          <MuiBox className=" lg:tw-grid-cols-1 md:tw-grid-cols-1 sm:tw-grid-cols-1  tw-m-0.5">
            <MuiStack direction="row" justifyContent="space-between">
              <MuiBox>
                <MuiTypography className="tw-text-sm">
                  VaR Configuration
                </MuiTypography>
              </MuiBox>
            </MuiStack>
            <MuiBox
              className="tw-h-36 tw-w-full ag-theme-alpine"
              id="batchConfigurationDetails"
            >
              <AgGridReact
                rowData={runHistoryData}
                columnDefs={gridOptions.varColumnDefs}
                defaultColDef={defaultColDef}
                suppressContextMenu
                suppressDragLeaveHidesColumns
                suppressCellFocus
              />
            </MuiBox>
          </MuiBox>
        </MuiGrid>
        <MuiGrid
          container
          item
          className="tw-grid lg:tw-grid-cols-2 md:tw-grid-cols-2 sm:tw-grid-cols-1"
        >
          <MuiBox className="tw-flex lg:tw-grid-cols-1 md:tw-grid-cols-1 sm:tw-grid-cols-1">
            <MuiTypography className="tw-text-sm tw-mr-3 tw-mt-4 ">
              Period
            </MuiTypography>
            <MuiTextField
              value={
                runHistoryData[0]?.history_period !== ""
                  ? runHistoryData[0]?.history_period
                  : ""
              }
              sx={{
                paddingLeft: "5px",
                marginTop: "16px",
                width: "90px",
                "& .MuiInputBase-root": {
                  height: 20,
                  fontSize: "12px",
                },
              }}
              InputProps={{
                readOnly: true,
              }}
            />
          </MuiBox>
          <MuiBox className="tw-flex md:tw-justify-end sm:tw-justify-start  lg:tw-grid-cols-1 md:tw-grid-cols-1 sm:tw-grid-cols-1">
            <MuiTypography className="tw-text-sm tw-mr-3 tw-mt-4 ">
              Holding Period
            </MuiTypography>
            <MuiTextField
              value={
                runHistoryData[0]?.var_gapping > 0
                  ? runHistoryData[0]?.var_gapping
                  : ""
              }
              sx={{
                paddingLeft: "5px",
                marginTop: "16px",
                width: "50px",
                "& .MuiInputBase-root": {
                  height: 20,
                  fontSize: "12px",
                },
              }}
              InputProps={{
                readOnly: true,
              }}
            />
            <MuiTypography className="tw-text-sm tw-mr-3 tw-ml-3 tw-mt-4">
              Days
            </MuiTypography>
          </MuiBox>
        </MuiGrid>
        <MuiGrid className="tw-flex lg:tw-grid-cols-1 md:tw-grid-cols-1 sm:tw-grid-cols-1  tw-m-0.5 tw-h-fit tw-w-full">
          <MuiTypography className="tw-text-sm tw-mr-3 tw-mt-4">
            Custom
          </MuiTypography>
          <MuiBox className="tw-flex tw-mt-3">
            <MuiTypography className="tw-text-sm tw-mt-1 tw-mr-0.5">
              Start Date:
            </MuiTypography>
            <MuiTextField
              value={
                runHistoryData[0]?.period_start_date !== ""
                  ? dayjs(runHistoryData[0]?.period_start_date).format(
                      "DD/MM/YYYY"
                    )
                  : ""
              }
              sx={{
                padding: "0px",
                margin: "0px",
                marginTop: "4px",
                width: "90px",
                "& .MuiInputBase-root": {
                  height: 20,
                  fontSize: "12px",
                },
              }}
              InputProps={{
                readOnly: true,
              }}
            />
          </MuiBox>
          <MuiBox className="tw-flex tw-ml-2.5  tw-mt-3">
            <MuiTypography className="tw-text-sm tw-mt-1 tw-mr-0.5">
              End Date:
            </MuiTypography>

            <MuiTextField
              value={
                runHistoryData[0]?.period_end_date !== ""
                  ? dayjs(runHistoryData[0]?.period_end_date).format(
                      "DD/MM/YYYY"
                    )
                  : ""
              }
              sx={{
                padding: "0px",
                margin: "0px",
                marginTop: "4px",
                width: "90px",
                "& .MuiInputBase-root": {
                  height: 20,
                  fontSize: "12px",
                },
              }}
              InputProps={{
                readOnly: true,
              }}
            />
          </MuiBox>
        </MuiGrid>
        <MuiBox>
          <MuiBox
            className={
              "tw-inline-flex tw-mt-7 tw-p-1 tw-w-full tw-h-7 tw-bg-slate-800"
            }
          >
            <MuiTypography className="tw-text-sm ">VaR Back Test</MuiTypography>
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
                  <MuiBox className="tw-flex tw-ml-2 tw-items-baseline">
                    <MuiTypography className="tw-text-sm tw-p-2 tw-mt-1 tw-text-base">
                      Start Date :
                    </MuiTypography>
                    <MuiTextField
                      value={
                        runHistoryData[0]?.vbt_start_date !== null
                          ? dayjs(runHistoryData[0]?.vbt_start_date).format(
                              "DD/MM/YYYY"
                            )
                          : ""
                      }
                      sx={{
                        padding: "0px",
                        margin: "0px",
                        marginTop: "4px",
                        width: "90px",
                        "& .MuiInputBase-root": {
                          height: 20,
                          fontSize: "12px",
                        },
                      }}
                      InputProps={{
                        readOnly: true,
                      }}
                    />
                  </MuiBox>
                  <MuiBox className="tw-flex tw-ml-2 tw-items-baseline">
                    <MuiTypography className="tw-text-sm tw-p-2 tw-mt-1 tw-text-base">
                      End Date :
                    </MuiTypography>
                    <MuiTextField
                      value={
                        runHistoryData[0]?.vbt_end_date
                          ? dayjs(runHistoryData[0]?.vbt_end_date).format(
                              "DD/MM/YYYY"
                            )
                          : ""
                      }
                      sx={{
                        padding: "0px",
                        margin: "0px",
                        marginTop: "4px",
                        width: "90px",
                        "& .MuiInputBase-root": {
                          height: 20,
                          fontSize: "12px",
                        },
                      }}
                      InputProps={{
                        readOnly: true,
                      }}
                    />
                  </MuiBox>
                </MuiBox>
              </MuiGrid>
            </MuiGrid>
          </MuiBox>
        </MuiBox>
        {runHistoryData[0]?.batch_type === "spotvol" && (
          <MuiBox>
            <MuiBox
              className={
                "tw-inline-flex tw-mt-7 tw-p-1 tw-w-full tw-h-7 tw-bg-slate-800"
              }
            >
              <MuiTypography className="tw-text-sm ">
                Spot-Vol Configuration
              </MuiTypography>
            </MuiBox>
            <MuiGrid
              container
              className="tw-grid lg:tw-grid-cols-12 md:tw-grid-cols-12 sm:tw-grid-cols-1"
            >
              <MuiGrid
                item
                className="tw-mt-2 tw-mr-0.5 lg:tw-col-span-3 md:tw-col-span-3 sm:tw-col-span-12 "
              >
                <MuiBox>
                  <Stack direction="row" justifyContent="space-between">
                    <MuiTypography className="tw-text-sm ">
                      Scenario Metrics
                    </MuiTypography>
                  </Stack>
                  {scenarioMatricsData?.map((item: ScenarioMetrics) => (
                    <MuiBox className=" tw-w-64 " key="spotvol">
                      <MuiBox className="tw-flex">
                        <MuiTypography>Market Value</MuiTypography>
                        <MuiBox className="tw-ml-4" id="spotVolMatrix">
                          <MuiCheckbox
                            checked={item.market_value}
                            name="market_value"
                          />
                        </MuiBox>
                      </MuiBox>
                      <MuiBox className="tw-flex">
                        <MuiTypography>Greeks</MuiTypography>
                        <MuiBox className="tw-ml-14" id="spotVolMatrix">
                          <MuiCheckbox checked={item.greeks} name="greeks" />
                        </MuiBox>
                      </MuiBox>
                      <MuiBox className="tw-flex">
                        <MuiTypography>VaR</MuiTypography>

                        <MuiBox id="spotVolMatrix" sx={{ marginLeft: "78px" }}>
                          <MuiCheckbox checked={item.var} name="var" />
                        </MuiBox>
                      </MuiBox>
                    </MuiBox>
                  ))}
                </MuiBox>
              </MuiGrid>
              <MuiGrid
                item
                className="tw-mt-2 lg:tw-col-span-9 md:tw-col-span-9 sm:tw-col-span-12"
              >
                <MuiBox>
                  <Stack direction="row" justifyContent="space-between">
                    <MuiBox className="tw-contents">
                      <MuiTypography className="tw-text-sm">
                        Spot-Vol Grid
                      </MuiTypography>
                    </MuiBox>
                  </Stack>
                  <MuiBox className="tw-h-16 ag-theme-alpine">
                    <div
                      style={{ height: "67px", width: "auto" }}
                      id="SpotVolConfigurationTable"
                    >
                      <AgGridReact
                        rowData={spotVolData}
                        columnDefs={gridOptions.spotVolColumnDefs}
                        defaultColDef={spotVolDefaultColDef}
                        pagination={false}
                        suppressPaginationPanel
                        suppressContextMenu
                        suppressDragLeaveHidesColumns
                        rowHeight={32}
                        headerHeight={0}
                      />
                    </div>
                  </MuiBox>
                </MuiBox>
              </MuiGrid>
            </MuiGrid>
          </MuiBox>
        )}
      </MuiBox>
    </CustomModal>
  );
};

export default RunHistoryDetailsPopup;
