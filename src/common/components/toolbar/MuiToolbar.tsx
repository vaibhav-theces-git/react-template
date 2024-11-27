import React from "react";
import { Toolbar, ToolbarProps } from "@mui/material";

// export interface MuiToolbarProps extends ToolbarProps {}

const MuiToolbar: React.FC<ToolbarProps> = (props: ToolbarProps) => (
  <Toolbar {...props} />
);

export default MuiToolbar;
