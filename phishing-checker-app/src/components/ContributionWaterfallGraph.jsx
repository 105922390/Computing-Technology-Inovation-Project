import { BarChart } from '@mui/x-charts/BarChart';

export default function ContributionWaterfallGraph(data) {
  return (
    <BarChart
      xAxis={[{ 
      colorMap: {
                  type: 'piecewise',
                  thresholds: [0, 3],
                  colors: ['#1976d2', '#d32f2f'],
                },
      }]}
      yAxis = {[{
        data: ['A', 'B', 'C'] 
      }]}
      series={[{ data: [-4, 3, 10] }]}
      height={300}
      layout = 'horizontal'
    />
  );
}