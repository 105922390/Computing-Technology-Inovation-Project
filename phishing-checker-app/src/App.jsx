import { Route, Routes } from 'react-router';
import { lazy, Suspense } from 'react';

// Pages
const Home = lazy(() => import('./pages/Home.jsx'));
const AboutUs = lazy(() => import('./pages/AboutUs.jsx'));
const AboutTool = lazy(() => import('./pages/AboutTool.jsx'));
const AboutPhishing = lazy(() => import('./pages/AboutPhishing.jsx'));
const Help = lazy(() => import('./pages/Help.jsx'));
const UrlChecker = lazy(() => import('./pages/UrlChecker.jsx'));
import PageNotExist from './pages/error_pages/PageNotExist.jsx'
import UnexpectedFailure from './pages/error_pages/UnexpectedFailure.jsx'

// Components and layouts
import MainLayout from './layouts/MainLayout.jsx'

// General CSS
import './css/style.css'


// Route the pages
function App({ themeMode, onToggleThemeMode, history, setHistory }) {
	return (
		<Suspense fallback={<p>Loading page…</p>}>
			<Routes>
				{/* Wrap content in the main layout, containing navbar and footer */}
				<Route element={<MainLayout themeMode={themeMode} onToggleThemeMode={onToggleThemeMode} />}>
					<Route path="/" element={<Home />} />
					<Route path="/about" element={<AboutUs />} />
					<Route path="/about-the-tool" element={<AboutTool />} />
					<Route path="/about-phishing" element={<AboutPhishing />} />
					<Route path="/help" element={<Help />} />
					<Route path="/url-checker" element={<UrlChecker history={history} setHistory={setHistory} />} />
					<Route path="/error-unexpected-failure" element={<UnexpectedFailure />} />
					<Route path="*" element={<PageNotExist />} />
				</Route>
			</Routes>
		</Suspense>
	);
}

export default App;