import { Box, Typography } from '@mui/material';
import { BarChart } from '@mui/x-charts/BarChart';

export default function ContributionWaterfallGraph({data, startProb}) {
  
  const keys = Object.keys(data)

  // Extract data into a useable dataset for chart
  // Makes multiple singe element series, so each bar colour can be controlled independently
  var displaySeries = [];
  var contrib = 0;
  var col = null;
  var currentTotal = Math.round(startProb*100)
  keys.forEach(feature => {
    contrib = Math.round(data[feature]['contribution']*100)
    if (contrib != 0){

      col = ((contrib > 0) ? '#d21919' : '#3bd219')
      // add potential clear fill bar for this feature
      displaySeries.push({
        data: [contrib > 0 ? currentTotal : (currentTotal+contrib)],
        // label: null,
        stack: feature,
        color: 'transparent',
        valueFormatter: () => null
      })
      // add bar for this feature
      displaySeries.push({
        data: [Math.abs(contrib)],
        tooltip: contrib != 0 ? feature : null,
        stack: feature,
        color: col,
        valueFormatter: (contrib) =>
          `${contrib > 0 ? "+":""}${contrib} contribution`
      })
      currentTotal += contrib
    }
  });
        
  return (
    <Box
      sx ={{
        display: 'flex',
        alignItems: 'center',
      }}
    >
      <Typography
      sx={{
          writingMode: 'vertical-rl',
          transform: 'rotate(180deg)',
          mr: 0,
        }}>
        URL Features
      </Typography>
      <BarChart
        series={displaySeries}
        height={300}
        xAxis={[{
          label: 'Probabilty URL is Malicious',
          min: 0,
          max: 100,
        }]}
        layout = 'horizontal'
        slotProps={{
          bar: {
            rx: 3,
            ry: 3,
          },
          tooltip:{
            trigger: 'item',
          },
        }}
        sx = {{
          '& .MuiChartsAxis-left': {
            display: 'none',
          }
        }}
        margin={{left:0}}
      />
    </Box>
  );
}