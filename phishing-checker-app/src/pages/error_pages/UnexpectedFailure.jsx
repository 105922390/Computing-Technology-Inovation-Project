
import {
	Typography, Container
} from '@mui/material';
import { useEffect } from 'react';



export default function UnexpectedFailure() {
	useEffect(() => {
		document.title = 'Unexpected Failure';
	}, []);

	return (
		<Container>
			<Typography variant='h2' component='h1' gutterBottom>
				Error: Unexpected Failure
			</Typography>

			<Typography variant='h5' component="h2" gutterBottom>
				Site Name has experienced an unexpected failure.
			</Typography>
		</Container>
	);
}