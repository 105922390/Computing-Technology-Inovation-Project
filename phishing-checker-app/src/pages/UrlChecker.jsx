
import {
	Typography, Container,
	Input
} from '@mui/material';
import { useEffect } from 'react';

function UrlInput() {
	return (
		<>
		<label for="url">Insert URL: </label>
		<Input type="text" id="url" name="url" placeholder="https://example.com" />
		</>
	)
}


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
			<UrlInput />
			
		</Container>
	);
}

