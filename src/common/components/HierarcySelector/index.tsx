import { useCallback, useState } from "react";
import { MuiBox } from "src/common/components/box/MuiBox";
import { If } from "src/common/components/conditional";
import { MuiButton } from "../button/MuiButtons/MuiButton";
import { ChipDropdown } from "./ChipDropdown";
import { HierarchyConfig, TreeState, LabelResolver } from "./HierarchyTypes";
import { useTreeUpdate } from "./useTreeUpdateHook";
/**
 *
 * @attribute initialTreeState - Treestate to show initial values (if we need to show an item selected by default,
 * use this prop to set it, this state will be considering only first time)
 * @attribute multiSelect - set it true for multi select
 * @attribute onTreeUpdate - this callback will provide with updated treestate which can be manipulated for sending back to api
 *
 */
interface HierarchySelectorProps {
  initialTreeState: TreeState;
  multiSelect: boolean;
  onTreeUpdate?: (treeState: TreeState | null) => void;
  onTreeStateInit?: (treeState: TreeState | null) => void;
  selectAllLabel?: string;
  placeholder?: string;
  buttonLabelResolver?: LabelResolver;
  keepOneSelectedAlways?: boolean;
  showSelectAllAtParentOption?: boolean;
  defaultButton?: boolean;
}

/**
 * Utility recursive function for getting required hierarchy formatted children from CONFIG
 * @param config
 * @param hierarchyData
 * @param start
 * @param uid
 * @returns
 */
const getChildrenState = (
  config: HierarchyConfig[],
  hierarchyData: Array<Record<string, any>> | null,
  start = 0,
  defaultChildSelection = true,
  uid = `root`
): TreeState[] | null => {
  if (hierarchyData) {
    return hierarchyData.map(
      (data: Record<string, any> | string, index: number) => {
        const { id, label, isObject, childKey } = config[start];

        if (isObject && typeof data !== "string") {
          return {
            id: data[id] as string,
            label: data[label] as string,
            selected: defaultChildSelection,
            originalData: data,
            children: getChildrenState(
              config,
              data[childKey] as Array<Record<string, any>>,
              start + 1,
              defaultChildSelection,
              `${uid}.${index}`
            ),
          } as TreeState;
        }
        return {
          id: data as string,
          label: data,
          selected: defaultChildSelection,
          originalData: data,
          children: getChildrenState(
            config,
            null,
            start + 1,
            defaultChildSelection,
            `${uid}-${index}`
          ),
        } as TreeState;
      }
    );
  }
  return null;
};
/**
 * Utility function for getting required hierarchy structure from a different hierarchy data
 *
 * @param config
 * @param hierarchyData
 * @param start
 * @param uid
 * @returns
 */
export const getTreeState = (
  config: HierarchyConfig[],
  hierarchyData: any[],
  defaultChildSelection = true,
  start = 0,
  uid = `root`
) => {
  return hierarchyData?.length > 0
    ? {
        id: "root",
        label: "root",
        children: getChildrenState(
          config,
          hierarchyData,
          start,
          defaultChildSelection,
          uid
        ),
        selected: false,
      }
    : null;
};

export const HierarchySelector = (props: HierarchySelectorProps) => {
  const {
    initialTreeState,
    onTreeUpdate,
    onTreeStateInit,
    multiSelect,
    buttonLabelResolver,
    keepOneSelectedAlways = true,
    selectAllLabel = "Select All",
    placeholder = "Select Items",
    showSelectAllAtParentOption = true,
    defaultButton = false,
  } = props;

  const [opened, setOpened] = useState(-1);

  const {
    treeState,
    onTreeChange,
    onApplyTreeState,
    onTreeReset,
    onSelectNode,
  } = useTreeUpdate(
    initialTreeState,
    onTreeStateInit,
    keepOneSelectedAlways,
    onTreeUpdate,
    "root"
  );
  const toggleHandler = useCallback((index: number, openedState: boolean) => {
    if (openedState) {
      setOpened(-1);
    } else {
      setOpened(index);
    }
  }, []);
  const onApply = useCallback(() => {
    const appliedTree = onApplyTreeState();
    if (onTreeUpdate) {
      onTreeUpdate(appliedTree);
    }
  }, [onApplyTreeState, onTreeUpdate]);

  const onSingleItemSelect = useCallback(
    (checked: boolean, path: string) => {
      const appliedTree = onSelectNode(checked, path);
      if (onTreeUpdate) {
        onTreeUpdate(appliedTree);
      }
    },
    [onSelectNode, onTreeUpdate]
  );

  return (
    <div className="tw-w-full tw-flex tw-justify-between">
      <MuiBox gap={1} className="tw-flex tw-flex-wrap">
        {treeState &&
          treeState.children?.map((data, index) => (
            <ChipDropdown
              open={opened === index}
              toggleHandler={toggleHandler}
              treeState={data}
              key={data.uid}
              value={index}
              hideIfSingleChild
              onChange={onTreeChange}
              onApply={onApply}
              onReset={onTreeReset}
              multiSelect={multiSelect}
              onSingleItemSelect={onSingleItemSelect}
              selectAllLabel={selectAllLabel}
              placeholder={placeholder}
              buttonLabelResolver={buttonLabelResolver}
              defaultButton={defaultButton}
            />
          ))}
      </MuiBox>
      <If condition={showSelectAllAtParentOption}>
        <div className="tw-flex tw-gap-2">
          <MuiButton
            fxvariant="outlined"
            className="tw-h-8 !tw-bg-transparent"
            onClick={() => onTreeChange(false, true, "root", true)}
          >
            Unselect All
          </MuiButton>
          <MuiButton
            fxvariant="white"
            className="tw-h-8"
            onClick={() => onTreeChange(true, true, "root", true)}
          >
            Select All
          </MuiButton>
        </div>
      </If>
    </div>
  );
};
