import './App.css';
import { Navigate, Route, Routes, useNavigate } from 'react-router-dom';
import Home from './Components/Home/Home';
import About from './Components/About/About';
import GridGame from './Components/GridGame/GridGame';
import { createTheme, ThemeProvider } from '@mui/material';
import ScoreBoard from './Components/Common/ScoreBoard/ScoreBoard.tsx';
import AuthGuard from './Components/AuthGuard';
import Login from './Components/Auth/Login/Login.tsx';
import Signup from './Components/Auth/Signup/Signup.tsx';
import Header from './Components/Header/Header.tsx';
import { useEffect, useState } from 'react';
import { validateSession } from './utils/api/auth.ts';
import ConnectionsGame from './Components/ConnectionsGame/ConnectionsGame.tsx';

function App() {
	const theme = createTheme({
		components: {
			MuiTooltip: {
				styleOverrides: {
					tooltip: {
						fontSize: '1.2rem',
					},
				},
			},
		},
		typography: {
			fontFamily: 'Suii',
		},
	});

	const [isLoggedIn, setIsLoggedIn] = useState(false);
	const navigate = useNavigate();

	useEffect(() => {
		const checkSession = async () => {
			try {
				const token = localStorage.getItem('token');
				if (!token) {
					return;
				}

				const data = await validateSession();
				if (data.success) {
					setIsLoggedIn(true);
				}
			} catch (error) {
				console.error('Error validating session:', error);
			}
		};

		checkSession();
	}, [navigate]);

	return (
		<div>
			{isLoggedIn && <Header user={{ name: '' }} />}
			<div className='App'>
				<ThemeProvider theme={theme}>
					<Routes>
						<Route path='*' element={<Navigate to='/login' replace={true} />} />
						<Route path='/' element={<Home />} />
						<Route path='/about' element={<About />} />
						<Route path='/grid' element={<GridGame />} />
						<Route path='/connections' element={<ConnectionsGame />} />
						<Route path='/grid/scoreboard' element={<ScoreBoard />} />
						<Route path='/connections/scoreboard' element={<ScoreBoard />} />
						<Route path='/login' element={<Login />} />
						<Route path='/signup' element={<Signup />} />
					</Routes>
				</ThemeProvider>
			</div>
		</div>
	);
}

export default App;
