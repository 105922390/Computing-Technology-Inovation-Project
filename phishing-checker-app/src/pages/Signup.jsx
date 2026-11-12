import {
	Typography, Container,
	TextField,
	Button,
	Box
} from '@mui/material';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { Link as RouterLink } from 'react-router';
import { API_BASE_URL } from '../services/api.js';

async function checkUsername(username){
	const response = await axios.get(
		`${API_BASE_URL}/check-username-free`,
		{
			params: 
			{ 
				username : username
			}
		}
		
	);
	return response.data
}

async function createUser(username, password){
	const response = await axios.post(
		`${API_BASE_URL}/sign-up`,
		{
			username, 
			password
		}
		
	);
	return response.data
} 

export default function Help() {
	useEffect(() => {
		document.title = 'Sign Up';
	}, []);

	const [success, setSuccess] = useState(false);
	const [usernameError, setUsernameError] = useState(false);
	const [passwordError, setPasswordError] = useState(false);
	const [generalError, setGeneralError] = useState(false);
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

		const available = await checkUsernameAvailable(username)
		if (!available){
			setUsernameError("Username unavailable. Try another.")
			return
		}

		try {
			const result = await createUser(username, password)
			console.log(result)
			if (!result){
				setGeneralError("Issue creating account.")
				setSuccess(false)
			} else {
				setSuccess(true)
			}
		} catch (error) {
			setGeneralError(error)
			console.error(error);
		}
	}

	const checkUsernameAvailable = async (username) => {
		try{
			const isAvailable = await checkUsername(username)
			return isAvailable
		} catch (error) {
			setGeneralError(error)
			console.error(error);
			return false
		}
	}

	return (
		<Container>
			<Typography variant='h2' component='h1' gutterBottom>
				Sign Up
			</Typography>

			<Typography variant='p' component="p" gutterBottom>
				Don't like Phish? Create an account with PhishGuard!
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

					<Button
					type='submit'
					variant='contained'
						size='large'
					className='glow-button'
					>
						Sign Up
					</Button>
			</form>
			
			{(generalError != null) && (
				<Typography variant="caption" color='error' role='alert'>{generalError}</Typography>
			)}
			{success && (
				<Box>
					<Typography variant='h5' component="h2" gutterBottom>
					Account created successfully!
					</Typography>

					<Button color="inherit" component={RouterLink} to="/login" disableRipple >Go to login</Button>
				</Box>
			)}
		</Container>
	);
}