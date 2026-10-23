import { Box } from '@mui/material';
import { ChartsAxisHighlightValue } from '@mui/x-charts';
import { BarChart } from '@mui/x-charts/BarChart';

function FormatWaterfallData(data, startProb){
  const keys = Object.keys(data)

  var currentTotal = Math.round(startProb*10000)/100
  var othersTotal = 0
  var otherFeatures = []
  var dataset = []
  dataset.push({feature: "Starting Probability", fill: 0, pos: 0, neg: 0, grey:currentTotal})

  keys.forEach(feature => {
    const contrib = Math.round(data[feature]['contribution']*10000)/100
    if (Math.abs(contrib) >= 2){
      var blank
      var minus = 0
      var plus = 0
      if(contrib <= 0){
        minus = Math.abs(contrib)
        blank = currentTotal+contrib
      } else {
        plus = Math.abs(contrib)
        blank = currentTotal
      }
      dataset.push({feature: feature, fill: blank, pos: plus, neg: minus, grey:0})
      currentTotal += contrib
    } else {
      otherFeatures.push(feature)
      othersTotal += contrib
      console.log("others total" +othersTotal)
    }
  })

  othersTotal = (Math.round(othersTotal*100)/100)

  if (othersTotal >= 0){
    dataset.push({feature: "Other Features", fill: currentTotal, pos: othersTotal, neg: 0, grey:0})
  } else{
    dataset.push({feature: "Other Features", fill: (currentTotal+othersTotal), pos: 0, neg: Math.abs(othersTotal), grey:0})
  }

  currentTotal = Math.round((currentTotal + othersTotal)*100)/100
  dataset.push({feature: "Total", fill: 0, pos: 0, neg: 0, grey:currentTotal})

  return [dataset, otherFeatures]
}

function valueFormatter(value) {
  if (typeof value === 'number') {
    return Math.round(value).toString()+"%";
  }
  return value;
}

export default function ContributionWaterfallGraph({data, startProb, onClickBar}) {

  const [dataset, otherFeatures] = FormatWaterfallData(data, startProb)  

  return (
    <Box
      sx ={{
        display: 'flex',
        alignItems: 'center',
      }}
    >
      <BarChart
        dataset={dataset}
        series={[
          {dataKey: 'fill', stack: 'stack', color: 'transparent', valueFormatter: () => null},
          {
            dataKey: 'pos', 
            stack: 'stack', 
            color: '#d21919',
            barLabelPlacement: 'outside',
            minBarSize: 2,
            highlightScope:{
              highlight: 'item',
              fade: 'global'
            },
            valueFormatter: (value, {dataIndex}) => {
              return value != 0 ? `${dataset[dataIndex].feature} +${value}%` : null},
            barLabel: (item) => {
              return item.value != 0 ? `+${item.value}%` : null},
          },
          {
            dataKey: 'neg', 
            stack: 'stack', 
            color: '#3bd219',
            barLabelPlacement: 'outside',
            minBarSize: 2,
            highlightScope:{
              highlight: 'item',
              fade: 'global'
            },
            valueFormatter: (value, {dataIndex}) => {
              return value != 0 ? `${dataset[dataIndex].feature} -${value}%` : null},
            barLabel: (item) => {
              return item.value != 0 ? `-${item.value}%` : null},
          },
          {
            dataKey: 'grey', 
            stack: 'stack', 
            color: '#868686',
            barLabelPlacement: 'outside',
            minBarSize: 2,
            highlightScope:{
              highlight: 'item',
              fade: 'global'
            },
            valueFormatter: (value, {dataIndex}) => {
              return value != 0 ? `${dataset[dataIndex].feature} +${value}%` : null},
            barLabel: (item) => {
              return item.value != 0 ? `${item.value}%` : null},
          }
        ]}
        height={300}
        xAxis={[{
          label: 'Probabilty URL is Malicious (%)',
          min: 0,
          max: 120,
          tickInterval: [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100],
        }]}
        yAxis={[{
          dataKey: 'feature',
          label: "URL Features",
          width: 120,
        }]}
        layout = 'horizontal'
        hideLegend = {true}
        axisHighlight={{
          x: 'line',
          y: 'none'
        }}
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
        onItemClick={(event, item) => {
          console.log("clicked: " + item)
          onClickBar(item.seriesId, otherFeatures)
        }}
      >
        <ChartsAxisHighlightValue
          axisDirection="x"
          labelPosition="both"
          valueFormatter={valueFormatter}
        />
      </BarChart>
    </Box>
  );
}