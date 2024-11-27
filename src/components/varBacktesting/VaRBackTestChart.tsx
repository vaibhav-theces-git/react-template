import { Fullscreen, FullscreenExit } from "@mui/icons-material";
import { ApexOptions } from "apexcharts";
import { useEffect, useState } from "react";
import ReactApexChart from "react-apexcharts";
import { MuiButtonGroup } from "src/common/components/button/MuiButtons/MuiButtonGroup";
import { MuiIconButton } from "src/common/components/button/MuiButtons/MuiIconButton";
import { noDataMessage } from "src/common/constants/testids";
import { varBackTestDataResponseType } from "src/types/varBackTestType";

export interface PnlChartProps {
  chartData: varBackTestDataResponseType[];
  togglecallback: (enableZoom: boolean) => void;
  varLevel: string;
}

const VaRBackTestChart = (pnlChartProps: PnlChartProps) => {
  const { chartData, togglecallback, varLevel } = pnlChartProps;

  const [blockZoomed, setBlockZoomed] = useState(false);

  const handleZoom = () => {
    setBlockZoomed(!blockZoomed);
  };
  useEffect(() => {
    togglecallback(blockZoomed);
  }, [blockZoomed, togglecallback]);

  const testDate = chartData?.map((d) => d.date);
  const dailyPnLData = chartData.map((d) =>
    parseFloat(d.daily_pnl?.replace(/,/g, ""))
  );
  const var95Left = chartData?.map((d) =>
    parseFloat(d.var_95_left?.replace(/,/g, ""))
  );
  const var95Right = chartData?.map((d) =>
    parseFloat(d.var_95_right?.replace(/,/g, ""))
  );
  const var99Left = chartData?.map((d) =>
    parseFloat(d.var_99_left?.replace(/,/g, ""))
  );
  const var99Right = chartData?.map((d) =>
    parseFloat(d.var_99_right?.replace(/,/g, ""))
  );
  const breach95 = chartData?.map(
    (d) => parseFloat(d.breach_95?.replace(/,/g, "")) || 0
  );
  const breach99 = chartData?.map(
    (d) => parseFloat(d.breach_99?.replace(/,/g, "")) || 0
  );
  const options = {
    chart: {
      type: "line",
      stacked: false,
      foreColor: "#ffffff",
      background: "#141A2A",
      toolbar: {
        show: true,
        export: {
          svg: {
            filename: "VarBackTestData",
          },
          png: {
            filename: "VarBackTestData",
          },
        },
      },
    },
    theme: {
      mode: "dark",
      palette: "palette3",
    },

    colors: ["#22f502", "#0307fc", "#fc7338", "#a1aeb5"],
    stroke: {
      width: 2,
      curve: "smooth",
    },
    plotOptions: {
      bar: {
        colors: {
          ranges: [
            {
              from: -10000,
              to: 10000,
            },
          ],
        },
        columnWidth: "2px",
      },
      area: {
        colors: {
          ranges: [
            {
              from: -10000,
              to: 10000,
            },
          ],
        },
      },
    },

    markers: {
      size: 0,
    },

    xaxis: {
      type: "datetime",
      categories: testDate,
      title: {
        text: "DateTime",
        style: {
          fontSize: "10px",
          fontWeight: 200,
        },
      },
      labels: {
        style: {
          fontSize: "8px",
        },
      },
    },
    yaxis: {
      title: {
        text: "Points",
        style: {
          fontSize: "10px",
          fontWeight: 200,
        },
      },
      tickAmount: 10,
      labels: {
        style: {
          fontSize: "8px",
        },
      },
    },
    dataLabels: {
      enabled: false,
      enabledOnSeries: undefined,
      style: {
        fontSize: "8px",
        fontWeight: "normal",
      },
    },
    legend: {
      position: "bottom",
      horizontalAlign: "center",
      fontSize: "8px",
      fontWeight: "normal",
    },
  } as ApexOptions;

  let seriesConfig = [];
  if (varLevel === "VAR-95") {
    seriesConfig = [
      {
        name: "Daily PnL",
        type: "column",
        data: dailyPnLData,
      },
      {
        name: "VaR 95 left",
        type: "area",
        data: var95Left,
      },
      {
        name: "VaR 95 right",
        type: "area",
        data: var95Right,
      },
      {
        name: "Breach 95",
        type: "column",
        data: breach95,
      },
    ];
  } else {
    seriesConfig = [
      {
        name: "Daily PnL",
        type: "column",
        data: dailyPnLData,
      },
      {
        name: "VaR 99 left",
        type: "area",
        data: var99Left,
      },
      {
        name: "VaR 99 right",
        type: "area",
        data: var99Right,
      },
      {
        name: "Breach 99",
        type: "bar",
        data: breach99,
      },
    ];
  }
  const series = seriesConfig;
  return (
    <div className="fx-conduit-container tw-w-full tw-h-full tw-overflow-hidden">
      <div className="fx-conduit-header tw-h-7 tw-pl-1 tw-pr-1 tw-bg-slate-500 tw-align-middle tw-justify-end tw-flex">
        <div className="fx-conduit-buttons tw-flex tw-items-center">
          <MuiButtonGroup className="tw-flex tw-items-center">
            <MuiIconButton size="small" onClick={handleZoom}>
              {blockZoomed && <FullscreenExit fontSize="small" />}
              {!blockZoomed && <Fullscreen fontSize="small" />}
            </MuiIconButton>
          </MuiButtonGroup>
        </div>
      </div>
      <div className="fx-conduit-content tw-align-middle tw-h-[calc(100%-1.75rem)] tw-w-full tw-min-w-full tw-block">
        <ReactApexChart
          options={options}
          series={series}
          type="line"
          height="100%"
          width="100%"
        />
        {!series && (
          <div className=" tw-flex tw-text-sm tw-text-center tw-items-center tw-justify-center tw-h-full tw-w-full">
            <span>{noDataMessage}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default VaRBackTestChart;
