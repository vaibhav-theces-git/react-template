type ApexAxisChartProps = {
  chartTitle: string;
  apexChartType: ApexAxisChartType;
  apexChartOptions: ApexCharts.ApexOptions;
  apexChartSeries: ApexAxisChartSeries;
  apexAxisChartExportData: any[];
  togglecallback: (val: boolean) => void;
  charttypechangecallback: (chartType: ApexAxisChartType) => void;
};
export default ApexAxisChartProps;
export type ApexAxisChartType = | "line" | "area" | "scatter" | "bar" | "heatmap";
