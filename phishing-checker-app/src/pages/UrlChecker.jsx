
import {
	Typography, Container,
	TextField,
	Button,
	Paper,
	Box
} from '@mui/material';
import axios from 'axios';
import { useEffect, useState } from 'react';
import DonutChart from "../components/visualisations/URLDonutChart.jsx";
import WaterfallChart from "../components/visualisations/ContributionWaterfallGraph.jsx";
import AboutFeature from "../components/FeatureDetails.jsx"

import '../css/general.css'
import { rgb } from 'd3';

class UrlData {
  constructor(url, prediction, certainty) {
    this.url = url;
    this.prediction = prediction;
    this.certainty = certainty;
  }
}

function ResultDisplay({phishProb, confidence, data, startProb}) {
	const [currentFeatureId, setCurrentFeatureId] = useState("")
	const [others, setOthers] = useState("")
	const [isOthers, setIsOthers] = useState("")
	const p = phishProb[0]
	
	function onClickFeatureBar(featureId, others, isOthers, isTotal){
		// console.log("click recived, feature:" + featureId)
		if (!isTotal){
			setCurrentFeatureId(featureId)
			setOthers(others)
			setIsOthers(isOthers)
		}
	}
	
	return(
		<Box>
			<Paper className='page-section'>
				<Typography variant='h4' style={{marginBottom:"2%"}}>{ p >= 60 ? "Not Safe" : p >= 40 ? "Caution" : "Safe"}</Typography>
				<div
				style={{
					display:'flex',
					flexDirection:'row',
					columnGap:'2%',
					// padding:5,
				}}>
					<Typography variant='h5'>{Math.round(p*100)/100}%</Typography>
					<Typography style={{alignSelf:'flex-end'}}>Chance of Phishing</Typography>
				</div>
				<Typography>AI Confidence: {Math.round(confidence[0]*100)/100}%</Typography>
				
				{/* <Typography variant='body2' sx={{m: 2}}
				>Key features identified in the URL</Typography> */}
				
				{/* <Typography 
				variant='h6' sx={{alignSelf: 'center'}}
				>Prediction Breakdown</Typography> */}
				<WaterfallChart
				data = {data}
				startProb = {startProb}
				onClickBar = {onClickFeatureBar}
				/>
			</Paper>

			{isOthers&&(
				<Typography variant='h5'>Other Features</Typography>
			)}

			{currentFeatureId && (currentFeatureId != "") &&(
				<Paper className='page-section'>
					{(currentFeatureId != 'other')&& (
						<AboutFeature
						featureId={currentFeatureId}
						value={data[currentFeatureId].value}
						/>
					)}
					{(currentFeatureId == 'other')&& (
						<div className='feature-desc-container'>	
							{others.map(feature => <AboutFeature
							featureId={feature}
							value={data[feature].value}
							/>)}
						</div>
					)}
				</Paper>
			)}
		</Box>
	)
}

async function fetchPrediction(inputUrl){
	const response = await axios.post(
		'http://localhost:8000/process-data', 
		{ url : inputUrl }
	);

	return response.data.result
} 


export default function UrlChecker() {
	useEffect(() => {
		document.title = 'URL Checker';
	}, []);

	// Input
	const [url, setUrl] = useState('');

	// Results (UI state)
	const [phishProb, setPishProb] = useState(Number); // string (want to change to bool)
	const [confidence, setConfidence] = useState(Number);
	const [breakdownData, setBreakdownData] = useState({}); // array of strings (may want to change this to be more specific to each explain type)
	const [haveReturn, setHaveReturn] = useState(false); // bool
	
	// Tool state values
	const [error, setError] = useState(String); // string
	const [loading, setLoading] = useState(false); // bool
	const [breakdownBaseProb, setBreakdownBaseProb] = useState(false);

	// History
	const [history, setHistory] = useState([]);

	const handleSubmit = async (event) => {
		event.preventDefault();
		
		setError(null);
		setLoading(true);
		setHaveReturn(false);

		try {
			// Axios call to backend, ask predicted saftey of provided url
			const result = await fetchPrediction(url);
			console.log("got return");
			setError(result.error);

			if (result.result_data != undefined){
				setPishProb(result.phish_prob);
				setConfidence(result.confidence);
				setBreakdownData(result.result_data);
				setBreakdownBaseProb(result.base_prob);
				setHistory([new UrlData(url, phishProb, confidence)]);
			}

			setHaveReturn(true);
		} catch (error) {
			setError('Error analysing url. Please try again. | ' + error);
			console.error(error);
		} finally {
			setLoading(false);
		}
	};
	

	return (
		<Container className='main-w-side'>
			<Typography variant='h2' component='h1' gutterBottom>
				URL Checker
			</Typography>

			<Typography variant='h5' component="h2" gutterBottom>
				Scan your URL
			</Typography>
			{/* <UrlInput /> */}

			<form onSubmit={handleSubmit}>
				<TextField
				label="Enter URL"
				value={url}
				onChange={(event) => setUrl(event.target.value)}
				placeholder='example.com'
				/>

				<Button
				type='submit'
				>
					Analyse
				</Button>
			</form>

			{ loading? (
					<Typography>Analysing URL...</Typography>
				):(
					error && (
					<Typography>{error}</Typography>
					)
				)
			}
			
			{(haveReturn) &&(
					<ResultDisplay
					phishProb = {phishProb}
					confidence = {confidence}
					data = {breakdownData}
					startProb = {breakdownBaseProb}
					/>
				)
			}

			<aside className='aside-info'>
				<Paper>
					<Typography>Test Pie Chart</Typography>
					<DonutChart/>	
				</Paper>
			</aside>
					
		</Container>
	);
}

