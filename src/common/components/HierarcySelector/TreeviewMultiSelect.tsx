import { useState, useCallback, FC, PropsWithChildren } from "react";
import TreeView from "@mui/lab/TreeView";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { MuiOutlinedInput } from "src/common/components/input/MuiInputs";
import { InternalTreeState, TreeState } from "./HierarchyTypes";
import { TreeRenderer } from "./TreeRenderer";
/**
 * @attribute hideIfSingleChild -  if there is only a single child, shown only parent item
 */
interface TreeviewMultiSelectProps {
  hideIfSingleChild: boolean;
  multiSelect: boolean;
  treeState: TreeState;
  onChange: (
    checked: boolean,
    hasChildren: boolean,
    treeStateUid: string
  ) => void;
  onSingleItemSelect: (checked: boolean, path: string) => void;
}
/**
 * Multiselect component which can be used individually, 1st layer searchable
 *
 */
export const TreeviewMultiSelect: FC<
  PropsWithChildren<TreeviewMultiSelectProps>
> = ({
  hideIfSingleChild,
  treeState,
  onChange,
  multiSelect,
  onSingleItemSelect,
  children,
}) => {
  let hasChild = false;
  if (treeState.children) {
    hasChild = hideIfSingleChild
      ? treeState.children.length > 1
      : treeState.children.length > 0;
  }
  const [filterValue, setfilterValue] = useState("");
  const handleChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setfilterValue(event.target.value.toLowerCase());
    },
    [setfilterValue]
  );
  return hasChild ? (
    <>
      <MuiOutlinedInput
        value={filterValue}
        fullWidth
        onChange={handleChange}
        size="small"
        placeholder="Search"
        className="tw-rounded-3xl"
      />
      <TreeView
        aria-label="rich object"
        defaultCollapseIcon={<ExpandMoreIcon />}
        defaultExpanded={["root"]}
        defaultExpandIcon={<ChevronRightIcon />}
      >
        {children}
        {(treeState.children as Array<InternalTreeState>)
          ?.filter((st: InternalTreeState) =>
            st.label.toLowerCase().includes(filterValue)
          )
          ?.map((innerData: InternalTreeState) => (
            <TreeRenderer
              key={innerData.uid}
              treeState={innerData}
              onChange={onChange}
              hideIfSingleChild={hideIfSingleChild}
              multiSelect={multiSelect}
              onSingleItemSelect={onSingleItemSelect}
            />
          ))}
      </TreeView>
    </>
  ) : null;
};
