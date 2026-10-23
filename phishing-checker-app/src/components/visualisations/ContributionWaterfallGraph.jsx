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
    }
  })

  othersTotal = (Math.round(othersTotal*100)/100)
  if (othersTotal >= 0){
    dataset.push({feature: "other", fill: currentTotal, pos: othersTotal, neg: 0, grey:0})
  } else{
    dataset.push({feature: "other", fill: (currentTotal+othersTotal), pos: 0, neg: Math.abs(othersTotal), grey:0})
  }
  currentTotal = Math.round((currentTotal + othersTotal)*100)/100
  dataset.push({feature: "Total", fill: 0, pos: 0, neg: 0, grey:currentTotal})

  return [dataset, otherFeatures]
}

function getFeatureName(id){
  switch (id){
    case "has_ip":
      return "IP Address"
    case "has_at":
      return "Has @"
    case "has_port":
      return "Uses Port Number"
    case "suspicious_tld":
      return "Suspicious TLD"
    case "brand_not_in_domain":
      return "Brand Mismatch"
    case "suspicious_words":
      return "Suspicious Words"
    case "is_shortener":
      return "Shortener"
    case "num_hyphens_host":
      return "Hyphens"
    case "num_dots_host":
      return "Dots"
    case "url_length":
      return "URL Length"
    case "path_length":
      return "Path Length"
    case "host_length":
      return "Host Length"
    case "digit_ratio":
      return "Digit Ratio"
    case "num_digits":
      return "Digits"
    case "num_special":
      return "Special Char"
    case "path_depth":
        return "Path Depth"
    case "host_entropy":
      return "Host Entropy"
    case "has_encoding":
      return "Encoding"
    case "other":
      return "Other Features"
  }
  return id
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
          {dataKey: 'fill', id: 'fill', stack: 'stack', color: 'transparent', valueFormatter: () => null},
          {
            dataKey: 'pos',
            id: 'feature_pos',
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
            id: 'feature_neg',
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
            id: 'grey', 
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
          valueFormatter: (value) => {
            return getFeatureName(value);
          },
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
          console.log("clicked: " + dataset[item.dataIndex].feature + "| seriesId: " + item.seriesId + "| dataIndex: " + item.dataIndex)
          if (item.seriesId != 'fill'){
            if (item.seriesId == 'grey'){
              onClickBar(dataset[item.dataIndex].feature, otherFeatures, false, true)
            }
            else{
              var other = false
              if (dataset[item.dataIndex].feature == "other"){ other = true }
              onClickBar(dataset[item.dataIndex].feature, otherFeatures, other, false)
            }
          }
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