import React from "react";
import InfoIcon from "@mui/icons-material/Info";
import { MuiBox } from "../box/MuiBox";
import MuiTooltip from "../tooltip/MuiTooltip";

export const getHeaderWithTooltip = (header: string, tooltip: string) => () => {
  return (
    <MuiBox className="tw-flex">
      <span className="tw-pr-1">{header}</span>
      <MuiBox>
        <MuiTooltip title={tooltip} arrow placement="right">
          <InfoIcon fontSize="inherit" />
        </MuiTooltip>
      </MuiBox>
    </MuiBox>
  );
};
