import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Stack,
} from "@mui/material";
import { ColDef } from "ag-grid-enterprise";
import { AgGridReact } from "ag-grid-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { MuiBox } from "src/common/components/box/MuiBox";
import MuiGrid from "src/common/components/grid/MuiGrid";
import { MuiTypography } from "src/common/components/typography/MuiTypography/MuiTypography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { MuiCheckbox } from "src/common/components/checkbox/MuiCheckbox";
import { MuiButton } from "src/common/components/button/MuiButtons/MuiButton";
import { MuiIconButton } from "src/common/components/button/MuiButtons/MuiIconButton";
import {
  ScenarioGrid,
  ScenarioMetrics,
} from "src/types/batchConfigurationTypes";

import { validateSpotVolGridData } from "src/common/utilities/ValidationUtils/ValidationUtils";
import { spotVoldata } from "./secenarioData";
import styles from "../../override.module.css";

export interface ScenarioAnalysisProps {
  selectedMatrix: ScenarioMetrics[] | null;
  selectedBatchType: string;
  matrixChangeCallback: (
    event: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => void;
  spotVolGridChangeCallback: (params: any) => void;
  matricsData: ScenarioMetrics[] | null;
  selectedSpotVolGrid: ScenarioGrid[] | null;
}

const ScenarioAnalysis = (scenarioAnalysisProps: ScenarioAnalysisProps) => {
  const {
    selectedMatrix,
    selectedBatchType,
    matrixChangeCallback,
    spotVolGridChangeCallback,
    selectedSpotVolGrid,
  } = scenarioAnalysisProps;
  const gridRef = useRef<AgGridReact<any>>(null);
  const [gridData, setGridData] = useState<ScenarioGrid[] | null>([]);
  const [isSpotVolExpanded, setIsSpotVolExpanded] = useState(false);

  const handleSpotVolGridValueChange = (params: { data: ScenarioGrid }) => {
    const tempData = selectedSpotVolGrid;
    let spotGrid: ScenarioGrid;
    let volGrid: ScenarioGrid;
    if (params.data.spotvol === "spot") {
      spotGrid = params.data;
      volGrid = tempData
        ?.filter((data: ScenarioGrid) => data.spotvol === "vol")
        ?.at(0) as ScenarioGrid;
    } else if (params.data.spotvol === "vol") {
      spotGrid = tempData
        ?.filter((data: ScenarioGrid) => data.spotvol === "spot")
        ?.at(0) as ScenarioGrid;
      volGrid = params.data;
    } else {
      spotGrid = tempData
        ?.filter((data: ScenarioGrid) => data.spotvol === "spot")
        ?.at(0) as ScenarioGrid;

      volGrid = tempData
        ?.filter((data: ScenarioGrid) => data.spotvol === "vol")
        ?.at(0) as ScenarioGrid;
    }

    const updatedData: ScenarioGrid[] = [spotGrid, volGrid];
    validateSpotVolGridData(updatedData);
    spotVolGridChangeCallback(updatedData);
  };

  const gridOptions = {
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

  const handleChange = () => {
    if (selectedBatchType === "spotvol") {
      setIsSpotVolExpanded(!isSpotVolExpanded);
    }
  };

  const mirrorSpotVolChange = () => {
    const id = "mirror";
    let updatedSpotVolGrid = selectedSpotVolGrid;
    if (id === "mirror" && updatedSpotVolGrid !== null && selectedSpotVolGrid) {
      updatedSpotVolGrid = updatedSpotVolGrid?.map((data) => ({
        ...data,
        n1: data.p1 * -1,
        n2: data.p2 * -1,
        n3: data.p3 * -1,
        n4: data.p4 * -1,
        n5: data.p5 * -1,
      }));
    }
    setGridData(updatedSpotVolGrid);
    spotVolGridChangeCallback(updatedSpotVolGrid);
  };

  useEffect(() => {
    const length = selectedSpotVolGrid?.length as number;
    setGridData(length <= 0 ? spotVoldata : selectedSpotVolGrid);
    setIsSpotVolExpanded(selectedBatchType === "spotvol");
  }, [selectedSpotVolGrid, selectedBatchType]);

  return (
    <Accordion
      disabled={!(selectedBatchType === "spotvol")}
      expanded={isSpotVolExpanded}
    >
      <AccordionSummary
        expandIcon={
          <MuiIconButton onClick={handleChange}>
            <ExpandMoreIcon />
          </MuiIconButton>
        }
        className="tw-text-sm tw-bg-slate-800"
      >
        Spot Vol Configuration
      </AccordionSummary>
      <AccordionDetails className="tw-bg-slate-900">
        <MuiBox>
          <MuiGrid
            container
            className="tw-grid lg:tw-grid-cols-12 md:tw-grid-cols-12 sm:tw-grid-cols-1"
          >
            <MuiGrid
              item
              className="tw-mt-0.5 tw-mr-0.5 lg:tw-col-span-3 md:tw-col-span-3 sm:tw-col-span-12"
            >
              <MuiBox>
                <Stack direction="row" justifyContent="space-between">
                  <MuiTypography className="tw-text-sm">
                    Scenario Metrics
                  </MuiTypography>
                </Stack>
                {selectedBatchType === "spotvol" &&
                  isSpotVolExpanded &&
                  selectedMatrix?.map((item, index) => (
                    <MuiBox className="tw-h-44 tw-w-64 " key="spotvol">
                      <MuiBox className="tw-flex">
                        <MuiTypography>Market Value</MuiTypography>
                        <MuiBox className="tw-ml-4" id="spotVolMatrix">
                          <MuiCheckbox
                            className={styles.customCheckbox}
                            checked={item.market_value}
                            onChange={(event) =>
                              matrixChangeCallback(event, index)
                            }
                            name="market_value"
                          />
                        </MuiBox>
                      </MuiBox>
                      <MuiBox className="tw-flex">
                        <MuiTypography>Greeks</MuiTypography>
                        <MuiBox className="tw-ml-14" id="spotVolMatrix">
                          <MuiCheckbox
                            className={styles.customCheckbox}
                            checked={item.greeks}
                            onChange={(event) =>
                              matrixChangeCallback(event, index)
                            }
                            name="greeks"
                          />
                        </MuiBox>
                      </MuiBox>
                      <MuiBox className="tw-flex">
                        <MuiTypography>VaR</MuiTypography>

                        <MuiBox id="spotVolMatrix" sx={{ marginLeft: "78px" }}>
                          <MuiCheckbox
                            className={styles.customCheckbox}
                            checked={item.var}
                            onChange={(event) =>
                              matrixChangeCallback(event, index)
                            }
                            name="var"
                          />
                        </MuiBox>
                      </MuiBox>
                    </MuiBox>
                  ))}
              </MuiBox>
            </MuiGrid>
            <MuiGrid
              item
              className="tw-mt-0.5 lg:tw-col-span-9 md:tw-col-span-9 sm:tw-col-span-12"
            >
              <MuiBox>
                <Stack direction="row" justifyContent="space-between">
                  <MuiBox className="tw-contents">
                    <MuiTypography className="tw-text-sm">
                      Spot-Vol Grid
                    </MuiTypography>
                    <MuiButton
                      onClick={mirrorSpotVolChange}
                      size="small"
                      className="tw-bg-slate-100 tw-mb-1"
                    >
                      Mirror
                    </MuiButton>
                  </MuiBox>
                </Stack>
                <MuiBox className="tw-h-16 ag-theme-alpine">
                  <div
                    style={{ height: "67px", width: "auto" }}
                    id="SpotVolConfigurationTable"
                  >
                    {selectedBatchType === "spotvol" && isSpotVolExpanded && (
                      <AgGridReact
                        ref={gridRef}
                        rowData={gridData}
                        columnDefs={gridOptions.spotVolColumnDefs}
                        defaultColDef={spotVolDefaultColDef}
                        pagination={false}
                        suppressPaginationPanel
                        suppressContextMenu
                        suppressDragLeaveHidesColumns
                        singleClickEdit
                        onCellValueChanged={handleSpotVolGridValueChange}
                        rowHeight={32}
                        headerHeight={0}
                        stopEditingWhenCellsLoseFocus
                      />
                    )}
                  </div>
                </MuiBox>
              </MuiBox>
            </MuiGrid>
          </MuiGrid>
        </MuiBox>
      </AccordionDetails>
    </Accordion>
  );
};

export default ScenarioAnalysis;
