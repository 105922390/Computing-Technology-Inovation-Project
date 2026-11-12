
import {
	Typography, Container,
	TextField,
	Button,
	Paper,
	Box,
	useTheme,
} from '@mui/material';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { PieChart } from '@mui/x-charts/PieChart';
import { API_BASE_URL } from '../services/api.js';
// import DonutChart from "../components/visualisations/URLDonutChart.jsx";
import WaterfallChart from "../components/visualisations/ContributionWaterfallGraph.jsx";
import AboutFeature from "../components/FeatureDetails.jsx"
import HistoryAnalysisChart from "../components/visualisations/HistoryAnalysisChart.jsx"

import '../css/general.css'


class UrlData {
  	constructor(url, prediction, certainty, result) {
   		this.url = url;
    	this.prediction = prediction;
	  	this.certainty = certainty;
	  	this.result = result;
  	}
}

function getStatusTone(phishingProbability) {
	return phishingProbability >= 60
		? "unsafe"
		: phishingProbability >= 40
			? "caution"
			: "safe";
}

function ConfidenceRing({status, statusClass, confidence}) {
    const theme = useTheme();
    const confidencePercent = Math.min(100, Math.max(0, confidence));
    const tone = status === 'Safe'
        ? theme.palette.confidenceRing.safe
        : status === 'Caution'
            ? theme.palette.confidenceRing.caution
            : theme.palette.confidenceRing.unsafe;
    const confidenceLabel = `${Math.round(confidencePercent * 100) / 100}%`;

    return (
        <Box
            className='url-checker-confidence'
            role='img'
			aria-label={`${status} evaluation, ${confidenceLabel} model confidence`}
			
        >
            <PieChart
                className='url-checker-confidence-chart'
                width={260}
                height={260}
                series={[{
                    data: [
                        { id: 'confidence', value: confidencePercent },
                        { id: 'remaining', value: 100 - confidencePercent },
                    ],
                    innerRadius: 88,
                    outerRadius: 104,
                    startAngle: 0,
                    endAngle: 360,
                    cornerRadius: 8,
                    paddingAngle: 0,
                    sortingValues: 'none',
                }]}
                colors={[tone.ring, theme.palette.confidenceRing.trackColour]}
				margin={0}
				hideLegend
				slotProps={{ tooltip: {trigger: 'none'}}}
                aria-hidden
            />
            <Box className='url-checker-confidence-label'>
                <Typography
                    variant='h6'
                    className={`url-checker-confidence-status ${statusClass}`}
                    sx={{ color: tone.text }}
                >
                    {status}
                </Typography>
                <Typography
                    variant='h3'
                    className='url-checker-confidence-value'
                    sx={{ color: tone.text }}
                >
                    {confidenceLabel}
                </Typography>
                <Typography variant='body2' className='url-checker-confidence-caption'>
                    confidence
                </Typography>
            </Box>
        </Box>
    );
}

function ResultDisplay({phishProb, confidence, data, startProb}) {
    const [currentFeatureId, setCurrentFeatureId] = useState("")
    const [others, setOthers] = useState("")
    const [isOthers, setIsOthers] = useState("")
    const p = phishProb[0]
    const confidencePercent = confidence[0]
    const status = p >= 60 ? "Not Safe" : p >= 40 ? "Caution" : "Safe";
    const statusTone = getStatusTone(p);
	
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
			<ConfidenceRing
					status={status}
					statusClass={`url-checker-status--${statusTone}`}
					confidence={confidencePercent}
				/>
			<Paper className='page-section url-checker-result'>
				

				<Box className='url-checker-metric url-checker-risk-metric'>
					<Typography variant='h4' className='url-checker-metric-value'>
						{Math.round(p*100)/100}%
					</Typography>
					<Typography variant='body2' className='url-checker-metric-label'>
						Chance of phishing
					</Typography>
				</Box>
				
				
				<Typography 
					variant='h5' sx={{ alignSelf: 'center'}}>
					URL Features And Their Effect
				</Typography>
				<Typography 
					variant='body2' sx={{ alignSelf: 'center', m:-2}}>
					Click a bar to see more detail
				</Typography>
				<Box className='url-checker-chart'>
					<WaterfallChart
					data = {data}
					startProb = {startProb}
					onClickBar = {onClickFeatureBar}
					/>
				</Box>
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
		`${API_BASE_URL}/process-data`,
		{ url : inputUrl }
	);
	
	return response
} 



export default function UrlChecker({history, setHistory}) {
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
	

	const handleSubmit = async (event) => {
		event.preventDefault();
		
		setError(null);
		setLoading(true);
		setHaveReturn(false);

		try {
			// Axios call to backend, ask predicted saftey of provided url
			const response = await fetchPrediction(url);
			
			const result = response.data.result
			// console.log(result)
			// console.log("got return");
			setError(result.error);
			// console.log(result.result_data)
			if (result.result_data != undefined){
				setPishProb(result.phish_prob);
				setConfidence(result.confidence);
				setBreakdownData(result.result_data);
				setBreakdownBaseProb(result.base_prob);

				const statusTone = getStatusTone(result.phish_prob[0]);
				const urlData = new UrlData(
					url,
					result.phish_prob,
					result.confidence,
					statusTone
				);
				// Only add an element to the history list if the url isn't already in there
				setHistory((previousHistory) =>
					previousHistory.some((entry) => entry.url.trim() === url.trim())
						? previousHistory
						: [...previousHistory, urlData]
				);
				setHaveReturn(true);
			}

			
		} catch (error) {
			const status = error.response?.status

			if (status === 503) {
				setError('Too many requests! Please wait before trying again.');
			} else if (status == null) {
				setError('Unable to reach the server. Please try again.');
			} else {
				setError(
					'Something went wrong. Please try again. | Error code: ' + status
				);
			}
			console.error(error);
		} finally {
			setLoading(false);
		}
	};
	

	return (
		<Container className='main-w-side url-checker-page'>
			<Typography variant='h2' component='h1' gutterBottom>
				PhishGuard URL Checker
			</Typography>

			<Paper className='url-checker-hero'>
				<Typography variant='h5' component="h2" className='url-checker-subtitle'>
					Scan your URL
				</Typography>

				<form onSubmit={handleSubmit} className='url-checker-form'>
					<TextField
					label="Enter URL"
					value={url}
					onChange={(event) => setUrl(event.target.value)}
					placeholder='example.com'
					fullWidth
					/>

					<Button
					type='submit'
					variant='contained'
						size='large'
					className='glow-button'
					>
						Analyse
					</Button>
				</form>

				{ loading? (
						<Typography className='url-checker-feedback'>Analysing URL...</Typography>
					):(
						error && (
						<Typography className='url-checker-feedback' color='error' role='alert'>{error}</Typography>
						)
					)
				}
			</Paper>
			
			{(haveReturn) && (
			<Container>
					<ResultDisplay
					phishProb = {phishProb}
					confidence = {confidence}
					data = {breakdownData}
					startProb = {breakdownBaseProb}
					/>
					<HistoryAnalysisChart data={history}>

					</HistoryAnalysisChart>
				</Container>
					
				)
			}
					
		</Container>
	);
}
