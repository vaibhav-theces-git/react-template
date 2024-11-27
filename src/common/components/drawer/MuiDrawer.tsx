import React from "react";
import Drawer, { DrawerProps } from "@mui/material/Drawer";

export const MuiDrawer: React.FC<DrawerProps> = (props: DrawerProps) => (
  <Drawer {...props} />
);

export default MuiDrawer;
