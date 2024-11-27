import React, { useState, useCallback } from "react";

import Popover from "@mui/material/Popover";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import cx from "classnames";
import { MuiButton } from "src/common/components/button/MuiButtons/MuiButton";
import { MuiCheckbox } from "src/common/components/checkbox/MuiCheckbox/MuiCheckbox";
import { MuiFormControlLabel } from "src/common/components/form/MuiForms";
import { MuiBox } from "src/common/components/box/MuiBox";
import { activeVenueBtnSectionTID } from "src/common/constants/testids";
import { TreeviewMultiSelect } from "./TreeviewMultiSelect";
import { InternalTreeState, TreeState, LabelResolver } from "./HierarchyTypes";

/**
 *
 * @attribute value - to store selected value between different items
 * @attribute toggleHandler -  callback to handle selection toggling
 * @attribute hideIfSingleChild -  if there is only a single child, shown only parent item
 *
 */
interface ChipDropdownProps {
  value: number;
  toggleHandler: (value: number, opened: boolean) => void;
  open: boolean;
  hideIfSingleChild: boolean;
  treeState: InternalTreeState;
  onApply: (node: InternalTreeState | TreeState | null) => void;
  multiSelect: boolean;
  onChange: (
    checked: boolean,
    hasChildren: boolean,
    treeStateUid: string,
    immediateApply?: boolean
  ) => void;
  onReset: () => void;
  onSingleItemSelect: (checked: boolean, path: string) => void;
  buttonLabelResolver?: LabelResolver;
  selectAllLabel?: string;
  placeholder?: string;
  defaultButton?: boolean;
}
const labelRenderFunction = (labelResolver?: LabelResolver, item?: TreeState) =>
  item ? (labelResolver ? labelResolver(item) : item.label) : "";

export const ChipDropdown = ({
  value,
  toggleHandler,
  open,
  hideIfSingleChild,
  multiSelect,
  treeState,
  onChange,
  onApply,
  onReset,
  onSingleItemSelect,
  buttonLabelResolver,
  selectAllLabel = "Select All",
  placeholder = "Select Items",
  defaultButton = false,
}: ChipDropdownProps) => {
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);

  const showTreeView = useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      event.stopPropagation();
      if (open) {
        setAnchorEl(null);
        toggleHandler(-1, open);
      } else {
        setAnchorEl(event.currentTarget);
        toggleHandler(value, open);
      }
    },
    [value, toggleHandler, open]
  );

  let hasChild = false;
  if (treeState?.children) {
    hasChild = hideIfSingleChild
      ? treeState.children.length > 1
      : treeState.children.length > 0;
  }
  const handleClose = useCallback(() => {
    setAnchorEl(null);
    toggleHandler(-1, open);
  }, [open, toggleHandler]);

  const onCancel = useCallback(() => {
    onReset();
    handleClose();
  }, [onReset, handleClose]);

  const onselectAllChildrenClick = useCallback(() => {
    if (treeState.selected === true) {
      onChange(
        false,
        // eslint-disable-next-line no-self-compare
        Boolean(treeState?.children?.length ?? 0 > 0),
        treeState.uid
      );
    } else {
      onChange(
        true,
        // eslint-disable-next-line no-self-compare
        Boolean(treeState?.children?.length ?? 0 > 0),
        treeState.uid
      );
    }
  }, [treeState, onChange]);
  const onApplyClick = useCallback(() => {
    onApply(treeState);
    handleClose();
  }, [treeState, onApply, handleClose]);
  const onSingleItemSelectAndClose = useCallback(
    (checked: boolean, path: string) => {
      onSingleItemSelect(checked, path);
      handleClose();
    },
    [handleClose, onSingleItemSelect]
  );

  // There is no apply click for outer layer button click. immediate apply on change
  const onButtonClick = useCallback(() => {
    if (multiSelect) {
      onChange(
        !treeState.selected,
        // eslint-disable-next-line no-self-compare
        Boolean(treeState?.children?.length ?? 0 > 0),
        treeState.uid,
        true
      );
    } else {
      onSingleItemSelectAndClose(
        !treeState.selected,
        treeState?.children?.[0].uid || ""
      );
    }
  }, [
    multiSelect,
    onChange,
    treeState.selected,
    treeState?.children,
    treeState.uid,
    onSingleItemSelectAndClose,
  ]);
  const label = labelRenderFunction(buttonLabelResolver, treeState);
  return (
    <>
      <MuiButton
        variant="contained"
        fxvariant={
          !defaultButton && treeState?.selected
            ? "blueoutlined"
            : "greyoutlined"
        }
        onClick={hasChild ? showTreeView : onButtonClick}
        size="small"
        className={cx("tw-sm tw-h-8 tw-whitespace-nowrap", {
          "!tw-h-10 !tw-w-52 !tw-text-slate-200 tw-justify-between tw-px-3 !tw-font-normal tw-text-base":
            defaultButton,
        })}
        endIcon={hasChild ? <ArrowDropDownIcon /> : undefined}
        test-dataid={`${activeVenueBtnSectionTID}-${label}`}
      >
        {label}
      </MuiButton>
      {anchorEl && (
        <Popover
          open={open}
          anchorEl={anchorEl}
          onClose={onCancel}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "left",
          }}
        >
          <MuiBox
            className={cx("tw-p-3 tw-bg-secondary", {
              "tw-w-52": defaultButton,
            })}
            gap={1}
          >
            <MuiBox className="tw-mb-3">{placeholder}</MuiBox>
            <TreeviewMultiSelect
              hideIfSingleChild
              multiSelect={multiSelect}
              treeState={treeState}
              onChange={onChange}
              onSingleItemSelect={onSingleItemSelectAndClose}
            >
              {multiSelect && (
                <MuiFormControlLabel
                  control={
                    <MuiCheckbox
                      checked={
                        typeof treeState?.selected === "boolean"
                          ? treeState.selected
                          : false
                      }
                      onChange={onselectAllChildrenClick}
                    />
                  }
                  label={selectAllLabel}
                  labelPlacement="end"
                />
              )}
            </TreeviewMultiSelect>
            {multiSelect && (
              <MuiBox className="tw-flex tw-justify-between tw-mt-3">
                <MuiButton
                  className="tw-w-1/2 tw-mr-2"
                  fxvariant="outlined"
                  size="small"
                  onClick={onCancel}
                >
                  Cancel
                </MuiButton>

                <MuiButton
                  className="tw-w-1/2"
                  fxvariant="white"
                  size="small"
                  onClick={onApplyClick}
                >
                  Apply
                </MuiButton>
              </MuiBox>
            )}
          </MuiBox>
        </Popover>
      )}
    </>
  );
};
