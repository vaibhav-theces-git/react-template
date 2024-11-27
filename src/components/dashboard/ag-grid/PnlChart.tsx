import { ApexOptions } from "apexcharts";
import { useEffect, useMemo, useState } from "react";
import ReactApexChart from "react-apexcharts";
import { HistogramResponseType } from "src/types/pnlTypes";

export interface PnlChartProps {
  chartData: HistogramResponseType[];
}

const PnlChart = (pnlChartProps: PnlChartProps) => {
  const { chartData } = pnlChartProps;
  const [frequencyData, setFrequencyData] = useState<number[]>([]);
  const [seriesData, setSeriesData] = useState<number[]>([]);
  const options = useMemo(() => {
    return {
      chart: {
        type: "bar",
        foreColor: "#ffffff",
        background: "#141A2A",
      },
      theme: {
        mode: "dark",
        palette: "palette3",
      },
      dataLabels: {
        enabled: false,
        style: {
          fontSize: "13px",
          fontWeight: "normal",
        },
      },

      xaxis: {
        categories: seriesData || [],
        title: {
          text: "Range",
          style: {
            fontSize: "14px",
            fontWeight: 200,
          },
        },
      },
      yaxis: {
        categories: frequencyData || [],
        title: {
          text: "Frequency",
          style: {
            fontSize: "12px",
            fontWeight: 200,
          },
        },
      },
    } as ApexOptions;
  }, [seriesData, frequencyData]);

  const series = [
    {
      name: "Frequency",
      data: frequencyData || [],
    },
  ];
  useEffect(() => {
    const fData = chartData?.map((data) => data.frequency);
    const sData = chartData?.map((data) => data.range);
    setFrequencyData(fData);
    setSeriesData(sData);
  }, [chartData]);

  return (
    <div>
      <ReactApexChart
        options={options}
        series={series}
        type="bar"
        height="320"
        width="600"
      />
    </div>
  );
};

export default PnlChart;
