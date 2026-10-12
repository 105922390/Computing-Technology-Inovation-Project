import { useMemo, useState } from "react";
import { BrowserRouter } from "react-router";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import App from "./App.jsx";

function Root() {
	const [themeMode, setThemeMode] = useState("light");

	const theme = useMemo(() => createTheme({ palette: { mode: themeMode } }), [themeMode]);

	const toggleThemeMode = () => {
		setThemeMode((current) => (current === "light" ? "dark" : "light"));
	};

	return (
		<ThemeProvider theme={theme}>
			<CssBaseline />
			<BrowserRouter>
				<App themeMode={themeMode} onToggleThemeMode={toggleThemeMode} />
			</BrowserRouter>
		</ThemeProvider>
	);
}

export default Root;
