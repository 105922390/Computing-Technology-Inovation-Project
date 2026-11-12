
import {
	Typography, Container
} from '@mui/material';

import { useEffect } from 'react';
import julian from '../assets/julian.jpg'
import Figpie from '../assets/Figpie.png'
import Chambellium from '../assets/Chambellium.png'


export default function About() {
	useEffect(() => {
		document.title = 'About Us';
	}, []);

	return (
		<Container>
			<Typography variant='h2' component='h1' gutterBottom>
				About Us
			</Typography>

			<AboutUsImages>
			</AboutUsImages>
			<br></br>
			<Typography variant='body1' gutterBottom style={{textAlign: 'center'}}>
				We are a team of three Computer Science students from Swinburne's COS30049 Computing Technology Innovation Project. Julian and Campbell are majoring in Cybersecurity while Asha is majoring in Games. 
			</Typography>
		</Container>
	);
}

function AboutUsImages() {
	return (
		<div style={{display: 'flex', justifyContent: 'center', flexWrap: 'wrap' }}>

		<figure style={{ margin: '10px' }}>
			<img src={julian} alt='Julian Image' width='180' height='180' style={{border: '5px solid #4cc9ff', borderRadius: '8px', margin: '30px'}}/>
			<figcaption style={{ display: 'flex', justifyContent: 'center', marginTop: '1px', color: '#555', fontSize: '24px' }}>
				Julian
			</figcaption>
		</figure>

		<figure style={{ margin: '10px' }}>
			<img src={Figpie} alt='Figpie Image' width='180' height='180' style={{border: '5px solid #4cc9ff', borderRadius: '8px', margin: '30px'}}/>
			<figcaption style={{ display: 'flex', justifyContent: 'center', marginTop: '1px', color: '#555', fontSize: '24px' }}>
				Asha
			</figcaption>
		</figure>

		<figure style={{ margin: '10px' }}>
			<img src={Chambellium} alt='Chambellium Image' width='180' height='180' style={{border: '5px solid #4cc9ff', borderRadius: '8px', margin: '30px'}}/>
			<figcaption style={{ display: 'flex', justifyContent: 'center', marginTop: '1px', color: '#555', fontSize: '24px' }}>
				Campbell
			</figcaption>
		</figure>
		</div>
	);
}
  