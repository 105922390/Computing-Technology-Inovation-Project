
import {
	Typography, Container
} from '@mui/material';
import { useEffect } from 'react';



export default function PageNotExist() {
	useEffect(() => {
		document.title = 'Page Does Not Exist';
	}, []);

	return (
		<Container>
			<Typography variant='h2' component='h1' gutterBottom>
				Error: Page Does Not Exist
			</Typography>

			<Typography variant='h5' component="h2" gutterBottom>
				Page connot be found.
			</Typography>
		</Container>
	);
}