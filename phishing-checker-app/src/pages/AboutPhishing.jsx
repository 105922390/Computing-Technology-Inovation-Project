
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
		<Typography variant='body1' gutterBottom>
			Phishing is a cyber threat where criminals pose as someone you trust, like your bank or a government agency, to trick you into handing over personal information. They usually reach out through fake emails or messages that look legitimate, hoping you'll hand over things such as your online banking logins, credit card details, or passwords. Once they have those, they can break into your accounts.
		</Typography>
		<br></br>
		<Typography>
			Phishing scams can look very convincing and often come accross as authentic messages with real logos and wording. It can be difficult to know if messages are from genuine sources or not.
		</Typography>
		</>	
	);
}

function AboutPhishingImage() {
	return (
		<div>
			<br></br>
			<img src={phishingLogo} alt='Phishing Image' width='600'/>
		</div>
	);
}
