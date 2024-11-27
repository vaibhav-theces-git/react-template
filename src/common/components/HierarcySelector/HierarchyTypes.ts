export interface HierarchyConfig {
  childKey: string;
  label: string;
  id: string;
  isObject: boolean;
}

export interface TreeState {
  id: string;
  label: string;
  selected: true | false | "indeterminate";
  children?: TreeState[] | null;
  originalData?: unknown;
}
export interface InternalTreeState extends TreeState {
  uid: string;
  children?: InternalTreeState[] | null;
}
export type CheckboxValue = true | false | "indeterminate";
export type LabelResolver = (item: TreeState) => string;
