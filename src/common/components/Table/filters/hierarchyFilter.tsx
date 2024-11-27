import { FilterProps } from "react-table";
import { TreeState } from "src/common/components/HierarcySelector/HierarchyTypes";
import { HierarchySelector } from "src/common/components/HierarcySelector";

const getFilterValue = (tree: TreeState | null) => {
  const filterValue: { [key: string]: boolean | "indeterminate" } = {};
  tree?.children?.[0].children?.forEach((child: TreeState) => {
    filterValue[child.id] = child.selected;
  });
  return filterValue;
};

const getSelectedText = (tree: TreeState, defaultLabel: string) => {
  let selectedText = defaultLabel;
  let selectedCount = 0;
  tree?.children?.forEach((child: TreeState) => {
    if (child.selected) {
      selectedCount += 1;
      if (selectedCount === 1) {
        selectedText = child.label;
      } else {
        selectedText = `Multiple(${selectedCount})`;
      }
    }
  });
  return selectedText;
};

type HierarchyFilterProps<F> = {
  filterProps: F;
  defaultLabel: string;
  initialState: TreeState;
};

const HierarchyFilter = <F extends object>({
  filterProps,
  defaultLabel,
  initialState,
}: HierarchyFilterProps<FilterProps<F>>) => {
  return (
    <HierarchySelector
      placeholder=""
      multiSelect
      showSelectAllAtParentOption={false}
      initialTreeState={initialState}
      onTreeUpdate={(tree: TreeState | null) => {
        filterProps.column.setFilter(getFilterValue(tree));
      }}
      defaultButton
      keepOneSelectedAlways={false}
      buttonLabelResolver={(tree: TreeState) => {
        return getSelectedText(tree, defaultLabel);
      }}
    />
  );
};

type HierarchyWrapperProps = {
  defaultLabel: string;
  initialState: TreeState;
};

export const HierarchyFilterWrapper = (params: HierarchyWrapperProps) => {
  return <D extends object>(props: FilterProps<D>) => (
    // eslint-disable-next-line react/jsx-props-no-spreading
    <HierarchyFilter filterProps={props} {...params} />
  );
};
