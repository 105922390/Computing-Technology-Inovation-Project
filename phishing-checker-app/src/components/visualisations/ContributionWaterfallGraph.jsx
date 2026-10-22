import { Box, Typography } from '@mui/material';
import { useDrawingArea } from '@mui/x-charts';
import { BarChart, BarLabel } from '@mui/x-charts/BarChart';

function FormatWaterfallData(data, startProb){
  const keys = Object.keys(data)

  // Extract data into a useable dataset for chart
  // Makes multiple singe element series, so each bar colour can be controlled independently
  var displaySeries = [];
  var currentTotal = Math.round(startProb*10000)/100
  var othersTotal = 0
  keys.forEach(feature => {
    const contrib = Math.round(data[feature]['contribution']*10000)/100
    const posSign = contrib >= 0 ? true : false
    if (Math.abs(contrib) >= 2){

      const col = (posSign ? '#d21919' : '#3bd219')
      // add potential clear fill bar for this feature
      displaySeries.push({
        data: [posSign ? currentTotal : (currentTotal+contrib)],
        // label: null,
        stack: feature,
        color: 'transparent',
        valueFormatter: () => null
      })
      // add bar for this feature

      displaySeries.push({
        data: [Math.abs(contrib)],
        label: contrib != 0 ? feature : null,
        barLabelPlacement: 'outside',
        stack: feature,
        color: col,
        valueFormatter: () => {
          return `${posSign ? "+" : ""}${contrib}%`
        },
        barLabel: (item) => {
        return `${posSign ? "+" : "-"}${item.value}`},
        //alternate with feature label (disabled because too long)
        // return `${feature}: ${posSign ? "+" : "-"}${item.value}`},
      })
      currentTotal += contrib
    } else {
      othersTotal += contrib
    }
  });

  othersTotal = Math.round(othersTotal*100)/100
  var col = (othersTotal > 0 ? '#d21919' : '#3bd219')
  displaySeries.push({
        data: [othersTotal > 0 ? currentTotal : (currentTotal+othersTotal)],
        stack: 'others',
        color: 'transparent',
        valueFormatter: () => null
      })
      // add bar for this feature

      displaySeries.push({
        data: [Math.abs(othersTotal)],
        label: othersTotal != 0 ? 'others' : null,
        barLabelPlacement: 'outside',
        stack: 'others',
        color: col,
        valueFormatter: () => {
          return `${othersTotal > 0 ? "+" : ""}${othersTotal}%`
        },
        barLabel: (item) => {
        // const label = context.bar.series.xAxis?.data?.[item.dataIndex];
        return `${'others'}: ${item.value}`},
      })

  return displaySeries
}

export default function ContributionWaterfallGraph({data, startProb, is_phish}) {
  
  var displaySeries = FormatWaterfallData(data, startProb)

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
          ml: 1,
          mb: 5,
        }}>
        URL Features
      </Typography>
      <BarChart
        series={displaySeries}
        height={300}
        xAxis={[{
          label: 'Probabilty URL is Malicious',
          min: 0,
          max: 120, //+ Math.max(...barLabels.map(label => label.length)) * 2,
          tickInterval: [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100],
        }]}
        layout = 'horizontal'
        hideLegend = {true}
        slotProps={{
          bar: {
            rx: 3,
            ry: 3,
          },
          tooltip:{
            trigger: 'item',
          },
        }}
        overflow='visible'
        sx = {{
          '& .MuiChartsAxis-left': {
            display: 'none',
          },
          overflow: 'visible'
          
        }}
        margin={{left:-40}}
      />
    </Box>
  );
}