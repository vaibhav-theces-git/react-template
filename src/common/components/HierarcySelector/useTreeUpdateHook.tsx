import { useCallback, useState, useEffect, useRef } from "react";
import cloneDeep from "lodash/cloneDeep";
import { InternalTreeState, TreeState } from "./HierarchyTypes";
import {
  updateTree,
  updateSingleNode,
  findSelectedNode,
  countOfTopLevelSelectedChildren,
} from "./TreeUtil";

const addUidToChildren = (
  data?: TreeState[] | null,
  uid = "root"
): InternalTreeState[] | null => {
  if (data) {
    return data.map((innerData: TreeState, index: number) => {
      return {
        ...innerData,
        uid: `${uid}.children[${index}]`,
        children: addUidToChildren(
          innerData.children,
          `${uid}.children[${index}]`
        ),
      };
    });
  }
  return null;
};

const addUid = (
  data?: TreeState | null,
  uid = "root"
): InternalTreeState | null => {
  if (data) {
    return { ...data, uid, children: addUidToChildren(data.children, uid) };
  }
  return null;
};

export function useTreeUpdate(
  initialTreeState: TreeState | null,
  onTreeStateInit?: (treeState: TreeState | null) => void,
  keepOneSelectedAlways = true,
  onImmediateApply?: (treeState: TreeState | null) => void,
  rootId = "root"
) {
  const [treeState, setTreeState] = useState<
    InternalTreeState | TreeState | null
  >(null);

  const [appliedTreeState, setAppliedTreeState] = useState<
    InternalTreeState | TreeState | null
  >(null);
  /**
   * keeping the previous selection state for single selection
   */
  const previousNode = useRef<string | undefined>();
  /**
   * create a UID with lodash compliant parsing and applying to initialTreeState and setting as treeState
   */
  useEffect(() => {
    const st = addUid(initialTreeState);
    setTreeState(st);
    previousNode.current = findSelectedNode(st as InternalTreeState)?.uid;
    const appliedTree = cloneDeep(st);
    setAppliedTreeState(appliedTree);
    if (onTreeStateInit) {
      onTreeStateInit(appliedTree);
    }
    // intentional - trigger only once
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /**
   * On the tree change event from checkbox this function will
   * update the treeState upwards and downwards
   */
  const onTreeChange = useCallback(
    (
      checked: boolean,
      hasChildren: boolean,
      path: string,
      immediateApply?: boolean
    ) => {
      const updatedTreeState = updateTree(
        treeState,
        path,
        checked,
        rootId,
        hasChildren
      );
      // while unchecking, this flag will make sure atleast one is selected
      const allowUpdate =
        checked !== true && keepOneSelectedAlways
          ? countOfTopLevelSelectedChildren(
              updatedTreeState as InternalTreeState
            ) > 0
          : true;
      if (allowUpdate) {
        setTreeState(updatedTreeState);
        // if apply need to be treggered immediately use immediateApply param and trigger tree update
        if (immediateApply && onImmediateApply) {
          const appliedTree = cloneDeep(updatedTreeState);
          setAppliedTreeState(appliedTree);
          onImmediateApply(appliedTree);
        }
      }
    },
    [treeState, rootId, keepOneSelectedAlways, onImmediateApply]
  );
  /**
   * On the apply event from tree selections function will
   * update the appliedTreeState from treeState Object which can be used to fetch api
   */
  const onApplyTreeState = useCallback(() => {
    const appliedTree = cloneDeep(treeState);
    setAppliedTreeState(appliedTree);
    return appliedTree;
  }, [treeState]);
  /**
   * On single selection event from radio button, this function will update TreeState  by
   * setting selected = false to previous selection and selected =true on the latest selection
   */
  const onSelectNode = useCallback(
    (checked: boolean, path: string) => {
      const updatedPreviousTreeState = previousNode.current
        ? updateSingleNode(treeState, previousNode.current, false)
        : treeState;
      const updatedTreeState = updateSingleNode(
        updatedPreviousTreeState,
        path,
        checked
      );
      previousNode.current = path;
      setTreeState(updatedTreeState);
      const appliedTree = cloneDeep(updatedTreeState);
      setAppliedTreeState(appliedTree);
      return appliedTree;
    },
    [treeState]
  );
  /**
   * treeState will be reset from appliedTreeState (to the previous user selection)
   */
  const onTreeReset = useCallback(() => {
    const st = cloneDeep(appliedTreeState);
    setTreeState(st);
  }, [appliedTreeState]);

  return {
    treeState: treeState as InternalTreeState | null,
    onTreeChange,
    onTreeReset,
    onApplyTreeState,
    appliedTreeState,
    onSelectNode,
  };
}
