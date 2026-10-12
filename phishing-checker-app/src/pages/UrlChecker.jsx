
import {
	Typography, Container
} from '@mui/material';
import { useEffect } from 'react';



export default function UrlChecker() {
	useEffect(() => {
		document.title = 'URL Checker';
	}, []);

	return (
		<Container>
			<Typography variant='h2' component='h1' gutterBottom>
				URL Checker
			</Typography>

			<Typography variant='h5' component="h2" gutterBottom>
				This page contains the tool.
			</Typography>
		</Container>
	);
}

