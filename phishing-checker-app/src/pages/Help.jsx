
import {
	Typography, Container
} from '@mui/material';
import { useEffect } from 'react';


export default function Help() {
	useEffect(() => {
		document.title = 'Help';
	}, []);

	return (
		<Container>
			<Typography variant='h2' component='h1' gutterBottom>
				Help
			</Typography>

			<Typography variant='h5' component="h2" gutterBottom>
				This page explains how to use the tool and what the results mean
			</Typography>
		</Container>
	);
}