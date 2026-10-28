import { useMemo, useState } from "react";
import { BrowserRouter } from "react-router";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import App from "./App.jsx";

// import 'package:google_fonts/google_fonts.dart';

function Root() {
	const [themeMode, setThemeMode] = useState("light");

    const theme = useMemo(() => createTheme({
        palette: {
            // primary: {
                // main: "#ff0000"
            // },
            // secondary: {
            //     main: "#0080ff"
            // },


            mode: themeMode
        },
        typography: {
            fontFamily: [
                "Figtree",
                "Arial",
                
            ].join(","),
            h1: {
                fontWeight: 700,
                fontSize: '2rem',
                '@media (min-width:600px)': {
                    fontSize: '4rem',
                },
               
            },
        }
    })
        , [themeMode]
    );

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
