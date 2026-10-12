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

				<Box sx={{ flexGrow: 1 }}>
					<Typography variant='h5' component={RouterLink} to="/" underline="hover"
						sx={{
							color: "inherit",
							textDecoration: "none"
						}}
					>
						Site Name
					</Typography>
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
				<LearnMenu />
				<Button color="inherit" component={RouterLink} to="/about" disableRipple >About Us</Button>
				<Button color="inherit" component={RouterLink} to="/help" disableRipple >Help</Button>

			</Toolbar>
		</AppBar>
	);
}

export default Navbar;