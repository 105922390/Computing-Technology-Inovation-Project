import { Route, Routes } from 'react-router';

// Pages
import Home from './pages/Home.jsx'
import AboutUs from './pages/AboutUs.jsx'
import AboutTool from './pages/AboutTool.jsx'
import AboutPhishing from './pages/AboutPhishing.jsx'
import Help from './pages/Help.jsx'
import UrlChecker from './pages/UrlChecker.jsx'

// Components and layouts
import MainLayout from './layouts/MainLayout.jsx'


// Route the pages
function App({ themeMode, onToggleThemeMode }) {
	return (
		<Routes>
			{/* Wrap content in the main layout, containing navbar and footer */}
			<Route element={<MainLayout themeMode={themeMode} onToggleThemeMode={onToggleThemeMode} />}>
				<Route path="/" element={<Home />} />
				<Route path="/about" element={<AboutUs />} />
				<Route path="/about-the-tool" element={<AboutTool />} />
				<Route path="/about-phishing" element={<AboutPhishing />} />
				<Route path="/help" element={<Help />} />
				<Route path="/url-checker" element={<UrlChecker />} />
			</Route>
		</Routes>
	);
}

export default App;