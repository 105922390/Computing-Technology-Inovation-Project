import { useMemo, useState } from "react";
import { BrowserRouter } from "react-router";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import App from "./App.jsx";

// import 'package:google_fonts/google_fonts.dart';

function Root() {
	const [themeMode, setThemeMode] = useState("light");
    const isDarkMode = themeMode === "dark";

    const theme = useMemo(() => createTheme({
        palette: {
            mode: themeMode,
            primary: {
				main: isDarkMode ? "#3aa2c4" : "#3aa2c4",
				light: isDarkMode ? "#446a76" : "#90d9f2",
                dark: isDarkMode ? "#287994" : "#287994",
                contrastText: "#ffffff",
            },
            secondary: {
                main: isDarkMode ? "#68d5c2" : "#148a79",
            },
            background: {
                default: isDarkMode ? "#101522" : "#ededed",
                paper: isDarkMode ? "#191f30" : "#ffffff",
            },
            text: {
                primary: isDarkMode ? "#f2f3fa" : "#1d2433",
                secondary: isDarkMode ? "#b0b8ca" : "#626d80",
            },
			divider: isDarkMode ? "rgba(255,255,255,0.12)" : "#c8cedb",
			chart: {
				positive: isDarkMode ? "#68d589" : "#4dd34f",
				negative: isDarkMode ? "#ff8c91" : "#c23c4b",
				baseline: isDarkMode ? "#b0b8ca" : "#626d80",
			},
			confidenceRing: {
				safe: {
					ring: isDarkMode ? '#68d589' : '#4dd34f',
					text: isDarkMode ? '#9ceba1' : '#0e622e',
				},
				caution: {
					ring: isDarkMode ? '#ffd078' : '#d99500',
					text: isDarkMode ? '#ffe0a3' : '#805500',
				},
				unsafe: {
					ring: isDarkMode ? '#ff8c91' : '#c23c4b',
					text: isDarkMode ? '#ffb8bb' : '#922d3a',
				},
				trackColour : isDarkMode ? '#30394c' : '#cbcbcb',
			}
        },
        typography: {
            fontFamily: [
                "Figtree",
                "Arial",
            ].join(","),
            h1: {
                fontWeight: 800,
                fontSize: "2.75rem",
                lineHeight: 1.08,
                letterSpacing: "-0.04em",
                "@media (min-width:600px)": {
                    fontSize: "4.25rem",
                },
            },
            h2: {
				fontWeight: 700,
                fontSize: '2rem',
                '@media (min-width:600px)': {
                    fontSize: '4rem',
				},
				textAlign: "center"
               
            },
            h3: {
				fontWeight: 700,
				letterSpacing: "-0.025em",
            },
            h4: {
				fontWeight: 700,
				letterSpacing: "-0.02em",
            },
            button: {
				fontWeight: 700,
				textTransform: "none",
            },
        },
        
        components: {
            MuiCssBaseline: {
				styleOverrides: {
				    body: {
				        minHeight: "100vh",
				    },
				    h1: {
				        textAlign: "center",
				    },
				    ".url-checker-page": {
				        paddingTop: "1rem",
						paddingBottom: "3rem",
						// gap: "10rem",
				    },
				    ".url-checker-hero": {
				        maxWidth: 780,
				        margin: "0 auto 0rem",
				        padding: "clamp(1.25rem, 4vw, 2.5rem)",
				        border: `1px solid ${isDarkMode ? "rgba(255,255,255,0.12)" : "#e4e8f0"}`,
				        borderRadius: "20px",
				        boxShadow: isDarkMode
				            ? "0 20px 60px rgba(0,0,0,0.24)"
				            : "0 20px 60px rgba(31,42,71,0.08)",
				    },
				    ".url-checker-subtitle": {
				        textAlign: "center",
				        color: isDarkMode ? "#b0b8ca" : "#626d80",
				        marginBottom: "1.5rem",
				    },
				    ".url-checker-form": {
				        display: "flex",
				        alignItems: "stretch",
				        gap: "0.75rem",
				        "& .MuiTextField-root": {
				            flex: 1,
				        },
				        "& .MuiButton-root": {
				            minWidth: 140,
				            borderRadius: "12px",
				        },
				        "@media (max-width: 600px)": {
				            flexDirection: "column",
				            "& .MuiButton-root": {
				                minHeight: 52,
				            },
				        },
				    },
				    ".url-checker-feedback": {
				        marginTop: "1rem",
				        textAlign: "center",
				    },
				    ".url-checker-result": {
				        maxWidth: 960,
				        margin: "0 auto",
				        padding: "clamp(1.25rem, 4vw, 2.5rem)",
				        alignItems: "stretch",
				        gap: "1.5rem",
				        border: `1px solid ${isDarkMode ? "rgba(255,255,255,0.12)" : "#e4e8f0"}`,
				        borderRadius: "20px",
				        boxShadow: isDarkMode
				            ? "0 20px 60px rgba(0,0,0,0.2)"
				            : "0 20px 60px rgba(31,42,71,0.06)",
				    },
				    ".url-checker-status": {
				        marginBottom: 0,
				        textAlign: "center",
				    },
				    ".url-checker-confidence": {
				        position: "relative",
				        width: 260,
				        height: 260,
				        maxWidth: "100%",
				        margin: "0 auto",
				    },
				    ".url-checker-confidence-chart": {
				        width: "100%",
				        height: "100%",
				    },
				    ".url-checker-confidence-label": {
				        position: "absolute",
				        inset: 0,
				        display: "flex",
				        flexDirection: "column",
				        alignItems: "center",
				        justifyContent: "center",
				        textAlign: "center",
				        pointerEvents: "none",
				    },
				    ".url-checker-confidence-status": {
				        fontWeight: 700,
				        lineHeight: 1.15,
				        marginBottom: "0.35rem",
				    },
				    ".url-checker-confidence-value": {
				        fontWeight: 800,
				        lineHeight: 1,
				        letterSpacing: "-0.04em",
				    },
				    ".url-checker-confidence-caption": {
				        marginTop: "0.4rem",
				        color: isDarkMode ? "#b0b8ca" : "#626d80",
				    },
				    ".url-checker-risk-metric": {
				        maxWidth: 340,
				        width: "100%",
				        margin: "0 auto",
				    },
				    ".url-checker-status--safe": {
				        color: isDarkMode ? "#68d5c2" : "#148a79",
				    },
				    ".url-checker-status--caution": {
				        color: isDarkMode ? "#ffd078" : "#a96800",
				    },
				    ".url-checker-status--unsafe": {
				        color: isDarkMode ? "#ff8c91" : "#c23c4b",
				    },
				    ".url-checker-metrics": {
				        display: "grid",
				        gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
				        gap: "1rem",
				        maxWidth: 640,
				        width: "100%",
				        margin: "0 auto",
				        "@media (max-width: 520px)": {
				            gridTemplateColumns: "1fr",
				        },
				    },
				    ".url-checker-metric": {
				        minWidth: 0,
				        padding: "1.25rem",
				        textAlign: "center",
				        borderRadius: "14px",
				        backgroundColor: isDarkMode ? "rgba(255,255,255,0.045)" : "#f4f6fb",
				    },
				    ".url-checker-metric-value": {
				        fontWeight: 800,
				        lineHeight: 1.1,
				        color: isDarkMode ? "#f2f3fa" : "#1d2433",
				    },
				    ".url-checker-metric-label": {
				        marginTop: "0.4rem",
				        color: isDarkMode ? "#b0b8ca" : "#626d80",
				    },
				    ".url-checker-chart": {
				        width: "100%",
				        overflowX: "auto",
				    },
				    ".url-checker-chart > *": {
				        minWidth: 560,
				        margin: "0 auto",
				    },
				    ".MuiPaper-root": {
				        backgroundImage: "none",
					},
					".home-what-is-phishing": {
						border: "2px solid",
						
						borderRadius: "14px",
						padding: "24px",
					}
					
				},
            },
            MuiPaper: {
				styleOverrides: {
				    root: {
				        border: `1px solid ${isDarkMode ? "rgba(255,255,255,0.12)" : "#dcdfe6"}`,
				        boxShadow: isDarkMode
				            ? "0 8px 24px rgba(0,0,0,0.16)"
							: "0 8px 24px rgba(31,42,71,0.05)",
						// boxShadow: "1px 1px 5px 0px grey",
						borderRadius: 14,
						
				    },
				},
            },
            MuiAppBar: {
				styleOverrides: {
				    root: ({theme}) => ({
				        color: isDarkMode ? "#f2f3fa" : "#1d2433",
				        backgroundColor: theme.palette.primary.light,
				        backgroundImage: "none",
				        boxShadow: "none",
						borderBottom: `1px solid ${isDarkMode ? "rgba(255,255,255,0.12)" : "#c0d1d7"}`,
						borderRadius: 0,
				    }),
				},
            },
            MuiToolbar: {
				styleOverrides: {
				    root: {
				        minHeight: 72,
				        gap: "0.25rem",
				        "@media (max-width: 600px)": {
				            flexWrap: "wrap",
				            justifyContent: "center",
				            paddingTop: "0.5rem",
				            paddingBottom: "0.5rem",
				            "& > .MuiBox-root:first-of-type": {
				                flexBasis: "100%",
				                flexGrow: 0,
				                textAlign: "center",
				                marginBottom: "0.25rem",
				            },
				        },
				    },
				},
            },
            MuiButton: {
				styleOverrides: {
					root: ({ theme }) => ( {
				        borderRadius: 10,
				        padding: "0.65rem 1.1rem",
				        transition: "transform 160ms ease, box-shadow 160ms ease",
				        "&:hover": {
				            transform: "translateY(-1px)",
						},
						"&.glow-button": {
							"&:hover": {
								boxShadow: `0px 0px 10px 10px rgb(188, 222, 250)`,
								background: theme.palette.primary.main,
							},
						},
				    }),
				    contained: {
				        boxShadow: isDarkMode
				            ? "0 8px 24px #00000048"
							: "0 8px 24px #1f2a4720",
						// boxShadow: "none",
				        "&:hover": {
				            boxShadow: "none",
				        },
					},
					
				},
            },
            MuiOutlinedInput: {
				styleOverrides: {
				    root: {
				        borderRadius: 12,
				        backgroundColor: isDarkMode ? "#141a28" : "#ffffff",
				    },
				},
            },
        },
    })
        , [isDarkMode, themeMode]
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
