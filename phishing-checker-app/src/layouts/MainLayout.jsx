import { Box, Container } from "@mui/material";
import { Outlet } from 'react-router';
import Navbar from "../components/Navbar";

function MainLayout({ themeMode, onToggleThemeMode }) {
	return (
		<Box sx={{
			minHeight: '100vh',
			display: 'flex',
			flexDirection: 'column'
		}}>
			<Navbar themeMode={themeMode} onToggleThemeMode={onToggleThemeMode}/>
			
			{/* Container for the main content */}
			<Container component='main' sx={{ flex: 1, py: 4 }}>
				{/* Tells node this is where to put the main page */}
				<Outlet />
			</Container>

		</Box>
	);
}

export default MainLayout;