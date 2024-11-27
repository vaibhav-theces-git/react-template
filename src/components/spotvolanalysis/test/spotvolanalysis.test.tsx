import { fireEvent, waitFor, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { renderWithProviders } from "src/utitlites/testUtils/testUtils";
import SpotVolAnalysis from "../SpotVolAnalysis";
import RiskHubToolbar, {
  RiskHubToolbarProps,
} from "src/common/components/toolbar/riskhub-toolbar";
import dayjs from "dayjs";
import "@testing-library/jest-dom/extend-expect";
import SpotVolAnalysisV1Grid, {
  SpotVolAnalysisV1GridProps,
} from "../SpotVolAnalysisV1Grid";
import SpotVolAnalysisV2Grid, {
  SpotVolAnalysisV2GridProps,
} from "../SpotVolAnalysisV2Grid";

describe("Spot vol Analysis", () => {
  it("Toolbar renders", async () => {
    renderWithProviders(<SpotVolAnalysis />);
    const toolbar = screen.getByTestId("spot-vol-toolbar");
    expect(toolbar).toBeInTheDocument();

    const dt = screen.getByText("Date :");
    expect(dt).toBeInTheDocument();

    const br = screen.getByText("Batch Run :");
    expect(br).toBeInTheDocument();
  });

  it("Tabs render", async () => {
    renderWithProviders(<SpotVolAnalysis />);

    const v1 = screen.getByText("View 1");
    expect(v1).toBeInTheDocument();

    const v2 = screen.getByText("View 2");
    expect(v2).toBeInTheDocument();
  });
});

describe("RiskHubToolbar Component", () => {
  let riskhubtoolbarprops: RiskHubToolbarProps;

  beforeEach(() => {
    riskhubtoolbarprops = {
      portfoliolist: [
        { runId: 1, portfolioName: "Portfolio 1" },
        { runId: 2, portfolioName: "Portfolio 2" },
      ],
      cobdate: dayjs(new Date("2024-04-05")),
      portfolio: "Portfolio 1",
      cobdatechangecallback: jest.fn(),
      portfoliochangecallback: jest.fn(),
      showApplyButton: true,
      applyClickCallback: jest.fn(),
      showRefreshButton: true,
      refreshBatchIdsCallback: jest.fn(),
    };
  });

  it("renders toolbar with default values", () => {
    renderWithProviders(<RiskHubToolbar {...riskhubtoolbarprops} />);

    expect(screen.getByText("Portfolio 1")).toBeInTheDocument();
    expect(screen.getByDisplayValue("04/05/2024")).toBeInTheDocument();
    expect(screen.getByText("Apply")).toBeInTheDocument();
    expect(
      screen.getByTestId("riskhub-toolbar-portfolio-select")
    ).toBeInTheDocument();
  });

  it("triggers cobdatechangecallback when date is changed", async () => {
    renderWithProviders(<RiskHubToolbar {...riskhubtoolbarprops} />);
    const dateBox = screen.getByDisplayValue("04/05/2024");
    fireEvent.change(dateBox, {
      target: { value: "2024-04-10" },
    });
    waitFor(() => {
      expect(riskhubtoolbarprops.cobdatechangecallback).toHaveBeenCalledWith(
        dayjs(new Date("2024-04-10")),
        null
      );
    });
  });

  it("triggers portfoliochangecallback when portfolio is changed", () => {
    renderWithProviders(<RiskHubToolbar {...riskhubtoolbarprops} />);
    const selectPortfolio = screen.getByDisplayValue(/Portfolio 1/);
    fireEvent.change(selectPortfolio, {
      target: { value: "Portfolio 2" },
    });
    expect(riskhubtoolbarprops.portfoliochangecallback).toHaveBeenCalledWith(
      "Portfolio 2"
    );
  });

  it("triggers applyclickcallback when Apply button is clicked", () => {
    renderWithProviders(<RiskHubToolbar {...riskhubtoolbarprops} />);
    fireEvent.click(screen.getByText("Apply"));
    expect(riskhubtoolbarprops.applyClickCallback).toHaveBeenCalled();
  });
});

describe("SpotVolAnalysisV1Grid", () => {
  let spotvolProps: SpotVolAnalysisV1GridProps;
  beforeEach(() => {
    spotvolProps = {
      spotvolGridColumns: [
        {
          cellClass: "tw-text-center",
          cellStyle: { background: "#202739" },
          field: "firstColumn",
          flex: 1,
          headerClass: "tw-text-center",
          headerName: "",
          maxWidth: 150,
          minWidth: 50,
        },
        {
          cellClass: "tw-text-center",
          field: "-25",
          flex: 1,
          headerClass: "text-center",
          headerName: "-25",
          type: "numericColumn",
        },
        {
          cellClass: "tw-text-center",
          field: "-20",
          flex: 1,
          headerClass: "text-center",
          headerName: "-20",
          type: "numericColumn",
        },
        {
          cellClass: "tw-text-center",
          field: "-15",
          flex: 1,
          headerClass: "text-center",
          headerName: "-15",
          type: "numericColumn",
        },
        {
          cellClass: "tw-text-center",
          field: "-10",
          flex: 1,
          headerClass: "text-center",
          headerName: "-10",
          type: "numericColumn",
        },
        {
          cellClass: "tw-text-center",
          field: "-5",
          flex: 1,
          headerClass: "text-center",
          headerName: "-5",
          type: "numericColumn",
        },
        {
          cellClass: "tw-text-center",
          field: "0",
          flex: 1,
          headerClass: "text-center",
          headerName: "0",
          type: "numericColumn",
        },
        {
          cellClass: "tw-text-center",
          field: "25",
          flex: 1,
          headerClass: "text-center",
          headerName: "25",
          type: "numericColumn",
        },
        {
          cellClass: "tw-text-center",
          field: "20",
          flex: 1,
          headerClass: "text-center",
          headerName: "20",
          type: "numericColumn",
        },
        {
          cellClass: "tw-text-center",
          field: "15",
          flex: 1,
          headerClass: "text-center",
          headerName: "15",
          type: "numericColumn",
        },
        {
          cellClass: "tw-text-center",
          field: "10",
          flex: 1,
          headerClass: "text-center",
          headerName: "10",
          type: "numericColumn",
        },
        {
          cellClass: "tw-text-center",
          field: "5",
          flex: 1,
          headerClass: "text-center",
          headerName: "5",
          type: "numericColumn",
        },
      ],
      spotvolGridData: [
        {
          "0": 414549193.2,
          "5": 412844815.61,
          "10": 410965746.65,
          "15": 408914893.17,
          "20": 406695589.15,
          "25": 0,
          "-5": 416076116.81,
          "-10": 417422704.64,
          "-15": 418585872.55,
          "-20": 419562688.55,
          "-25": 0,
          firstColumn: "-20",
        },
        {
          "0": 433043819.17,
          "5": 431421622.31,
          "10": 429604362.08,
          "15": 427594179.94,
          "20": 425394407.12,
          "25": 0,
          "-5": 434469922.97,
          "-10": 435699953.7,
          "-15": 436735065.07,
          "-20": 437577987.37,
          "-25": 0,
          firstColumn: "-15",
        },
      ],
      spotVolMetric: "Market Value",
      spotVolDisplayType: "Actual",
      handleSpotVolMetricChange: jest.fn(),
      handleSpotVolDisplayChange: jest.fn(),
    };
  });

  it("SpotVolAnalysisV1Grid renders without crashing", () => {
    renderWithProviders(<SpotVolAnalysisV1Grid {...spotvolProps} />);
  });

  it("renders two Select components for metric and display type in SpotVolAnalysisV1Grid", () => {
    renderWithProviders(<SpotVolAnalysisV1Grid {...spotvolProps} />);
    const selectElements = screen.getAllByRole("combobox");
    expect(selectElements).toHaveLength(2);
  });

  it("renders AgGridReact component with correct props SpotVolAnalysisV1Grid", () => {
    renderWithProviders(<SpotVolAnalysisV1Grid {...spotvolProps} />);
    const agGrid = screen.getByText("414549193.2");
    expect(agGrid).toBeInTheDocument();
  });

  it("calls handleSpotVolMetricChange when metric is changed SpotVolAnalysisV1Grid", () => {
    renderWithProviders(<SpotVolAnalysisV1Grid {...spotvolProps} />);
    const selectMetric = screen.getByDisplayValue(/Market Value/);
    fireEvent.change(selectMetric, { target: { value: "Delta" } });
    expect(spotvolProps.handleSpotVolMetricChange).toHaveBeenCalledWith(
      "Delta"
    );
  });

  it("calls handleSpotVolDisplayChange when display type is changed SpotVolAnalysisV1Grid", () => {
    renderWithProviders(<SpotVolAnalysisV1Grid {...spotvolProps} />);
    const selectDisplay = screen.getByDisplayValue(/Actual/);
    fireEvent.change(selectDisplay, { target: { value: "Change" } });
    expect(spotvolProps.handleSpotVolDisplayChange).toHaveBeenCalledWith(
      "Change"
    );
  });
});

describe("SpotVolAnalysisV2Grid", () => {
  let spotvolProps: SpotVolAnalysisV2GridProps;

  beforeEach(() => {
    spotvolProps = {
      spotvolGridColumns: [
        {
          cellClass: "tw-text-center",
          cellStyle: { background: "#202739" },
          field: "firstColumn",
          flex: 1,
          headerClass: "tw-text-center",
          headerName: "",
          maxWidth: 150,
          minWidth: 50,
        },
        {
          cellClass: "tw-text-center",
          field: "-25",
          flex: 1,
          headerClass: "text-center",
          headerName: "-25",
          type: "numericColumn",
        },
        {
          cellClass: "tw-text-center",
          field: "-20",
          flex: 1,
          headerClass: "text-center",
          headerName: "-20",
          type: "numericColumn",
        },
        {
          cellClass: "tw-text-center",
          field: "-15",
          flex: 1,
          headerClass: "text-center",
          headerName: "-15",
          type: "numericColumn",
        },
        {
          cellClass: "tw-text-center",
          field: "-10",
          flex: 1,
          headerClass: "text-center",
          headerName: "-10",
          type: "numericColumn",
        },
        {
          cellClass: "tw-text-center",
          field: "-5",
          flex: 1,
          headerClass: "text-center",
          headerName: "-5",
          type: "numericColumn",
        },
        {
          cellClass: "tw-text-center",
          field: "0",
          flex: 1,
          headerClass: "text-center",
          headerName: "0",
          type: "numericColumn",
        },
        {
          cellClass: "tw-text-center",
          field: "25",
          flex: 1,
          headerClass: "text-center",
          headerName: "25",
          type: "numericColumn",
        },
        {
          cellClass: "tw-text-center",
          field: "20",
          flex: 1,
          headerClass: "text-center",
          headerName: "20",
          type: "numericColumn",
        },
        {
          cellClass: "tw-text-center",
          field: "15",
          flex: 1,
          headerClass: "text-center",
          headerName: "15",
          type: "numericColumn",
        },
        {
          cellClass: "tw-text-center",
          field: "10",
          flex: 1,
          headerClass: "text-center",
          headerName: "10",
          type: "numericColumn",
        },
        {
          cellClass: "tw-text-center",
          field: "5",
          flex: 1,
          headerClass: "text-center",
          headerName: "5",
          type: "numericColumn",
        },
      ],
      spotvolGridData: [
        {
          "0": 454545454.5,
          "5": 412844815.61,
          "10": 410965746.65,
          "15": 408914893.17,
          "20": 406695589.15,
          "25": 0,
          "-5": 416076116.81,
          "-10": 417422704.64,
          "-15": 418585872.55,
          "-20": 419562688.55,
          "-25": 0,
          firstColumn: "-20",
        },
        {
          "0": 433043819.17,
          "5": 431421622.31,
          "10": 429604362.08,
          "15": 427594179.94,
          "20": 425394407.12,
          "25": 0,
          "-5": 434469922.97,
          "-10": 435699953.7,
          "-15": 436735065.07,
          "-20": 437577987.37,
          "-25": 0,
          firstColumn: "-15",
        },
      ],
      spotVolShiftTypes: [
        "0",
        "5",
        "10",
        "15",
        "20",
        "25",
        "-5",
        "-10",
        "-15",
        "-20",
        "-25",
      ],
      spotorvol: "Spot",
      spotvolShiftValue: "15",
      spotvolDisplayType: "Actual",
      handleSpotVolChange: jest.fn(),
      handleSpotVolDisplayChange: jest.fn(),
    };
  });

  it("SpotVolAnalysisV2Grid renders without crashing", () => {
    renderWithProviders(<SpotVolAnalysisV2Grid {...spotvolProps} />);
  });

  it("renders two Select components for metric and display type in SpotVolAnalysisV2Grid", () => {
    renderWithProviders(<SpotVolAnalysisV2Grid {...spotvolProps} />);
    const selectElements = screen.getAllByRole("combobox");
    expect(selectElements).toHaveLength(2);
  });

  it("renders AgGridReact component with correct props SpotVolAnalysisV2Grid", () => {
    renderWithProviders(<SpotVolAnalysisV2Grid {...spotvolProps} />);
    const agGrid = screen.getByText("454545454.5");
    expect(agGrid).toBeInTheDocument();
  });

  it("calls handleSpotVolMetricChange when metric is changed SpotVolAnalysisV2Grid", () => {
    renderWithProviders(<SpotVolAnalysisV2Grid {...spotvolProps} />);
    const selectMetric = screen.getByDisplayValue(/15/);
    fireEvent.change(selectMetric, { target: { value: "25" } });
    expect(spotvolProps.handleSpotVolChange).toHaveBeenCalledWith("25");
  });

  it("calls handleSpotVolDisplayChange when display type is changed SpotVolAnalysisV2Grid", () => {
    renderWithProviders(<SpotVolAnalysisV2Grid {...spotvolProps} />);
    const selectDisplay = screen.getByDisplayValue(/Actual/);
    fireEvent.change(selectDisplay, { target: { value: "Change" } });
    expect(spotvolProps.handleSpotVolDisplayChange).toHaveBeenCalledWith(
      "Change"
    );
  });
});
