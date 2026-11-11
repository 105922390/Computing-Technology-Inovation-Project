import {
	Typography, Container,
	TextField,
	Button,
	Box
} from '@mui/material';
import axios from 'axios';
import { useEffect, useState } from 'react';

async function fetchLogin(username, password){
	const response = await axios.get(
		'http://localhost:8000/log-in', 
		{
			params: { 
				username : username,
				password : password 
			}
		}
		
	);
		console.log("returned")
	return response.data
} 

export default function Help() {
	useEffect(() => {
		document.title = 'Login';
	}, []);

	const [success, setSuccess] = useState(false);
	const [generalError, setGeneralError] = useState(false);
	const [usernameError, setUsernameError] = useState(false);
	const [passwordError, setPasswordError] = useState(false);
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	
	const handleSubmit  = async (event) => {
		event.preventDefault()
		setPasswordError(null)
		setUsernameError(null)
		setGeneralError(null)

		if(username == ""){
			console.log("empty username")
			setUsernameError("Username is empty.")
			return
		}
		if(password == ""){
			console.log("empty password")
			setPasswordError("Password is empty.")
			return
		}

		try {
			const result = await fetchLogin(username, password)
			console.log(result)
			if(!result){
				setGeneralError("Apologies, we seem to be having issues logging you in.")
				return
			}
			if (result.error || result.success == null){
				setGeneralError(result.error)
			} else {
				setSuccess(result.success)
			}
		} catch (error) {
			setGeneralError(error)
		}
	}

	return (
		<Container>
			<Typography variant='h2' component='h1' gutterBottom>
				Login
			</Typography>

			<Typography variant='h5' component="h2" gutterBottom>
				User login page
			</Typography>

			<form onSubmit={handleSubmit} className='url-checker-form'>
					<TextField
					label="Username"
					value={username}
					onChange={(event) => setUsername(event.target.value)}
					placeholder= 'username'
					fullWidth
					/>
					{(usernameError != null) && (
						<Typography variant="caption" color='error' role='alert'>{usernameError}</Typography>
					)}

					<TextField
					label="Password"
					value={password}
					onChange={(event) => setPassword(event.target.value)}
					placeholder= 'Password'
					fullWidth
					/>
					{(passwordError != null) && (
						<Typography variant="caption" color='error' role='alert'>{passwordError}</Typography>
					)}

					{(generalError != null) && (
						<Typography color='error' role='alert'>{generalError}</Typography>
					)}
					<Button
					type='submit'
					variant='contained'
						size='large'
					className='glow-button'
					>
						Enter
					</Button>
			</form>

			{success && (
				<Box>
					<Typography variant="body1" component="h2">
						Logged in successfully. Welcome {username}!
					</Typography>
				</Box>
			)}
		</Container>
	);
}