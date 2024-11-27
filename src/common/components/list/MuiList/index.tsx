import React from "react";

import {
  List,
  ListItem,
  ListSubheader,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  ListProps,
  ListItemProps,
  ListSubheaderProps,
  ListItemButtonProps,
  ListItemIconProps,
  ListItemTextProps,
} from "@mui/material";

export const MuiList = (props: ListProps) => <List {...props} />;

export const MuiListItem = (props: ListItemProps) => <ListItem {...props} />;

export const MuiListSubheader = (props: ListSubheaderProps) => (
  <ListSubheader {...props} />
);

export const MuiListItemButton = (props: ListItemButtonProps) => (
  <ListItemButton {...props} />
);

export const MuiListItemIcon = (props: ListItemIconProps) => (
  <ListItemIcon {...props} />
);

export const MuiListItemText = (props: ListItemTextProps) => (
  <ListItemText {...props} />
);
