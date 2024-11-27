import * as React from "react";
import { styled } from "@mui/material/styles";
import MuiAppBar, { AppBarProps as MuiAppBarProps } from "@mui/material/AppBar";
import { MuiBox } from "src/common/components/box/MuiBox";
import { MuiTypography } from "src/common/components/typography/MuiTypography/MuiTypography";
import MuiDrawer from "src/common/components/drawer/MuiDrawer";
import {
  MuiList,
  MuiListItem,
  MuiListItemIcon,
  MuiListItemText,
  MuiListItemButton,
} from "src/common/components/list/MuiList";
import { MuiIconButton } from "src/common/components/button/MuiButtons/MuiIconButton";
import MenuIcon from "@mui/icons-material/Menu";
import HomeIcon from "@mui/icons-material/Home";
import AssessmentIcon from "@mui/icons-material/Assessment";
import AnalyticsIcon from "@mui/icons-material/Analytics";
import AccountCircle from "@mui/icons-material/AccountCircle";
import SettingsIcon from "@mui/icons-material/Settings";
import RepeatIcon from "@mui/icons-material/Repeat";
import QueryStatsIcon from "@mui/icons-material/QueryStats";
import StackedLineChartIcon from "@mui/icons-material/StackedLineChart";
import MuiToolbar from "src/common/components/toolbar/MuiToolbar";
import MuiStyled from "src/common/components/styled/MuiStyled";
import { Link, Route, Routes, useLocation } from "react-router-dom";
import FalconX_Logo from "src/assets/images/FalconX_Logo.png";
import Dashboard from "../dashboard/Dashboard";
import BatchConfig from "../batchConfig/BatchConfig";
import Settings from "../settings/Settings";
import VarBackTesting from "../varBacktesting/VarBackTesting";
import Notification from "../dashboard/notifications/Notification";
import SpotVolAnalysis from "../spotvolanalysis/SpotVolAnalysis";
import MarketData from "../marketData/MarketData";
import SyntheticPortfolio from "../syntheticPortfolio/SyntheticPortfolio";

const drawerWidth = 240;

const Main = MuiStyled("main", {
  shouldForwardProp: (prop) => prop !== "open",
})<{
  open?: boolean;
}>(({ theme, open }) => ({
  flexGrow: 1,
  padding: theme.spacing(3),
  transition: theme.transitions.create("margin", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  marginLeft: `-${drawerWidth}px`,
  ...(open && {
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginLeft: 1,
  }),
}));

interface AppBarProps extends MuiAppBarProps {
  open?: boolean;
}

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})<AppBarProps>(({ theme, open }) => ({
  transition: theme.transitions.create(["margin", "width"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(["margin", "width"], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const SideNavMenu = () => {
  const [open, setOpen] = React.useState(false);

  const handleDrawerOpen = () => {
    setOpen((o) => !o);
    window.dispatchEvent(new Event("resize"));
  };

  const menuItems = [
    {
      text: "Dashboard",
      icon: <HomeIcon />,
      path: "/",
      component: Dashboard,
    },
    {
      text: "Batch Configuration",
      icon: <AnalyticsIcon />,
      path: "/batchconfig",
      component: BatchConfig,
    },
    {
      text: "VaR Back Testing",
      icon: <RepeatIcon />,
      path: "/varBacktesting",
      component: VarBackTesting,
    },
    {
      text: "Spot-Vol Analysis",
      icon: <QueryStatsIcon />,
      path: "/spotvolanalysis",
      component: SpotVolAnalysis,
    },
    {
      text: "Market Data",
      icon: <StackedLineChartIcon />,
      path: "/marketdata",
      component: MarketData,
    },
    {
      text: "Synthetic Portfolio",
      icon: <AssessmentIcon />,
      path: "/syntheticportfolio",
      component: SyntheticPortfolio,
    },
    {
      text: "Settings",
      icon: <SettingsIcon />,
      path: "/settings",
      component: Settings,
    },
  ];
  const location = useLocation();
  return (
    <MuiBox sx={{ display: "flex", minHeight: "100vh" }}>
      <AppBar position="fixed" open={open}>
        <MuiToolbar
          variant="dense"
          className="tw-bg-slate-800"
          style={{ padding: 8 }}
        >
          <MuiIconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            sx={{ ml: 0.2 }}
          >
            <MenuIcon />
          </MuiIconButton>
          <MuiTypography variant="h6" style={{ flexGrow: 1 }}>
            <img
              src={FalconX_Logo}
              alt="Logo"
              style={{ height: "12px", marginRight: "8px" }}
            />
          </MuiTypography>
          <MuiBox sx={{ display: "flex" }}>
            <Notification path={location.pathname} />
            <MuiIconButton disabled>
              <AccountCircle />
            </MuiIconButton>
          </MuiBox>
        </MuiToolbar>
      </AppBar>
      <MuiDrawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
            marginTop: 5.5,
            backgroundColor: "#1E293B",
          },
        }}
        variant="persistent"
        anchor="left"
        open={open}
        style={{ padding: "8px 0" }}
      >
        <MuiList>
          {menuItems.map((item) => (
            <Link
              key={item.text}
              to={`${item.path}`}
              style={{ textDecoration: "none", color: "white" }}
            >
              <MuiListItem
                key={item.text}
                sx={{
                  paddingTop: "5px",
                  paddingLeft: "0px",
                  paddingRight: "0px",
                  backgroundColor:
                    location.pathname === item.path ? "#57534E" : "transparent",
                  transition: "backgound-color 0.1s ease",
                }}
              >
                <MuiListItemButton>
                  <MuiListItemIcon sx={{ minWidth: "28p" }}>
                    {item.icon}
                  </MuiListItemIcon>
                  <MuiListItemText>{item.text}</MuiListItemText>
                </MuiListItemButton>
              </MuiListItem>
            </Link>
          ))}
        </MuiList>
      </MuiDrawer>
      <Main open={open} sx={{ marginTop: 7, px: 0, py: 0, minHeight: "100%" }}>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/batchConfig" element={<BatchConfig />} />
          <Route path="/varBacktesting" element={<VarBackTesting />} />
          <Route path="/spotvolanalysis" element={<SpotVolAnalysis />} />
          <Route path="/marketdata" element={<MarketData />} />
          <Route path="/syntheticportfolio" element={<SyntheticPortfolio />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </Main>
    </MuiBox>
  );
};

export default SideNavMenu;
