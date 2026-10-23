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

			<Typography variant='h5' component="h2" gutterBottom>
				This page explains the tool and how it works
			</Typography>

			<Typography variant='body1' component="p">
				The tool uses an AI model, trained by us.
			</Typography>

			<Paper className='page-section'>
				{/* <Typography className='chart-title' variant='h5' component="h3" gutterBottom>Feature Importance</Typography> */}
				{featureImportance &&(
					<DonutChart
					dataset = {featureImportance}
					/>	
				)}
				{/* {!featureImportance &&(
					<Typography>Error Loading Data</Typography>
				)} */}
				<Typography className='chart-description' component="p" gutterBottom>The importance of each URL feature in the AI model's analysis.</Typography>
			</Paper>
		</Container>
	);
}


