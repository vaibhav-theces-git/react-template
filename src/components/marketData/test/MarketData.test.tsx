import { fireEvent, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { renderWithProviders } from "src/utitlites/testUtils/testUtils";
import MarketData from "../MarketData";
import HistoricalData, { HistoricalDataProps } from "../HistoricalData";
import dayjs from "dayjs";

describe("market data", () => {
  it("Market Data component render", async () => {
    renderWithProviders(<MarketData />);
    const comp = screen.getByTestId("marketDataTestId");
    expect(comp).toBeInTheDocument();
  });

  it("when marketData is rendered Historical Data tab is selected bydefault", () => {
    renderWithProviders(<MarketData />);
    const tab = screen.getByRole("tab", { name: "Historical Data" });
    expect(screen.getByRole("tab", { selected: true })).toHaveTextContent(
      "Historical Data"
    );
  });
});

describe("Historical Data render", () => {
  let historicalDataProps: HistoricalDataProps;
  beforeEach(() => {
    historicalDataProps = {
      selectedSymbolCallback: jest.fn(),
      symbolPairsData: ["1000BONK-USDT", "BTC-USD", "BTC-USDC"],
      selectedSymbol: "1000BONK-USDT",
      selectedSeriesCallback: jest.fn(),
      selectedSeriesValue: "PERPETUAL",
      selectedSeries: ["PERPETUAL", "FUTURE"],
      startDate: dayjs("2023-11-22"),
      endDate: dayjs("2024-05-21"),
      startDateChangeCallback: jest.fn(),
      endDateChangeCallback: jest.fn(),
      showDataButtonCallback: jest.fn(),
      overridePriceSaveCallback: jest.fn(),
      gridMarketData: [
        {
          date: "2023-11-23",
          dimension_id: 1,
          maturity_date: "",
          override_price: 15845,
          price: 0.004531,
          risk_factor_id: 494,
          flag: "old",
        },
        {
          date: "2023-11-24",
          dimension_id: 1,
          maturity_date: "",
          override_price: 456,
          price: 0.004267,
          risk_factor_id: 494,
          flag: "old",
        },
        {
          date: "2024-01-05",
          dimension_id: 2,
          maturity_date: "2024-04-01",
          override_price: 111555,
          price: 34169.17,
          risk_factor_id: 206,
          flag: "old",
        },
        {
          date: "2023-11-25",
          dimension_id: 1,
          maturity_date: "",
          override_price: 5583,
          price: 0.00414,
          risk_factor_id: 494,
          flag: "old",
        },
      ],
      isDateValid: true,
    };
  });

  it("check for HistoricalData component render", () => {
    renderWithProviders(<HistoricalData {...historicalDataProps} />);
  });
  it("When historicalData component render, the first value from the api response is automatically set in the symbol select", () => {
    renderWithProviders(<HistoricalData {...historicalDataProps} />);
    const selectedSymbol = screen.getByDisplayValue("1000BONK-USDT");
    expect(selectedSymbol).toBeInTheDocument();
  });
  it("When historicalData component render, the first value from the api response is automatically set in the series select", () => {
    renderWithProviders(<HistoricalData {...historicalDataProps} />);
    const selectedSymbol = screen.getByDisplayValue("PERPETUAL");
    expect(selectedSymbol).toBeInTheDocument();
  });
  it("checks value changes when user chooses a new symbol", async () => {
    renderWithProviders(<HistoricalData {...historicalDataProps} />);
    const select = screen.getByTestId("marketDataSymbolSelect");
    fireEvent.click(select);
    const option = screen.getByTestId("marketDataSymbolSelect");
    fireEvent.click(option);
    expect(option).toBeInTheDocument();
  });
  it("checks value changes when user chooses a new series", async () => {
    renderWithProviders(<HistoricalData {...historicalDataProps} />);
    const select = screen.getByTestId("marketDataSeriesSelect");
    fireEvent.click(select);
    const option = screen.getByTestId("marketDataSeriesSelect");
    fireEvent.click(option);
    expect(option).toBeInTheDocument();
  });

  it("checks show data button is enabled when there is data in all of the dropdowns", () => {
    renderWithProviders(<HistoricalData {...historicalDataProps} />);
    screen.getByDisplayValue("1000BONK-USDT");
    screen.getByDisplayValue("PERPETUAL");
    const btn = screen.getByText("Show Data");
    expect(btn).toBeEnabled();
  });
  it("checks cancel button is disabled when there is no data", () => {
    renderWithProviders(<HistoricalData {...historicalDataProps} />);
    const btn = screen.getByText("Cancel");
    expect(btn).toBeDisabled();
  });
  it("checks save button is disabled when there is no data", () => {
    renderWithProviders(<HistoricalData {...historicalDataProps} />);
    const btn = screen.getByText("Save");
    expect(btn).toBeDisabled();
  });
  it("checks grid data is rendered properly when symbol is 1000BONK-USDT and series is PERPETUAL", () => {
    renderWithProviders(<HistoricalData {...historicalDataProps} />);
    screen.getByDisplayValue("1000BONK-USDT");
    screen.getByDisplayValue("PERPETUAL");
    const agGridC1 = screen.getByText(/2023-11-23/);
    const agGridC2 = screen.getByText(/0.004531/);
    const agGridC3 = screen.getByText(/15845/);

    expect(agGridC1).toBeInTheDocument();
    expect(agGridC2).toBeInTheDocument();
    expect(agGridC3).toBeInTheDocument();
  });
  it("checks grid data is rendered properly when symbol is BTC-USD and series is FUTURE", () => {
    const historicalDataProps1 = {
      selectedSymbolCallback: jest.fn(),
      symbolPairsData: ["1000BONK-USDT", "BTC-USD", "BTC-USDC"],
      selectedSymbol: "BTC-USD",
      selectedSeriesCallback: jest.fn(),
      selectedSeriesValue: "FUTURE",
      selectedSeries: ["PERPETUAL", "FUTURE"],
      startDate: dayjs("2023-11-22"),
      endDate: dayjs("2024-05-21"),
      startDateChangeCallback: jest.fn(),
      endDateChangeCallback: jest.fn(),
      showDataButtonCallback: jest.fn(),
      overridePriceSaveCallback: jest.fn(),
      gridMarketData: [
        {
          date: "2024-01-05",
          dimension_id: 2,
          maturity_date: "2024-04-01",
          override_price: 111555,
          price: 34169.17,
          risk_factor_id: 206,
          flag: "old",
        },
      ],
      isDateValid: true,
    };

    renderWithProviders(<HistoricalData {...historicalDataProps1} />);
    screen.getByDisplayValue("BTC-USD");
    screen.getByDisplayValue("FUTURE");
    const btn = screen.getByText("Show Data");
    fireEvent.click(btn);
    const agGridC1 = screen.getByText(/2024-01-05/);
    const agGridC2 = screen.getByText(/34169.17/);
    const agGridC4 = screen.getByText(/111555/);
    const agGridC3 = screen.getByText(/2024-04-01/);

    expect(agGridC1).toBeInTheDocument();
    expect(agGridC2).toBeInTheDocument();
    expect(agGridC3).toBeInTheDocument();
    expect(agGridC4).toBeInTheDocument();
  });
});
