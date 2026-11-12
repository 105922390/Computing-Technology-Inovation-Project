
import {
	Typography, Container
} from '@mui/material';
import { useEffect } from 'react';
import phishingLogo from '../assets/phishing.png'



export default function AboutPhishing() {
	useEffect(() => {
		document.title = 'About Phishing';
	}, []);

	return (
		<Container>
			<Typography variant='h2' component='h1' gutterBottom>
				What is Phishing?
			</Typography>

			<AboutPhishingInfo>
			</AboutPhishingInfo>

			<AboutPhishingImage>
			</AboutPhishingImage>
		</Container>
	);
}

function AboutPhishingInfo() {
	return (
		<>
		<Typography variant='body1' gutterBottom style={{textAlign: 'center' }}>
			Phishing is a cyber threat where criminals pose as someone you trust, like your bank or a government agency, to trick you into handing over personal information.
		</Typography>
		<br></br>
		<Typography style={{textAlign: 'center' }}>
			Phishing scams can look very convincing and often come accross as authentic messages with real logos and wording. It can be difficult to know if messages are from genuine sources or not.
		</Typography>
		<br></br>
		</>	
	);
}

function AboutPhishingImage() {
	return (
		<div style={{display: 'flex', justifyContent: 'center' }}>
			<br></br>
			<img src={phishingLogo} alt='Phishing Image' width='600'/>
		</div>
	);
}
