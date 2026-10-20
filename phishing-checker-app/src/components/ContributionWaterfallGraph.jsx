import { Box, Typography } from '@mui/material';
import { BarChart } from '@mui/x-charts/BarChart';

export default function ContributionWaterfallGraph({data, startProb, roundTo}) {
  
  const keys = Object.keys(data)

  // const dataset = [
  //         {feature: 'url_length', contribution: 1, filler: 0, color:'#3bd219'},
  //         {feature: 'path_length', contribution: 1, filler: 1, color:'#3bd219'},
  //         {feature: 'sus_words', contribution: 1, filler: 2, color:'#3bd219'},
  //         {feature: 'oop', contribution: 3, filler: 0, color:'#d21919'},
  //         {feature: 'oop', contribution: -1, filler: 0, color:'#d21919'},
  //         {feature: 'another', contribution: -1, filler: -1, color:'#d21919'},
  //       ]

  // const dataset = [
  //         {
  //           feature: "Features",
  //           url_length: 1, url_length_filler: 0, url_length_color:'#3bd219',
  //           path_length: 1, path_length_filler: 0, path_length_color:'#3bd219',
  //           sus_words: 1, sus_words_filler: 0, sus_words_color:'#3bd219',
  //           opp: 1, oop_filler: 0, oop_color:'#d21919',
  //           another: 1, another_filler: 0, another_color:'#d21919',
  //         },
  // ];

  // move into a seperate fucntion later
  var displaySeries = [];
  var contrib = 0;
  var col = null;
  var currentTotal = Math.round(startProb*100)
  console.log(keys.length)
  keys.forEach(feature => {
    contrib = Math.round(data[feature]['contribution']*100)
    if (contrib != 0){

      col = ((contrib > 0) ? '#3bd219' : '#d21919')
      // add potential clear fill bar for this feature
      displaySeries.push({
        data: [contrib > 0 ? currentTotal : (currentTotal+contrib)],
        label: null,
        stack: feature,
        color: 'transparent',
      })
      // add bar for this feature
      displaySeries.push({
        data: [Math.abs(contrib)],
        label: contrib > 0 ? feature : null,
        stack: feature,
        color: col,
        valueFormatter: (contrib) =>
          `${contrib > 0 ? "+":""}${contrib} contribution`
      })
      
      console.log(feature)
      console.log(contrib)
      console.log(col)
      console.log(currentTotal)

      currentTotal += contrib

      console.log(currentTotal)
    }
  });
        
  return (
    <Box>
			{/* /Debug what is in data/ */}
      <Typography>type of returned data:{typeof(data)}</Typography>
      {/* <Typography>type of returned data:{data}</Typography> */}
			{
				Object.keys(data).map((feature) =>
					<Box>
						{/* <Typography>feat: {feature}</Typography> */}
						{/* <Typography>val type: {typeof(data[feature])}</Typography>
						<Typography>value: {data[feature]['value']} contribution: {data[feature]['contribution']}</Typography> */}
					</Box>
				)
			}
{/* // xAxis={[{ 
        //   // colorMap: {
        //   //   type: 'piecewise',
        //   //   thresholds: [0, 3],
        //   //   colors: ['#1976d2', '#d32f2f'],
        //   // },
        // }]} */}
      {/* <BarChart
        
        yAxis = {[
          {
            dataKey: 'feature'
          }
        ]}
        series={[
          {
            dataKey: 'filler', 
            stack: 'stack',
            color: 'rgba(187, 35, 35, 0)'
          },
          {
            dataKey: 'contribution', 
            stack: 'stack',
            color: '#d2a119',
          },
        ]}
        dataset={dataset}
        height={300}
        layout = 'horizontal'
      /> */}

      {/* <Typography>displaySeries.Type: {typeof(displaySeries)}</Typography>
      <Typography>displaySeries[keys[0]].Type: {typeof(displaySeries[keys[0]])}</Typography>
      <Typography>displaySeries[keys[0]]: {displaySeries[keys[0]]}</Typography>
      <Typography>dataste.Type: {typeof(dataset)}</Typography>
      <Typography>keys.Type: {typeof(keys)}</Typography>
      <Typography>keys.length: {keys.length}</Typography>
      <Typography>startprob.type: {typeof(startProb)}</Typography>
      <Typography>startprob: {startProb}</Typography> */}

      <BarChart
        series={displaySeries}
        height={300}
        layout = 'horizontal'
        borderRadius = {30}
      />
    </Box>
  );
}