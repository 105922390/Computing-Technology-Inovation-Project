
import {
	Typography, Container
} from '@mui/material';
import { useEffect } from 'react';



export default function AboutTool() {
	useEffect(() => {
		document.title = 'About the Tool';
	}, []);

	return (
		<Container>
			<Typography variant='h2' component='h1' gutterBottom>
				About The Tool
			</Typography>

			<Typography variant='h5' component="h2" gutterBottom>
				This page explains the tool and how it works
			</Typography>
		</Container>
	);
}


