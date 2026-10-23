import * as React from "react";
import { PieChart, pieClasses } from "@mui/x-charts/PieChart";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import { useDrawingArea } from "@mui/x-charts/hooks";
import { styled } from "@mui/material/styles";
import { schemeSet3 } from "d3";

const catagories = ["length", "host", "path", "symbols", "words"];
const features = 
[
  "has_at",
  "has_port",
  "has_encoding",
  "is_shortener",
  "brand_not_in_domain",
  "num_special",
  "suspicious_tld",
  "has_ip",
  "suspicious_words",
  "num_hyphens_host",
  "num_digits",
  "url_length",
  "host_entropy",
  "host_length",
  "path_depth",
  "digit_ratio",
  "path_length",
  "num_dots_host",
];

const minPercent = 6;
const minPercentSmall = 1;

// Define colors for each class
const categoryColors = {
  "length": "#fa938e",
  "host": "#fae18e",
  "path": "#98bf45",
  "symbols": "#51cbcf",
  "words": "#d397ff",
  "other": "#ff91e7",
};

function featureData(dataset) {
  var other = 0
  var otherList = []
  var formatted = []
  for(var i = 0; i < features.length; i ++){
    const item = dataset[i]
    if(item.value >= minPercent){
      formatted.push({
        id: item.id,
        label: item.label,
        value: item.value,
        percentage: item.value,
        // color: categoryColors[item.section]
    })
    } else {
      other += item.value
      otherList.push(item.id)
    }
  }
  formatted.push({
    id: "other",
    label: "Other",
    value: other,
    // color: categoryColors.other,
    percentage: other,
  })
  return formatted;
};

// Create a simplified dataset that groups all catagories of features together
function catagoryData(dataset) {
  var formatted = []
  for(var i = 0; i < catagories.length; i ++){
    const cat = catagories[i]
    const val = dataset
        .filter((item) => item.section === cat)
        .reduce((sum, item) => sum + item.value, 0)
    formatted.push({
      id: cat,
      label: cat,
      value: val,
      color: categoryColors[cat],
      percentage: val,
    })
  }
  return formatted
};
// Smaller peices of the catagories
function catagoryFeatureData(dataset, catagoryD){
  var formatted = []
  var sorted = [...dataset]
  .sort((a, b) => catagories.indexOf(a.section) - catagories.indexOf(b.section))

  var other = 0
  var otherList = []
  var currentCat = catagories[0]

  for(var i = 0; i < features.length; i ++){
    const item = sorted[i]
    const cat = catagoryD.find((d) => d.id === item.section);
    if (item.section != currentCat && otherList.length > 0){
      if (otherList.length == 1){
        formatted.push({
        id: otherList[0],
        label: otherList[0],
        value: other,
        color: categoryColors[sorted[i-1].section],
        percentage: other >= 1 ? other : 0.5,
      })
      } else {
        formatted.push({
        id: "other",
        label: `Other ${item.section}`,
        value: other,
        color: categoryColors[currentCat],
        percentage: other,
      })
      }
      other = 0
      otherList = []
    }
    currentCat = item.section
    if (item.value > minPercentSmall){
      formatted.push({
      id: `${item.label}`,//-${item.section}`,
      label: `${item.label}: `,
      value: item.value,
      percentage:
        (item.value / cat.value) * 100,
      color: cat.color,
      });
    } else {
      other += item.value
      otherList.push(item.id)
    }
  };
  if (otherList.length > 1){
    if (otherList.length == 1){
        formatted.push({
        id: otherList[0],
        label: otherList[0],
        value: other,
        color: categoryColors[sorted[i-1].section],
        percentage: other >= 1 ? other : 0.5,
      })
      } else {
        formatted.push({
        id: "other",
        label: `Other words`,
        value: other,
        color: categoryColors[currentCat],
        percentage: other,
      })
      }
  }
  return formatted
}

const StyledText = styled("text")(({ theme }) => ({
  fill: theme.palette.text.primary,
  textAnchor: "middle",
  dominantBaseline: "central",
  fontSize: 20,
}));

function PieCenterLabel({ children }) {
  const { width, height, left, top } = useDrawingArea();
  return (
    <StyledText x={left + width / 2} y={top + height / 2}>
      {children}
    </StyledText>
  );
}

export default function URLPie({dataset}) {
  const [view, setView] = React.useState("class");
  const handleViewChange = (event, newView) => {
    if (newView !== null) {
      setView(newView);
    }
  };

  const innerRadius = 50;
  const middleRadius = 120;

  const featureD = featureData(dataset)
  const catagoryD = catagoryData(dataset)
  const categoryFeatureD = catagoryFeatureData(dataset, catagoryD)

  return (
    <Box sx={{ width: "100%", textAlign: "center" }}>
      <Typography variant="h5" gutterBottom>
        Feature Importance
      </Typography>
      <ToggleButtonGroup
        color="primary"
        size="small"
        value={view}
        exclusive
        onChange={handleViewChange}
      >
        <ToggleButton value="feature">View by Feature</ToggleButton>
        <ToggleButton value="catagory">View by Catagory</ToggleButton>
      </ToggleButtonGroup>
      <Box sx={{ display: "flex", justifyContent: "center", height: 400 }}>
        {view === "feature" ? (
          <PieChart
            colors={schemeSet3}
            series={[
              {
                innerRadius,
                outerRadius: middleRadius+innerRadius,
                data: featureD,
                arcLabel: (item) => `${item.label} (${item.percentage.toFixed(0)}%)`,
                valueFormatter: ({ value }) =>
                  `${value.toFixed(2)}%`,
                highlightScope: { fade: "global", highlight: "item" },
                highlighted: { additionalRadius: 2 },
                cornerRadius: 6,
                sortingValues: 'none',
              },
            ]}
            sx={{
              [`& .${pieClasses.arcLabel}`]: {
                fontSize: "10px",
              },
            }}
            hideLegend
          >
            <PieCenterLabel>Feature</PieCenterLabel>
          </PieChart>
        ) : (
          <PieChart
            series={[
              {
                innerRadius,
                outerRadius: middleRadius,
                data: catagoryD,
                arcLabel: (item) => `${item.id} (${item.percentage.toFixed(0)}%)`,
                valueFormatter: ({ value }) =>
                  `${value.toFixed(2)}%`,
                highlightScope: { fade: "global", highlight: "item" },
                highlighted: { additionalRadius: 2 },
                cornerRadius: 3,
              },
              {
                innerRadius: middleRadius,
                outerRadius: middleRadius + 20,
                data: categoryFeatureD,
                arcLabel: (item) => {
                  const id = item.label || "";
                  const percentage = item.percentage || 0;
                  return `${id.split("-")[0]} (${percentage.toFixed(0)}%)`;
                },
                arcLabelRadius: 160,
                valueFormatter: ({ value }) =>
                  `${value.toFixed(3)}%`,
                highlightScope: { fade: "global", highlight: "item" },
                highlighted: { additionalRadius: 2 },
                cornerRadius: 3,
              },
            ]}
            sx={{
              [`& .${pieClasses.arcLabel}`]: {
                fontSize: "10px",
              },
            }}
            hideLegend
          >
            <PieCenterLabel>Catagory</PieCenterLabel>
          </PieChart>
        )}
      </Box>
    </Box>
  );
}