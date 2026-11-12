import { Route, Routes } from 'react-router';
import { lazy, Suspense } from 'react';
import { useEffect, useState } from 'react';
import { API_BASE_URL } from './services/api.js';
import axios from 'axios';

// Pages
const Home = lazy(() => import('./pages/Home.jsx'));
const AboutUs = lazy(() => import('./pages/AboutUs.jsx'));
const AboutTool = lazy(() => import('./pages/AboutTool.jsx'));
const AboutPhishing = lazy(() => import('./pages/AboutPhishing.jsx'));
const Help = lazy(() => import('./pages/Help.jsx'));
const UrlChecker = lazy(() => import('./pages/UrlChecker.jsx'));
const Login = lazy(() => import('./pages/Login.jsx'));
const Signup = lazy(() => import('./pages/Signup.jsx'));
import PageNotExist from './pages/error_pages/PageNotExist.jsx'
import UnexpectedFailure from './pages/error_pages/UnexpectedFailure.jsx'

// Components and layouts
import MainLayout from './layouts/MainLayout.jsx'

// General CSS
import './css/style.css'


async function checkLogin(){
    const response = await axios.get(
        `${API_BASE_URL}/user-data`,
        {withCredentials: true},
    )
    return response.data
} 

// Route the pages
function App({ themeMode, onToggleThemeMode, history, setHistory }) {
	const [loggedIn, setLoggedIn] = useState(false);
	const [user, setUser] = useState(String);
	
	useEffect(() => {
		async function loadUser() {
			try{
				const result = await checkLogin();
				setLoggedIn(result.logged_in)
				setUser(result.user?.username ?? null)
			} catch (requestError) {
				console.error(requestError);
				setLoggedIn(false)
			}
		}
		loadUser();
	}, [])

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
					<Route path="/url-checker" element={<UrlChecker user={user} loggedIn = {loggedIn} history={history} setHistory={setHistory} />} />
					<Route path="/login" element={<Login user={user} setUser={setUser} loggedIn = {loggedIn} setLoggedIn = {setLoggedIn}/>} />
					<Route path="/signup" element={<Signup user={user} loggedIn = {loggedIn}/>} />
					<Route path="/error-unexpected-failure" element={<UnexpectedFailure />} />
					<Route path="*" element={<PageNotExist />} />
				</Route>
			</Routes>
		</Suspense>
	);
}

export default App;