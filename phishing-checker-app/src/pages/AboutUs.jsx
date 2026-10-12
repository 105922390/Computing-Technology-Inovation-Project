
import {
	Typography, Container
} from '@mui/material';

import { useEffect } from 'react';



export default function About() {
	useEffect(() => {
		document.title = 'About Us';
	}, []);

	return (
		<Container>
			<Typography variant='h2' component='h1' gutterBottom>
				About Us
			</Typography>

			<Typography variant='h5' component="h2" gutterBottom>
				This is the About page. Here is information about the team
			</Typography>
		</Container>
	);
}
