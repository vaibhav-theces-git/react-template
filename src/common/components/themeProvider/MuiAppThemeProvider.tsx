import CssBaseline from "@mui/material/CssBaseline";
import {
  ThemeProvider,
  StyledEngineProvider,
  createTheme,
} from "@mui/material/styles";
import GlobalStyles from "@mui/material/GlobalStyles";

const THEME_FONT_FAMILY = [
  "Fraktion Sans",
  "Helvetica Neue",
  "Helvetica",
  "sans-serif",
].join(", ");

const theme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#ffffff",
      light: "#0D1830",
      dark: "#000000",
    },
    secondary: {
      main: "#111827",
      light: "#222C40",
      dark: "#04070D",
    },
    text: {
      primary: "#ffffff",
      secondary: "#a3acb9",
      disabled: "#697386",
    },
    background: {
      paper: "#282a3d",
      default: "#040A17",
    },
    error: {
      main: "#F05C52",
      dark: "#CC0E00",
      light: "#FF7A70",
    },
    warning: {
      main: "#E2B93B",
      light: "#FCDA74",
      dark: "#C99F20",
    },
    info: {
      main: "#178FE6",
      light: "#99D5FF",
      dark: "#005999",
    },
    success: {
      main: "#17A35D",
      light: "#51F0A1",
      dark: "#04703A",
    },
    divider: "#3C4257",
  },
  typography: {
    fontFamily: THEME_FONT_FAMILY,
    h1: {
      fontFamily: THEME_FONT_FAMILY,
      fontSize: "1rem",
      lineHeight: 1.2,
      letterSpacing: 0,
    },
    h2: {
      fontFamily: THEME_FONT_FAMILY,
      fontSize: "1rem",
      lineHeight: 1.2,
      letterSpacing: 0,
    },
    h3: {
      fontFamily: THEME_FONT_FAMILY,
      fontSize: "1rem",
      lineHeight: 1.2,
      letterSpacing: 0,
    },
    h4: {
      fontFamily: THEME_FONT_FAMILY,
      fontSize: "1rem",
      lineHeight: 1.2,
      letterSpacing: 0,
    },
    h5: {
      fontFamily: THEME_FONT_FAMILY,
      fontSize: "1rem",
      lineHeight: 1.2,
      letterSpacing: 0,
    },
    h6: {
      fontFamily: THEME_FONT_FAMILY,
      fontSize: "1rem",
      lineHeight: 1.2,
      letterSpacing: 0,
    },
    subtitle1: {
      fontFamily: THEME_FONT_FAMILY,
    },
    subtitle2: {
      fontFamily: THEME_FONT_FAMILY,
    },
    body1: {
      fontFamily: THEME_FONT_FAMILY,
    },
    body2: {
      fontFamily: THEME_FONT_FAMILY,
    },
    button: {
      fontFamily: THEME_FONT_FAMILY,
    },
    caption: {
      fontFamily: THEME_FONT_FAMILY,
    },
    overline: {
      fontFamily: THEME_FONT_FAMILY,
    },
  },
});

const DEFAULT_HEADER_STYLES = {
  fontSize: "1rem",
  lineHeight: 1,
  letterSpacing: 0,
};
// eslint-disable-next-line
const MuiAppThemeProvider = ({ children }: { children: any }) => {
  /*
  - allows e.g. an App component to adopt FalconX-customized styles
  - enables styles to override MUI styles
  - enables dark mode customization and utilizes normalize.css to normalize style quirks across browsers
  */
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline enableColorScheme />
      <GlobalStyles
        styles={{
          // force headers to adopt same styles
          // so that visual hierarchy requires intention
          h1: DEFAULT_HEADER_STYLES,
          h2: DEFAULT_HEADER_STYLES,
          h3: DEFAULT_HEADER_STYLES,
          h4: DEFAULT_HEADER_STYLES,
          h5: DEFAULT_HEADER_STYLES,
          h6: DEFAULT_HEADER_STYLES,
          "*": {
            borderWidth: 0, // fix: not set by default (unsure why)
          },
        }}
      />
      <StyledEngineProvider injectFirst>{children}</StyledEngineProvider>
    </ThemeProvider>
  );
};

export default MuiAppThemeProvider;
