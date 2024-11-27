import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import { LicenseManager } from "ag-grid-enterprise";
import App from "./App";
// import reportWebVitals from "./reportWebVitals";
import MuiAppThemeProvider from "./common/components/themeProvider/MuiAppThemeProvider";

LicenseManager.setLicenseKey(
  "Using_this_AG_Grid_Enterprise_key_( AG-046577 )_in_excess_of_the_licence_granted_is_not_permitted___Please_report_misuse_to_( legal@ag-grid.com )___For_help_with_changing_this_key_please_contact_( info@ag-grid.com )___( WARP DRIVE INC )_is_granted_a_( Single Application )_Developer_License_for_the_application_( FalconX 360 )_only_for_( 5 )_Front-End_JavaScript_developers___All_Front-End_JavaScript_developers_working_on_( FalconX 360 )_need_to_be_licensed___( FalconX 360 )_has_been_granted_a_Deployment_License_Add-on_for_( 1 )_Production_Environment___This_key_works_with_AG_Grid_Enterprise_versions_released_before_( 14 September 2024 )____[v2]_MTcyNjI2ODQwMDAwMA==b51d29ca5675d0f4edf8ba0d3bc08fc8"
);

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

const baseName = process.env.PUBLIC_URL;
root.render(
  <React.StrictMode>
    <MuiAppThemeProvider>
      <BrowserRouter basename={baseName}>
        <App />
      </BrowserRouter>
    </MuiAppThemeProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals();
