import {
	Typography, Container,
	TextField,
	Button,
	Box,
	Paper
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

export default function Signup({user, loggedIn}) {
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

		try {
			const available = await checkUsername(username)
			if (!available) {
				setUsernameError("Username unavailable. Try another.")
				return
			}

			const result = await createUser(username, password)
			console.log(result)
			if (!result){
				setGeneralError("Issue creating account.")
				setSuccess(false)
			} else {
				setSuccess(true)
			}
		} catch (error) {
			const status = error.response?.status

			if (status === 503) {
				setGeneralError('Too many requests! Please wait before trying again.');
			} else if (status == null) {
				setGeneralError('Unable to reach the server. Please try again.');
			} else {
				setGeneralError(
					'Something went wrong. Please try again. | Error code: ' + status
				);
			}
			console.error(error)
		}
	}

	const checkUsernameAvailable = async (username) => {
		try{
			const isAvailable = await checkUsername(username)
			return isAvailable
		} catch (error) {
			const status = error.response?.status

			if (status === 503) {
				setGeneralError('Too many requests! Please wait before trying again.');
			} else if (status == null) {
				setGeneralError('Unable to reach the server. Please try again.');
			} else {
				setGeneralError(
					'Something went wrong. Please try again. | Error code: ' + status
				);
			}
			console.error(error);
		}
	}

	return (
		<Container>
			<Typography variant='h2' component='h1' gutterBottom>
				Sign Up
			</Typography>

			<Paper className='url-checker-hero'>
				{(!loggedIn) && (
					<Typography variant='p' component="p" gutterBottom>
						Don't like Phish? Create an account with PhishGuard!
					</Typography>
				)}

				<form onSubmit={handleSubmit} className='login-signup-form'>
					<box className="form-input">
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
					</box>

					<box className="form-input">
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
					</box>

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
				<box className="login-signup-confirm">
					{(success) && (
						<Box>
							<Typography color='primary' variant='subtitle1' component="h2">
							Account created successfully!
							</Typography>

							<Button color="inherit" component={RouterLink} to="/login" disableRipple >Go to login</Button>
						</Box>
					)}
					{(loggedIn && !success) && (
						<Typography color='textSecondary' variant='p' component="p">
							Note: you are currently logged in as: "{user}", are you sure you want to make another account?
						</Typography>
					)}
				</box>
			</Paper>
		</Container>
	);
}