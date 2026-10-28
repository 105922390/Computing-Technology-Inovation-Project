import { Box, Button, Container, Divider, Typography } from "@mui/material";
import { useEffect } from "react";
import { Link } from "react-router";


export default function Home() {
	useEffect(() => {
		document.title = 'Home';
	}, []);
	
	return (
		<Box>
			{/* Headings */}
			<Container sx={{ textAlign: 'center' }}>
				<Typography variant='h3' component='h2'>
					Site Name
				</Typography>

				<Typography variant='h1' component='h1'>
					BROWSE CONFIDENTLY
				</Typography>

				<Typography variant='h5' component="h3">
					Scan your links for phishing
				</Typography>

				{/* Scan Button */}
				<Button
					variant="contained"
					size="large"
					sx={{
						m: 5,
						fontSize: "2rem"
					}}
					component={Link}
					to="/url-checker"
				>
					<strong>Scan a URL</strong>
				</Button>
			</Container>

			{/* "What is phishing" box */}
			<Container
				maxWidth="sm"
				sx={{
					border: 5,
					borderColor: 'divider',
					borderRadius: 7,
					bgcolor: 'background.paper',
					color: 'text.primary',
					p: 3
				}}
			>
				<Typography variant="h5" component="h3">
					What is Phishing?
				</Typography>
				
				{/* Put the button and text in the same line */}
				<Box
					sx={{
						display: 'flex',
						alignItems: 'flex-start'
					}}
				>
					<Typography variant="p" component="p" sx={{ flex: 1 }}>
						A brief sentance-long explanation of phishing scams.
					</Typography>

					<Button
						variant="outlined"
						size="medium"
						component={Link}
						to="/about-phishing"
					>
						Learn More
					</Button>
				</Box>
			</Container>

			{/* Horizontal line */}
			<Divider
				sx={{
					borderColor: 'divider',
					borderBottomWidth: 3,
					my: 3
				}}
			/>
			{/* Helping you Protect you section */}
			<Typography variant="h3" component="h1" gutterBottom
				sx={{
					textAlign: "center"
				}}
			>
				Helping You Protect You
			</Typography>

			<Container maxWidth="sm">
				<Typography variant="p" component="p">
					<strong>Site Name</strong> scans links for suspicious features using a specially trained AI model.
				</Typography>
				

				{/* Learn more button */}
				<Box sx={{ textAlign: "center", m:1 }}>
					<Typography variant="p" component="p">
					Want to know how it works?
				</Typography>
					<Button
						variant="outlined"
						size="medium"
						sx={{
							m:1
						}}
						component={Link}
						to="/about-the-tool"
					>
						Learn More
					</Button>
				</Box>
			</Container>



		</Box>
	);
}