/* eslint-disable react/jsx-props-no-spreading */
import React from "react";
import { TabsProps, Tabs, Tab, TabProps } from "@mui/material";
import { TabPanel, TabPanelProps, TabContext, TabContextProps } from "@mui/lab";
import { styled } from "@mui/material/styles";

type MuiTabsProps = TabsProps;

export const MuiTabs: React.FC<MuiTabsProps> = ({ ...props }) => (
  <Tabs {...props} />
);

export const MuiTab: React.FC<TabProps> = ({ ...props }) => <Tab {...props} />;

export const MuiTabPanel: React.FC<TabPanelProps> = ({ ...props }) => (
  <TabPanel {...props} />
);

export const MuiTabContext: React.FC<TabContextProps> = ({ ...props }) => (
  <TabContext {...props} />
);

// TODO: How do we not hardcode tailwind styles
export const HighlightMuiTabs = styled(MuiTabs)`
  min-height: initial;
  font-family: inherit;

  .MuiTabs-indicator {
    display: none;
  }
  .Mui-selected {
    background-color: #111827;
  }
`;

export const UnderlinedMuiTabs = styled(MuiTabs)`
  min-height: initial;
  font-family: inherit;

  .MuiTabs-indicator {
    display: none;
  }
  .Mui-selected {
    border-bottom: solid 2px white;
    font-weight: bold;
  }
`;

export const VerticalMuiTabs = styled(MuiTabs)`
  min-height: initial;
  font-family: inherit;

  .MuiTabs-indicator {
    display: none;
  }
  .Mui-selected {
    border-left: solid 2px white;
    font-weight: bold;
    background: #3c4257;
  }
`;

export const UnderlinedMuiTab = styled(MuiTab)`
  min-width: initial;
  font-family: Fraktion Sans, Helvetica Neue, Helvetica, sans-serif;
`;
export const BlueUnderlinedMuiTabs = styled(MuiTabs)`
  min-height: initial;
  font-family: inherit;

  .MuiTabs-indicator {
    display: none;
  }
  .MuiTab-root.Mui-selected {
    color: #178fe6;
  }

  .Mui-selected {
    border-bottom: solid 2px #178fe6;
  }
`;

export const RoundedMuiTabs = styled(MuiTabs)`
  min-height: initial;
  font-family: inherit;
  .MuiTabs-flexContainer {
    gap: 12px;
  }
  .MuiTabs-indicator {
    display: none;
  }
  .MuiTab-root {
    border-radius: 32px;
    font-size: 14px;
    line-height: 14px;

    background: #3c4257;
    color: #a3acb9;
  }
  .MuiTab-root.Mui-selected {
    background: #178fe6;
    color: #ffffff;
    box-shadow: inset 0px 0px 4px #ffffff;
  }
  .MuiButtonBase-root {
    text-transform: none;
    min-height: 32px;
    height: 32px;
  }
`;
