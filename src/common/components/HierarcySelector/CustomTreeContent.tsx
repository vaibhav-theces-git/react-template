import TreeItem, {
  TreeItemProps,
  useTreeItem,
  TreeItemContentProps,
} from "@mui/lab/TreeItem";
import { Typography } from "@mui/material";
import cx from "classnames";
import React from "react";
/**
 *
 * Custom renderer to avoid whole item click, click restricted to click icons
 */
const CustomContent = React.forwardRef(function CustomContent(
  props: TreeItemContentProps,
  ref
) {
  const {
    classes,
    className,
    label,
    nodeId,
    icon: iconProp,
    expansionIcon,
    displayIcon,
  } = props;

  const {
    disabled,
    expanded,
    selected,
    focused,
    handleExpansion,
    handleSelection,
  } = useTreeItem(nodeId);

  const icon = iconProp || expansionIcon || displayIcon;

  const handleExpansionClick = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    handleExpansion(event);
  };

  const handleSelectionClick = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    handleSelection(event);
  };

  return (
    // eslint-disable-next-line jsx-a11y/no-static-element-interactions
    <div
      className={cx(className, classes.root, {
        [classes.expanded]: expanded,
        [classes.selected]: selected,
        [classes.focused]: focused,
        [classes.disabled]: disabled,
        "tw-block !tw-pr-0": !icon,
      })}
      onMouseDown={handleSelectionClick}
      ref={ref as React.Ref<HTMLDivElement>}
    >
      <Typography
        onClick={handleSelectionClick}
        component="div"
        className={classes.label}
      >
        {label}
      </Typography>
      {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events,jsx-a11y/no-static-element-interactions */}
      <div onClick={handleExpansionClick} className={classes.iconContainer}>
        {icon}
      </div>
    </div>
  );
});
/**
 *
 * Custom renderer to avoid whole item click, click restricted to click icons
 */
export const CustomTreeItem = (props: TreeItemProps) => (
  // eslint-disable-next-line react/jsx-props-no-spreading
  <TreeItem ContentComponent={CustomContent} {...props} />
);
