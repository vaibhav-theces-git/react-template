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

import { MuiButton } from "src/common/components/button/MuiButtons/MuiButton";
import {
  LegalEntity,
  LegelEntityAccountType,
} from "src/types/batchConfigurationTypes";
import {
  entitySelectionTextBoxStyle,
  primaryTypographyProps,
} from "src/common/utilities/styleUtils/batchConfigStyles";

export interface AccountSelectionProps {
  searchTerm: string;
  handleSearchTermChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  filteredAccData: LegelEntityAccountType[];
  selectedEntity: LegalEntity;
  handleToggleAccountSelection: (value: LegelEntityAccountType) => () => void;
  selectedAccountList: LegelEntityAccountType[];
  handleAccountSelectionSaveCallback: () => void;
  handleAccountSelectionCloseCallback: () => void;
}
// code added
const AccountSelection = (accountSelectionProps: AccountSelectionProps) => {
  const {
    searchTerm,
    handleSearchTermChange,
    filteredAccData,
    selectedEntity,
    handleToggleAccountSelection,
    selectedAccountList,
    handleAccountSelectionSaveCallback,
    handleAccountSelectionCloseCallback,
  } = accountSelectionProps;
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
      {filteredAccData.length === 0 ? (
        <MuiTypography className="tw-text-center">
          No Data Available
        </MuiTypography>
      ) : (
        <MuiList
          role="list"
          className="tw-w-auto tw-h-72 tw-overflow-auto tw-pb-7"
        >
          {filteredAccData?.map((value: LegelEntityAccountType) => {
            const labelId = `${selectedEntity?.le_id}-acc-${value.name}-label`;
            return (
              <MuiListItem
                key={`${value.name}-${value.acc_id}`}
                role="listitem"
                onClick={handleToggleAccountSelection(value)}
              >
                <MuiListItemIcon>
                  <MuiCheckbox
                    checked={selectedAccountList.some(
                      (item) => item.acc_id === value.acc_id
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
      <MuiBox className="tw-absolute tw-bottom-0 tw-left-0 tw-right-0 tw-text-right tw-p-2 tw-bg-slate-50 ">
        <MuiButton onClick={handleAccountSelectionSaveCallback}>Save</MuiButton>
        <MuiButton onClick={handleAccountSelectionCloseCallback}>
          Cancel
        </MuiButton>
      </MuiBox>
    </MuiBox>
  );
};

export default AccountSelection;
