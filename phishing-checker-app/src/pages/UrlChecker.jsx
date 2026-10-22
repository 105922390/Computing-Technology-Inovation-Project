
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

class UrlData {
  constructor(url, prediction, certainty) {
    this.url = url;
    this.prediction = prediction;
    this.certainty = certainty;
  }
}

function ResultDisplay({is_phish, confidence, data, trust, startProb}) {
	const [currentFeatureId, setCurrentFeatureId] = useState("")
	const [shown, setShown] = useState("")
	const [others, setOthers] = useState("")
	
	function onClickFeatureBar(featureId, shown, others){
		console.log("click recived, feature:" + featureId)
		setCurrentFeatureId(featureId)
		setShown(shown)
		setOthers(others)
	}
	
	return(
		<Box>
			{/* /Debug what is in data/ */}
			{/* <Typography>type of returned data:{typeof(data)}</Typography>
			{
				Object.keys(data).map((feature) =>
					<Box>
						<Typography>feat type: {typeof(feature)} feat: {feature}</Typography>
						<Typography>val type: {typeof(data[feature])}</Typography>
						<Typography>value: {data[feature]['value']} contribution: {data[feature]['contribution']}</Typography>
					</Box>
				)
			} */}

			<Paper className='page-section'>
				
				<Typography>Verdict: { is_phish == true ? "Not Safe" : is_phish == false ? "Safe" : "Error no result"}</Typography>
				<Typography>Trust Score: {Math.round(trust[0]*100)/100}%</Typography>
				<Typography>AI Confidence: {Math.round(confidence[0]*100)/100}%</Typography>
				
				{/* <Typography variant='body2' sx={{m: 2}}
				>Key features identified in the URL</Typography> */}
				
				<Typography 
				variant='h5' sx={{alignSelf: 'center'}}
				>Prediction Breakdown</Typography>
				<WaterfallChart
				data = {data}
				startProb = {startProb}
				onClickBar = {onClickFeatureBar}
				/>
			</Paper>

			{(currentFeatureId == 'other')&&(
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
	const [predictedSafety, setPredictedSafety] = useState(null); // string (want to change to bool)
	const [confidence, setConfidence] = useState(Number);
	const [trustScore, setTrustScore] = useState(Number);
	const [breakdownData, setBreakdownData] = useState({}); // array of strings (may want to change this to be more specific to each explain type)
	
	// Tool state values
	const [error, setError] = useState(String); // string
	const [loading, setLoading] = useState(false); // bool
	const [haveReturn, setHaveReturn] = useState(false); // bool
	const [breakdownBaseProb, setBreakdownBaseProb] = useState(false);

	// History
	const [history, setHistory] = useState([])

	const handleSubmit = async (event) => {
		event.preventDefault();
		
		setError(null);
		setLoading(true);

		// setPredictedSafety(null);
		// setConfidence(null);
		// setBreakdownData(null);

		try {
			// Axios call to backend, ask predicted saftey of provided url
			const result = await fetchPrediction(url)
			console.log("got return")
			setError(result.error)
			setPredictedSafety(result.is_phish);
			setConfidence(result.confidence);
			setTrustScore(result.trust_score);
			setBreakdownData(result.result_data);
			setBreakdownBaseProb(result.base_prob);

			setHaveReturn(true)

			setHistory([new UrlData(url, predictedSafety, confidence)])
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

			{/* /Debug what is in data/ */}
			{/* <Typography>type of returned data:{typeof(breakdownData)}</Typography>
			{
				Object.keys(breakdownData).map((feature) =>
					<Box>
						<Typography>feat type: {typeof(feature)} feat: {feature}</Typography>
						<Typography>val type: {typeof(breakdownData[feature])}</Typography>
						<Typography>value: {breakdownData[feature]['value']} contribution: {breakdownData[feature]['contribution']}</Typography>
					</Box>
				)
			} */}
			
			{haveReturn && !error &&(
					<ResultDisplay
					is_phish = {predictedSafety}
					confidence = {confidence}
					data = {breakdownData}
					trust = {trustScore}
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

