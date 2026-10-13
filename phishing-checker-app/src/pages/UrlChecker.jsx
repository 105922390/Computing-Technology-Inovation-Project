
import {
	Typography, Container,
	TextField,
	Button,
	Paper
} from '@mui/material';
import axios from 'axios';
import { useEffect, useState } from 'react';

function DataDisplay({safety, trust, breakdown}) {	
	return (
		<Paper>
			<Typography>Returned</Typography>
			<Typography>Verdict: {safety}</Typography>
			<Typography>AI Trust: {trust}</Typography>
			<Typography>Breakdown</Typography>
			{breakdown?.map((item, index) => (
				<Typography key={index}>{item}</Typography>
			))}
		</Paper>
	)
}

async function fetchPrediction(inputUrl){
	const response = await axios.post(
		'http://localhost:8000/process-data', 
		{ inputUrl }
	);

	return response.data.result
} 


export default function UrlChecker() {
	useEffect(() => {
		document.title = 'URL Checker';
	}, []);

	const [url, setUrl] = useState('');
	const [predictedSafety, setPredictedSafety] = useState(null); // string (want to change to bool)
	const [trustScore, setTrustScore] = useState(null); // int
	const [error, setError] = useState(null); // string
	const [breakdownData, setBreakdownData] = useState(null); // array of strings (may want to change this to be more specific to each explain type)
	const [loading, setLoading] = useState(false); // bool
	const [haveReturn, setHaveReturn] = useState(false); // bool


	const handleSubmit = async (event) => {
		event.preventDefault();
		
		setError(null);
		setLoading(true);

		// Currently old data is 
		// If want old data to reset whenever a new url is submitted
		// setPredictedSafety(null);
		// setTrustScore(null);
		// setBreakdownData(null);

		try {
			// Axios call to backend, ask predicted saftey of provided url
			const result = await fetchPrediction(url)

			setPredictedSafety(result.verdict);
			setTrustScore(result.trust_score);
			setBreakdownData(result.reasons);

			setHaveReturn(true)
		} catch (error) {
			setError('Error analysing url. Please try again.');
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
					<Typography>Error:{error}</Typography>
					)
				)
			}

			{haveReturn&& (
					<DataDisplay
					safety = {predictedSafety}
					trust = {trustScore}
					breakdown = {breakdownData}
					/>
				)
			}
					
		</Container>
	);
}

