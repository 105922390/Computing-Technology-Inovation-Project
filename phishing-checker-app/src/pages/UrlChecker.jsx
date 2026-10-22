
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

class UrlData {
  constructor(url, prediction, certainty) {
    this.url = url;
    this.prediction = prediction;
    this.certainty = certainty;
  }
}

function ResultDisplay({is_phish, confidence, data, trust, startProb}) {
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

			<Paper>
				<Typography>Verdict: { is_phish == true ? "Not Safe" : is_phish == false ? "Safe" : "Error no result"}</Typography>
				<Typography>Trust Score: {trust}</Typography>
				<Typography>AI Confidence: {confidence}</Typography>
				<Typography>Breakdown: </Typography>

				
				{/* <ShapWaterfall></ShapWaterfall> */}


				<WaterfallChart
				data = {data}
				startProb = {startProb}
				is_phish={is_phish}
				/>
			</Paper>
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
	const [shapDetails, setShapDetails] = useState({});
	const [boo, setBoo] = useState("old");

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
			setShapDetails(result.shap);
			setBoo(result.boo);

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
		<Container>
			<Typography variant='h2' component='h1' gutterBottom>
				URL Checker
			</Typography>

			<Typography variant='h5' component="h2" gutterBottom>
				This page contains the tool.
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

			
			<Typography>{boo}</Typography>
			<Typography>{typeof(shapDetails)}</Typography>
			{/* <Typography>{shapDetails.values.shape}</Typography> */}
			{/* <Typography>{typeof(shapDetails[0])}</Typography> */}
			
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

			<Paper>
				<Typography>Test Pie Chart</Typography>
				<DonutChart/>	
			</Paper>
					
		</Container>
	);
}

