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

async function fetchLogin(username, password){
	const response = await axios.post(
		`${API_BASE_URL}/log-in`,
		{username, password},
		{withCredentials: true},
	);
	return response.data
}

async function logout(){
	await axios.post(
		`${API_BASE_URL}/log-out`,
		{},
		{withCredentials: true},
	);
}

export default function Login({user, setUser, loggedIn, setLoggedIn}) {
	useEffect(() => {
		document.title = 'Login';
	}, []);

	const [success, setSuccess] = useState(false);
	const [generalError, setGeneralError] = useState(false);
	const [usernameError, setUsernameError] = useState(false);
	const [passwordError, setPasswordError] = useState(false);
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	
	const handleSubmit = async (event) => {
		event.preventDefault()
		setPasswordError(null)
		setUsernameError(null)
		setGeneralError(null)
		setSuccess(false)

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
			}

			setSuccess(result.success)
			setLoggedIn(result.success)
			if (result.success){
				setUser(username)
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

				console.error(error);
			}
	}

	const handleLogout = async () => {
		try {
			await logout()
			
			setLoggedIn(false)
			setUser(null)
			setSuccess(false)
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
				Login
			</Typography>

			{(!success && !loggedIn) && (
				<Paper className='page-section hero'>
					<form onSubmit={handleSubmit} className='login-signup-form'>
						<Box className="form-input">
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
						</Box>

						<Box className="form-input">
							<TextField
							label="Password"
							value={password}
							onChange={(event) => setPassword(event.target.value)}
							placeholder='Password'
							type="password"
							fullWidth
							/>
							{(passwordError != null) && (
							<Typography variant="caption" color='error' role='alert'>{passwordError}</Typography>
							)}
						</Box>
						
						<Button
						type='submit'
						variant='contained'
							size='large'
						className='glow-button'
						>
							Login
						</Button>
					</form>
					{(generalError != null) && (
						<Typography color='error' role='alert'>{generalError}</Typography>
					)}
				</Paper>
			)}
			
			{(success || loggedIn) && (
				<Paper className="login-signup-confirm paper-section hero">
					<Typography variant="h5" component="h2">
						Welcome {user}, you are logged in!
					</Typography>
					
					<Box className="login-next-buttons">
						<Button component={RouterLink} to="/url-checker" disableRipple >To Url Checker</Button>
						<Button onClick={handleLogout}>Log Out</Button>
					</Box>
				</Paper>
			)}
		</Container>
	);
}