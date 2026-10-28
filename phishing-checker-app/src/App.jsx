import { Route, Routes } from 'react-router';

// Pages
import Home from './pages/Home.jsx'
import AboutUs from './pages/AboutUs.jsx'
import AboutTool from './pages/AboutTool.jsx'
import AboutPhishing from './pages/AboutPhishing.jsx'
import Help from './pages/Help.jsx'
import UrlChecker from './pages/UrlChecker.jsx'
import PageNotExist from './pages/error_pages/PageNotExist.jsx'
import UnexpectedFailure from './pages/error_pages/UnexpectedFailure.jsx'

// Components and layouts
import MainLayout from './layouts/MainLayout.jsx'

// General CSS
import './css/style.css'


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
				<Route path="/error-unexpected-failure" element={<UnexpectedFailure />} />
				<Route path="*" element={<PageNotExist />} />
			</Route>
		</Routes>
	);
}

export default App;