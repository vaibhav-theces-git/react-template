import React from "react";
import { MuiButton } from "src/common/components/button/MuiButtons/MuiButton";
import MuiTooltip from "src/common/components/tooltip/MuiTooltip";
import {
  Sync,
  PlayArrow,
  Add,
  Edit,
  ContentCopy,
  Delete,
  NewspaperTwoTone,
} from "@mui/icons-material";
import { MuiBox } from "src/common/components/box/MuiBox";
import MuiSelect from "src/common/components/select/MuiSelect";
import { MuiMenuItem } from "src/common/components/menu/MuiMenu";
import { SelectChangeEvent } from "@mui/material";
import { BatchListResponseType } from "src/types/batchConfigurationTypes";

export interface BatchControlActions {
  batchTypeChange: (event: SelectChangeEvent<unknown>) => void;
  selectedbatchType: string;
  selectedBatch?: BatchListResponseType;
  onAddClick: () => void;
  onEditClick: () => void;
  onDisableClick: () => void;
  onRunClick: () => void;
  onRefreshClick: () => void;
  onCloneClick: () => void;
  onEnableClick: () => void;
}

const BatchControls: React.FC<BatchControlActions> = (
  props: BatchControlActions
) => {
  const {
    batchTypeChange,
    selectedbatchType,
    selectedBatch,
    onAddClick,
    onEditClick,
    onDisableClick,
    onRunClick,
    onRefreshClick,
    onCloneClick,
    onEnableClick,
  } = props;

  return (
    <MuiBox>
      <MuiBox className="tw-mt-2 tw-m-0.5 tw-float-left ">
        <MuiSelect
          id="selectedBatchTypeId"
          value={selectedbatchType}
          defaultValue={selectedbatchType}
          onChange={batchTypeChange}
          className="tw-h-5 tw-m-2 tw-ml-5 tw-w-40 tw-text-sm tw-text-left"
        >
          <MuiMenuItem key={1} value={"active batches"} className="tw-text-xs">
            Active Batches
          </MuiMenuItem>
          <MuiMenuItem
            key={2}
            value={"disabled batches"}
            className="tw-text-xs"
          >
            Disabled Batches
          </MuiMenuItem>
        </MuiSelect>
      </MuiBox>

      {selectedbatchType.toLowerCase() === "active batches" ? (
        <MuiBox className="tw-mt-2 tw-m-0.5 tw-float-right ">
          <MuiButton
            className=" tw-bg-slate-500 tw-text-white tw-m-0.5 tw-text-xs tw-font-normal"
            sx={{ width: "32px", minWidth: "32px", height: "32px" }}
            onClick={onAddClick}
          >
            <MuiTooltip title="Add Batch">
              <Add />
            </MuiTooltip>
          </MuiButton>
          <MuiButton
            className=" tw-bg-slate-500 tw-text-white tw-m-0.5 tw-text-xs tw-font-normal"
            sx={{ width: "32px", minWidth: "32px", height: "32px" }}
            onClick={onEditClick}
            disabled={selectedBatch === undefined}
          >
            <MuiTooltip title="Edit Batch">
              <Edit />
            </MuiTooltip>
          </MuiButton>
          <MuiButton
            className=" tw-bg-slate-500 tw-text-white tw-m-0.5 tw-text-xs tw-font-normal"
            sx={{ width: "32px", minWidth: "32px", height: "32px" }}
            onClick={onDisableClick}
          >
            <MuiTooltip title="Disable Batch">
              <Delete />
            </MuiTooltip>
          </MuiButton>
          <MuiButton
            className=" tw-bg-slate-500 tw-text-white tw-m-0.5 tw-text-xs tw-font-normal"
            sx={{ width: "32px", minWidth: "32px", height: "32px" }}
            onClick={onCloneClick}
          >
            <MuiTooltip title="Clone Batch">
              <ContentCopy />
            </MuiTooltip>
          </MuiButton>
          <MuiButton
            className=" tw-bg-slate-500 tw-text-white tw-m-0.5 tw-text-xs tw-font-normal "
            sx={{ width: "32px", minWidth: "32px", height: "32px" }}
            onClick={onRunClick}
            disabled={selectedBatch === undefined}
          >
            <MuiTooltip title="Run Batch">
              <PlayArrow />
            </MuiTooltip>
          </MuiButton>
          <MuiButton
            className=" tw-bg-slate-500 tw-text-white tw-m-0.5 tw-text-xs tw-font-normal "
            sx={{ width: "32px", minWidth: "32px", height: "32px" }}
            onClick={onRefreshClick}
          >
            <MuiTooltip title="Refresh">
              <Sync />
            </MuiTooltip>
          </MuiButton>
          <MuiButton
            className=" tw-bg-slate-500 tw-text-white tw-m-0.5 tw-text-xs tw-font-normal"
            sx={{ width: "32px", minWidth: "32px", height: "32px" }}
            onClick={onEnableClick}
            disabled
          >
            <MuiTooltip title="Enable Batch">
              <NewspaperTwoTone />
            </MuiTooltip>
          </MuiButton>
        </MuiBox>
      ) : (
        <MuiBox className="tw-mt-2 tw-m-0.5 tw-float-right ">
          <MuiButton
            className=" tw-bg-slate-500 tw-text-white tw-m-0.5 tw-text-xs tw-font-normal"
            sx={{ width: "32px", minWidth: "32px", height: "32px" }}
            onClick={onAddClick}
            disabled
          >
            <MuiTooltip title="Add Batch">
              <Add />
            </MuiTooltip>
          </MuiButton>
          <MuiButton
            className=" tw-bg-slate-500 tw-text-white tw-m-0.5 tw-text-xs tw-font-normal"
            sx={{ width: "32px", minWidth: "32px", height: "32px" }}
            onClick={onEditClick}
            disabled
          >
            <MuiTooltip title="Edit Batch">
              <Edit />
            </MuiTooltip>
          </MuiButton>
          <MuiButton
            className=" tw-bg-slate-500 tw-text-white tw-m-0.5 tw-text-xs tw-font-normal"
            sx={{ width: "32px", minWidth: "32px", height: "32px" }}
            onClick={onDisableClick}
            disabled
          >
            <MuiTooltip title="Disable Batch">
              <Delete />
            </MuiTooltip>
          </MuiButton>
          <MuiButton
            className=" tw-bg-slate-500 tw-text-white tw-m-0.5 tw-text-xs tw-font-normal"
            sx={{ width: "32px", minWidth: "32px", height: "32px" }}
            onClick={onCloneClick}
            disabled
          >
            <MuiTooltip title="Clone Batch">
              <ContentCopy />
            </MuiTooltip>
          </MuiButton>
          <MuiButton
            className=" tw-bg-slate-500 tw-text-white tw-m-0.5 tw-text-xs tw-font-normal "
            sx={{ width: "32px", minWidth: "32px", height: "32px" }}
            onClick={onRunClick}
            disabled
          >
            <MuiTooltip title="Run Batch">
              <PlayArrow />
            </MuiTooltip>
          </MuiButton>
          <MuiButton
            className=" tw-bg-slate-500 tw-text-white tw-m-0.5 tw-text-xs tw-font-normal "
            sx={{ width: "32px", minWidth: "32px", height: "32px" }}
            onClick={onRefreshClick}
          >
            <MuiTooltip title="Refresh">
              <Sync />
            </MuiTooltip>
          </MuiButton>
          <MuiButton
            className=" tw-bg-slate-500 tw-text-white tw-m-0.5 tw-text-xs tw-font-normal"
            sx={{ width: "32px", minWidth: "32px", height: "32px" }}
            onClick={onEnableClick}
          >
            <MuiTooltip title="Enable Batch">
              <NewspaperTwoTone />
            </MuiTooltip>
          </MuiButton>
        </MuiBox>
      )}
    </MuiBox>
  );
};

export default BatchControls;
