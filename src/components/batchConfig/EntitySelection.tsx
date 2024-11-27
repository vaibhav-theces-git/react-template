import React from "react";
import { MuiBox } from "src/common/components/box/MuiBox";
import { MuiCheckbox } from "src/common/components/checkbox/MuiCheckbox";
import { MuiTextField } from "src/common/components/input/MuiInputs";
import {
  MuiList,
  MuiListItem,
  MuiListItemIcon,
  MuiListItemText,
} from "src/common/components/list/MuiList";
import { MuiTypography } from "src/common/components/typography/MuiTypography/MuiTypography";
import { LegelEntityIdsNamesResponseType } from "src/types/batchConfigurationTypes";
import { MuiButton } from "src/common/components/button/MuiButtons/MuiButton";
import {
  entitySelectionTextBoxStyle,
  primaryTypographyProps,
} from "src/common/utilities/styleUtils/batchConfigStyles";

export interface EntitySelectionProps {
  searchTerm: string;
  handleSearchTermChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  isSelectAllChecked: boolean;
  handleSelectAllValueChange: (
    event: React.ChangeEvent<HTMLInputElement>
  ) => void;
  filteredEntityData: LegelEntityIdsNamesResponseType[];
  selectedEntityList: LegelEntityIdsNamesResponseType[];
  handleToggleEntitySelection: (
    value: LegelEntityIdsNamesResponseType
  ) => () => void;
  handleEntitySelectionSaveCallback: () => void;
  handleEntitySelectionCloseCallback: () => void;
}

const EntitySelection = (entitySelectionProps: EntitySelectionProps) => {
  const {
    searchTerm,
    handleSearchTermChange,
    isSelectAllChecked,
    handleSelectAllValueChange,
    filteredEntityData,
    selectedEntityList,
    handleToggleEntitySelection,
    handleEntitySelectionSaveCallback,
    handleEntitySelectionCloseCallback,
  } = entitySelectionProps;
  return (
    <MuiBox className="tw-w-80 tw-h-96 tw-overflow-hidden">
      <MuiBox>
        <MuiTextField
          placeholder="Search"
          value={searchTerm}
          onChange={handleSearchTermChange}
          sx={entitySelectionTextBoxStyle}
        />
      </MuiBox>
      <MuiBox className="tw-inline-flex tw-mt-2 tw-p-1 tw-w-full tw-items-center">
        <MuiCheckbox
          checked={isSelectAllChecked}
          value={isSelectAllChecked}
          onChange={handleSelectAllValueChange}
        />
        <MuiTypography className="tw-text-sm ">Select All</MuiTypography>
      </MuiBox>
      {filteredEntityData.length === 0 ? (
        <MuiTypography className="tw-text-center">
          No Data Available
        </MuiTypography>
      ) : (
        <MuiList
          role="list"
          className="tw-w-auto tw-h-64 tw-overflow-auto tw-pb-7"
        >
          {filteredEntityData?.map((value: LegelEntityIdsNamesResponseType) => {
            const labelId = `entity-${value.le_id}-label`;
            return (
              <MuiListItem
                key={value.le_id}
                role="listitem"
                onClick={handleToggleEntitySelection(value)}
              >
                <MuiListItemIcon>
                  <MuiCheckbox
                    checked={selectedEntityList.some(
                      (item) => item.le_id === value.le_id
                    )}
                    tabIndex={-1}
                    disableRipple
                    inputProps={{
                      "aria-labelledby": labelId,
                    }}
                  />
                </MuiListItemIcon>
                <MuiListItemText
                  className="tw-text-sm"
                  id={labelId}
                  primary={value.name}
                  primaryTypographyProps={primaryTypographyProps}
                />
              </MuiListItem>
            );
          })}
        </MuiList>
      )}
      <MuiBox className="tw-absolute tw-bottom-0 tw-left-0 tw-right-0 tw-text-right tw-p-2 ">
        <MuiButton
          className="tw-m-1 tw-bg-slate-75"
          onClick={handleEntitySelectionSaveCallback}
        >
          Save
        </MuiButton>
        <MuiButton
          className="tw-m-1 tw-bg-slate-75"
          onClick={handleEntitySelectionCloseCallback}
        >
          Cancel
        </MuiButton>
      </MuiBox>
    </MuiBox>
  );
};

export default EntitySelection;
