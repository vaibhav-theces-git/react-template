import { useEffect, useMemo, useState } from "react";
import { MuiBox } from "src/common/components/box/MuiBox";
import { MuiButton } from "src/common/components/button/MuiButtons/MuiButton";
import MuiGrid from "src/common/components/grid/MuiGrid";
import MuiTooltip from "src/common/components/tooltip/MuiTooltip";
import { MuiTypography } from "src/common/components/typography/MuiTypography/MuiTypography";
import { MuiStack } from "src/common/components/stack/MuiStack";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import Table from "src/common/components/Table/Table";
import { Column } from "react-table";
import {
  BatchAggregationResponseType,
  BatchVarResponseType,
} from "src/types/batchConfigurationTypes";
import { BATCH_TYPES } from "src/common/constants/batchTypeConstant";
import { MuiCheckbox } from "src/common/components/checkbox/MuiCheckbox";
import { HierarchyLevels } from "src/common/constants/AggragationLevelConstant";
import AddVarConfig from "./AddVarConfig";

export interface AggregateConfigProps {
  batchAggregationList: BatchAggregationResponseType[];
  IsVarBackTestBatch: boolean;
  batchVarLevelList: BatchVarResponseType[];
  onHierarchySave: (newHierarchy: BatchAggregationResponseType) => void;
  onHierarchyDelete: (hierarchy: BatchAggregationResponseType) => void;
  onVarConfigSave: (newVarConfig: BatchVarResponseType) => void;
  selectedBatchType: string;
}

const AggregateConfig = (props: AggregateConfigProps) => {
  const {
    batchAggregationList,
    IsVarBackTestBatch,
    batchVarLevelList,
    onHierarchySave,
    onHierarchyDelete,
    onVarConfigSave,
    selectedBatchType,
  } = props;

  const [newVarConfigPopupVisible, setNewVarConfigPopupVisible] =
    useState(false);

  const handleNewVarConfigPopupOpen = () => {
    setNewVarConfigPopupVisible(true);
  };

  const handleNewVarConfigPopupClose = () => {
    setNewVarConfigPopupVisible(false);
  };
  const varColumns: Column<BatchVarResponseType>[] = useMemo(
    () => [
      {
        Header: "Interval",
        accessor: "name",
        width: 5,
        align: "left",
      },
      {
        Header: "Value",
        accessor: "value",
        width: 5,
        align: "left",
      },
    ],
    []
  );

  const [selectedLevels, setSelectedLevels] = useState<string[]>([]);
  const handleCheckboxChange = (level: string) => {
    setSelectedLevels((prevSelectedLevels) => {
      const isSelected = prevSelectedLevels.includes(level);
      let updatedLevels;

      if (isSelected) {
        updatedLevels = prevSelectedLevels.filter((l) => l !== level);
        onHierarchyDelete({ name: level, value: level });
      } else {
        updatedLevels = [...prevSelectedLevels, level];
        onHierarchySave({ name: level, value: level });
      }
      return updatedLevels;
    });
  };

  const computedLevels = useMemo(() => {
    return batchAggregationList.map((h) => h.value);
  }, [batchAggregationList]);

  useEffect(() => {
    setSelectedLevels(computedLevels);
  }, [computedLevels]);

  return (
    <>
      <MuiGrid
        container
        item
        className="tw-grid lg:tw-grid-cols-2 md:tw-grid-cols-2 sm:tw-grid-cols-1 tw-grow tw-gap-px tw-h-full"
      >
        <MuiBox className=" lg:tw-grid-cols-1 md:tw-grid-cols-1 sm:tw-grid-cols-1  tw-m-0.5">
          <MuiStack direction="row" justifyContent="space-between">
            <MuiBox>
              <MuiTypography
                className={
                  IsVarBackTestBatch
                    ? "tw-text-sm tw-mt-2 tw-text-gray-600"
                    : "tw-text-sm tw-mt-2"
                }
              >
                Aggregation Hierarchy
              </MuiTypography>
            </MuiBox>
          </MuiStack>
          <MuiBox
            className=" tw-h-36 tw-overflow-hidden tw-w-full tw-mt-2"
            sx={{ border: 1, borderColor: "#1E2435" }}
          >
            {HierarchyLevels.map((level: string) => (
              <div
                key={level}
                className="tw-flex tw-items-center tw-text-sm tw-h-9"
              >
                <MuiCheckbox
                  checked={selectedLevels.includes(level)}
                  onChange={() => handleCheckboxChange(level)}
                  disabled={
                    selectedBatchType === BATCH_TYPES.SPOT_VOL ||
                    selectedBatchType === BATCH_TYPES.VBT
                  }
                />
                <MuiTypography className="tw-text-sm">{level}</MuiTypography>
              </div>
            ))}
          </MuiBox>
        </MuiBox>
        <MuiBox className=" lg:tw-grid-cols-1 md:tw-grid-cols-1 sm:tw-grid-cols-1  tw-m-0.5">
          <MuiStack direction="row" justifyContent="space-between">
            <MuiBox>
              <MuiTypography className="tw-text-sm tw-mt-2">
                VaR Configuration
              </MuiTypography>
            </MuiBox>
            <MuiBox>
              <MuiButton
                className=" tw-bg-slate-500 tw-text-white tw-m-0.5 tw-ml-16 tw-text-xs tw-font-normal"
                sx={{ width: "32px", minWidth: "32px", height: "32px" }}
                disabled
              >
                <MuiTooltip
                  title="Add VaR"
                  onClick={handleNewVarConfigPopupOpen}
                >
                  <AddIcon />
                </MuiTooltip>
              </MuiButton>
              <MuiButton
                className=" tw-bg-slate-500 tw-text-white tw-m-0.5 tw-text-xs tw-font-normal"
                sx={{ width: "32px", minWidth: "32px", height: "32px" }}
                disabled
              >
                <MuiTooltip title="Delete VaR">
                  <DeleteIcon />
                </MuiTooltip>
              </MuiButton>
            </MuiBox>
          </MuiStack>
          <MuiBox
            className=" tw-h-36 tw-overflow-auto tw-w-full"
            sx={{ border: 1, borderColor: "#1E2435" }}
          >
            <Table
              data={batchVarLevelList}
              columns={varColumns}
              enablePagination={false}
              enableSorting={false}
              enableRowSelection
              noDataTableClasses="nodatatext-left"
              noDataTableMessage="Use + button to add VAR Configuration(s)."
            />
          </MuiBox>
        </MuiBox>
      </MuiGrid>
      <AddVarConfig
        isOpen={newVarConfigPopupVisible}
        onCloseCallback={handleNewVarConfigPopupClose}
        onSaveCallback={onVarConfigSave}
      />
    </>
  );
};

export default AggregateConfig;
