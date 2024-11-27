type ApexNonAxisChartProps = {
  chartTitle: string;
  apexChartType: ApexNonAxisChartType;
  apexChartOptions: ApexCharts.ApexOptions;
  apexChartSeries: ApexNonAxisChartSeries;
  apexNonAxisChartExportData: any[];
  togglecallback: (val: boolean) => void;
  charttypechangecallback: (chartType: ApexNonAxisChartType) => void;
};
export default ApexNonAxisChartProps;
export type ApexNonAxisChartType = | "pie" | "donut" | "polarArea";;
