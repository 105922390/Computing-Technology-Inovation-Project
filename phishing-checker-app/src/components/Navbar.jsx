import { AppBar, Box, Button, IconButton, Toolbar, Tooltip, Typography } from '@mui/material';
import {
	DarkMode,
	LightMode
} from '@mui/icons-material'

import { Link as RouterLink } from 'react-router';


import LearnMenu from './LearnMenu.jsx'

function Navbar({ themeMode, onToggleThemeMode }) {
	return (
		<AppBar position='static'>
			<Toolbar>

				<Box
					component={RouterLink}
					to="/"
					sx={{
						display: "flex",
						alignItems: "center",
						gap: 1,
						flexGrow: 1,
						color: "inherit",
						textDecoration: "none",
					}}
					>
						<Box component="img" src="./logo.svg" alt="" sx={{ width: 32, height: 32 }} />
						<Typography variant="h5">PhishGuard</Typography>
				</Box>

				<Tooltip title={themeMode === "light" ? "Switch to dark mode" : "Switch to light mode"} >

					<IconButton
						onClick={onToggleThemeMode}
						color='inherit'
						aria-label='Toggle light and dark mode'
					>
						{themeMode === "light" ? <DarkMode /> : <LightMode />}
					</IconButton>

				</Tooltip>

				<Button color="inherit" component={RouterLink} to="/url-checker" disableRipple >URL Checker</Button>
				<Button color="inherit" component={RouterLink} to="/login" disableRipple >Login</Button>
				<Button color="inherit" component={RouterLink} to="/signup" disableRipple >Sign Up</Button>
				<LearnMenu />
				<Button color="inherit" component={RouterLink} to="/about" disableRipple >About Us</Button>
				<Button color="inherit" component={RouterLink} to="/help" disableRipple >Help</Button>

			</Toolbar>
		</AppBar>
	);
}

export default Navbar;