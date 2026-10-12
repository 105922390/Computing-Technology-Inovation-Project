
import {
	Typography, Container
} from '@mui/material';
import { useEffect } from 'react';



export default function AboutPhishing() {
	useEffect(() => {
		document.title = 'About Phishing';
	}, []);

	return (
		<Container>
			<Typography variant='h2' component='h1' gutterBottom>
				What is Phishing?
			</Typography>

			<Typography variant='h5' component="h2" gutterBottom>
				This page explains phishing
			</Typography>
		</Container>
	);
}
