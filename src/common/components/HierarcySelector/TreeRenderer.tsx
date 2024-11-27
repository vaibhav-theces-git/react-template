import React from "react";
import FormControlLabel from "@mui/material/FormControlLabel";
import { MuiCheckbox } from "src/common/components/checkbox/MuiCheckbox/MuiCheckbox";
import { MuiRadio } from "src/common/components/radio/MuiRadio";

import { InternalTreeState } from "./HierarchyTypes";
import { CustomTreeItem } from "./CustomTreeContent";

interface TreeRendererProps {
  onChange: (
    checked: boolean,
    hasChildren: boolean,
    treeStateUid: string
  ) => void;
  hideIfSingleChild: boolean;
  treeState: InternalTreeState;
  multiSelect: boolean;
  onSingleItemSelect: (checked: boolean, path: string) => void;
}
/**
 * Recursive tree renderer
 */
export const TreeRenderer = ({
  onChange,
  hideIfSingleChild,
  treeState,
  multiSelect,
  onSingleItemSelect,
}: TreeRendererProps) => {
  let hasChild = false;
  if (treeState?.children) {
    hasChild = hideIfSingleChild
      ? treeState.children.length > 1
      : treeState.children.length > 0;
  }
  // hasChild and hasActualCHildren can be different
  // eslint-disable-next-line no-self-compare
  const hasActualChildren = Boolean(treeState?.children?.length ?? 0 > 0);
  return treeState ? (
    <CustomTreeItem
      key={treeState.uid}
      nodeId={treeState.uid.toString()}
      label={
        <FormControlLabel
          control={
            multiSelect ? (
              <MuiCheckbox
                indeterminate={typeof treeState.selected !== "boolean"}
                checked={
                  typeof treeState.selected === "boolean"
                    ? treeState.selected
                    : false
                }
                onChange={(
                  e: React.ChangeEvent<HTMLInputElement>,
                  checked: boolean
                ) => onChange(checked, hasActualChildren, treeState.uid)}
              />
            ) : (
              <MuiRadio
                checked={
                  typeof treeState.selected === "boolean"
                    ? treeState.selected
                    : false
                }
                onChange={() => onSingleItemSelect(true, treeState.uid)}
              />
            )
          }
          label={treeState.label}
          labelPlacement="end"
          className="tw-mr-2 tw-w-full"
        />
      }
    >
      {hasChild && treeState.children
        ? treeState.children.map((node: InternalTreeState) => (
            <TreeRenderer
              treeState={node}
              onChange={onChange}
              hideIfSingleChild
              key={node.uid}
              multiSelect={multiSelect}
              onSingleItemSelect={onSingleItemSelect}
            />
          ))
        : null}
    </CustomTreeItem>
  ) : null;
};
