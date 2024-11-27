import { set, get, filter, cloneDeep } from "lodash";
import { CheckboxValue, InternalTreeState, TreeState } from "./HierarchyTypes";
/**
 * Flatten hierarchy
 * @param items
 * @returns array of nested children
 */
const flattenTreeItems = (items: InternalTreeState[]): InternalTreeState[] => {
  return items
    ? items.reduce(
        (flattenedItems: InternalTreeState[], item: InternalTreeState) => {
          flattenedItems.push(item);
          if (Array.isArray(item.children)) {
            // intentional hierarchy array update
            // eslint-disable-next-line no-param-reassign
            flattenedItems = flattenedItems.concat(
              flattenTreeItems(item.children)
            );
          }
          return flattenedItems;
        },
        []
      )
    : [];
};

/**
 * Find if any child in subsequent tree is selected in the hierarchy
 * @param data
 * @param value
 * @returns CheckboxValue
 */
const hasChildSelected = (
  data: InternalTreeState[],
  value: boolean | CheckboxValue
): CheckboxValue => {
  if (data) {
    const flattened = flattenTreeItems(data);
    const count = filter(
      flattened,
      (child) => child.selected === true || child.selected === "indeterminate"
    ).length;

    if (count === 0) {
      return false;
    }
    if (count === flattened.length) {
      return true;
    }
    return "indeterminate";
  }
  return value;
};
/**
 * Recursive function to update subsiquent children in the tree
 * @param data
 * @param selected
 * @returns children after updating all subsequent children selection recursively
 */
const updateChildren = (
  data: InternalTreeState[] | null | undefined,
  selected: boolean
): InternalTreeState[] | null => {
  if (data) {
    return data.map((child) => ({
      ...child,
      selected,
      children: updateChildren(child.children, selected),
    }));
  }
  return null;
};
/**
 *
 * @param path
 * @param treeState
 * @param selection
 * @param rootId
 * @returns updated parent tree based on child selection
 */
const updateParent = (
  path: string,
  treeState: InternalTreeState | TreeState | null,
  selection: boolean | CheckboxValue,
  rootId = "root"
) => {
  const currentTreeState = treeState;
  if (path !== rootId) {
    let currentSelection = selection;
    let currentPath = path;
    while (currentPath) {
      const prevData = get(currentTreeState, currentPath) as InternalTreeState;
      if (prevData.children) {
        currentSelection = hasChildSelected(
          prevData.children,
          currentSelection
        );
      }
      set(currentTreeState as object, currentPath, {
        ...prevData,
        selected: currentSelection,
      });
      if (currentPath.includes(".")) {
        currentPath = currentPath.substring(0, currentPath.lastIndexOf("."));
      } else {
        currentPath = "";
      }
    }
  }
  return currentTreeState as InternalTreeState;
};
/**
 *
 * @param treeState
 * @param path
 * @param selected
 * @param rootId
 * @param hasChild
 * @returns new TreeState after updating all children and parent of the selected node
 */
export const updateTree = (
  treeState: InternalTreeState | TreeState | null,
  path: string,
  selected: boolean | CheckboxValue,
  rootId = "root",
  hasChild?: boolean
): InternalTreeState | null => {
  if (treeState) {
    const currentPath = path.replace(`${rootId}.`, "");
    let currentTreeState = cloneDeep(treeState);
    const currentSelection = selected;
    // Look down
    if (hasChild) {
      // if root selection, update entire tree
      const prevData =
        currentPath === rootId
          ? (currentTreeState as InternalTreeState)
          : (get(currentTreeState, currentPath) as InternalTreeState);
      const newData = {
        ...prevData,
        selected: currentSelection,
        children: updateChildren(
          prevData.children,
          currentSelection as boolean
        ),
      };
      if (currentPath === rootId) {
        currentTreeState = newData;
      } else {
        set(currentTreeState, currentPath, newData);
      }
    }
    // Look up
    currentTreeState = updateParent(
      currentPath,
      currentTreeState,
      currentSelection
    );
    return currentTreeState as InternalTreeState;
  }
  return null;
};
/**
 *
 * @param treeState
 * @param path
 * @param selected
 * @returns TreeState after updating a single node
 */
export const updateSingleNode = (
  treeState: InternalTreeState | TreeState | null,
  path: string,
  selected: boolean,
  rootId = "root"
): InternalTreeState | null => {
  if (treeState) {
    const currentPath = path.replace(`${rootId}.`, "");

    let currentTreeState = { ...treeState };
    const currentSelection: boolean | CheckboxValue = selected;
    currentTreeState = updateParent(
      currentPath,
      currentTreeState,
      currentSelection
    );
    return currentTreeState as InternalTreeState;
  }
  return null;
};

/**
 *
 * @param treeState
 * @returns first found selected node
 */
export const findSelectedNode = (
  node: InternalTreeState
): InternalTreeState | null => {
  if (!node) {
    return null;
  }
  if (node.selected === true) {
    return node;
  }
  if (!node.children) {
    return null;
  }
  // eslint-disable-next-line no-plusplus
  for (let i = 0; i < node.children.length; i++) {
    const selectedNode = findSelectedNode(node.children[i]);
    if (selectedNode) {
      return selectedNode;
    }
  }
  return null;
};

export const countOfTopLevelSelectedChildren = (
  treeState: InternalTreeState | null
) => {
  return (filter(treeState?.children, (ts) => ts?.selected !== false) || [])
    .length;
};

export const findAllSelectedNodes = (
  node: TreeState | null,
  selected: TreeState[] = []
): TreeState[] => {
  if (!node) {
    return selected;
  }
  if (node.selected === true) {
    selected.push(node);
  }
  if (!node.children) {
    return selected;
  }
  // eslint-disable-next-line no-plusplus
  for (let i = 0; i < node.children.length; i++) {
    findAllSelectedNodes(node.children[i], selected);
  }
  return selected;
};
