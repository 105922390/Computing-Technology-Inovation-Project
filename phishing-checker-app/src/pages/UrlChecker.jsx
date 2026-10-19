
import {
	Typography, Container,
	TextField,
	Button,
	Paper,
	Box
} from '@mui/material';
import axios from 'axios';
import { useEffect, useState } from 'react';
import DonutChart from "../components/URLDonutChart.jsx";
import WaterfallChart from "../components/ContributionWaterfallGraph.jsx";

class UrlData {
  constructor(url, prediction, certainty) {
    this.url = url;
    this.prediction = prediction;
    this.certainty = certainty;
  }
}

// """Plain-English reasons, pointing at the part of the URL that looks suspicious.
//     These are for the user to read; the model itself uses all 18 features."""

function featureDisplay(type, value){
	return <Typography>if {type}: {value}</Typography>

	// switch(type){
	// 	case "has_at":
	// 		return <Typography key={type}>Contains '@': the browser ignores everything before it, the real site is {value}</Typography> 
	// 		// return <Typography>switch {type}: {value}</Typography>
	// }
	
	// switch(type){
	// 	case "has_ip":
	// 		return <Typography key={type}>Uses an IP address ({value}) instead of a domain name</Typography> 
	// 	case "has_at":
	// 		return <Typography key={type}>Contains '@': the browser ignores everything before it, the real site is {value}</Typography> 
	// 	case "has_port":
	// 		return <Typography key={type}>Specifies an unusual port number of {value}</Typography>
	// 	 case "suspicious_tld":
	// 		return <Typography key={type}>Ends in .{value}, a top-level domain often abused for phishing</Typography>
	// 	case "brand_not_in_domain":
	// 		return <Typography key={type}>Mentions {', '.join(value)} but the site is not {value[0]}'s own domain</Typography>
	// 	case "suspicious_words":
	// 		return <Typography key={type}>Contains login/account words: {', '.join(value)}</Typography>
	// 	case "is_shortener":
	// 		return <Typography key={type}>Uses a link shortener, which hides the real destination</Typography>
	// 	case "num_hyphens_host":
	// 		return <Typography key={type}>Domain has {value} hyphens, common in look-alike domains</Typography>
	// 	case "num_dots_host":
	// 		return <Typography key={type}>Many subdomains ({value} dots in the host), can hide the real domain</Typography>
	// 	case "url_length":
	// 		return <Typography key={type}>Very long address ({value} characters)</Typography>
	// 	case "digit_ratio":
	// 		return <Typography key={type}>{value*100}% of the address is digits, e.g. random tokens</Typography>
	// }
}

function ResultDisplay({is_phish, confidence, data, trust}) {
	return(
		<Box>
			<Paper>
				<Typography>Verdict: { is_phish == true ? "Not Safe" : is_phish == false ? "Safe" : "Error no result"}</Typography>
				<Typography>Trust Score: {trust}</Typography>
				<Typography>AI Confidence: {confidence}</Typography>
				<Typography>Breakdown: </Typography>

				<WaterfallChart
				data = {data}
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
	const [breakdownData, setBreakdownData] = useState([]); // array of strings (may want to change this to be more specific to each explain type)
	
	// Tool state values
	const [error, setError] = useState(String); // string
	const [loading, setLoading] = useState(false); // bool
	const [haveReturn, setHaveReturn] = useState(false); // bool

	// History
	const [history, setHistory] = useState([])


	const handleSubmit = async (event) => {
		event.preventDefault();
		
		setError(null);
		setLoading(true);

		// Currently old data is 
		// If want old data to reset whenever a new url is submitted
		// setPredictedSafety(null);
		// setConfidence(null);
		// setBreakdownData(null);

		try {
			// Axios call to backend, ask predicted saftey of provided url
			const result = await fetchPrediction(url)

			setError(result.error)
			setPredictedSafety(result.is_phish);
			setConfidence(result.confidence);
			setTrustScore(result.trust_score);
			setBreakdownData(result.result_data);

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

			{haveReturn && !error &&(
					<ResultDisplay
					is_phish = {predictedSafety}
					confidence = {confidence}
					data = {breakdownData}
					trust = {trustScore}
					/>
				)
			}

			<Paper>
				<Typography>Test Pie Chart</Typography>
				<DonutChart
				/>
				{/* 
				data = urls
				width = 
				height = 
				 */}	
			</Paper>
					
		</Container>
	);
}

