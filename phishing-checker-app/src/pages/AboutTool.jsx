import {
	Typography, 
	Container,
	Paper
} from '@mui/material';
import { useEffect } from 'react';
import DonutChart from "../components/visualisations/URLDonutChart.jsx";
import { featureImportance, } from './helper/featureImportanceData.js';

export default function AboutTool() {
	useEffect(() => {
		document.title = 'About the Tool';
	}, []);

	return (
		<Container>
			<Typography variant='h2' component='h1' gutterBottom>
				About The Tool
			</Typography>

			{/* <Typography variant='h5' component="h2" gutterBottom>
				This page explains the tool and how it works
			</Typography> */}

			

			<Paper className='page-section'>
				<Typography variant='body1' component="p" gutterBottom>
					To help you protect yourself, we trained an machine learning model from scratch off over one million training points. It first
					breaks the URL down into a number of features, which are then used to evaluate the likelihood of the link being a URL used for phishing.
					The chart below shows the nine most important of these features in determining the safety of a link, as determined by the model.
				</Typography>
				{/* <Typography className='chart-title' variant='h5' component="h3" gutterBottom>Feature Importance</Typography> */}
				{featureImportance &&(
					<DonutChart
					dataset = {featureImportance}
					/>	
				)}
				{/* {!featureImportance &&(
					<Typography>Error Loading Data</Typography>
				)} */}
			</Paper>
		</Container>
	);
}


