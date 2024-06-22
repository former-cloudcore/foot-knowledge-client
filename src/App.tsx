import './App.css';
import {BrowserRouter, Routes, Route, Navigate} from 'react-router-dom';
import Home from './Components/Home/Home';
import About from './Components/About/About';
import GridGame from './Components/GridGame/GridGame';
import { ThemeProvider, createTheme } from '@mui/material';
import ScoreBoard from './Components/ScoreBoard/ScoreBoard';
import AuthGuard from './Components/AuthGuard';
import Login from "./Components/Auth/Login/Login.tsx";
import Signup from "./Components/Auth/Signup/Signup.tsx";

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

  return (
      <div className="App">
        <ThemeProvider theme={theme}>
          <BrowserRouter>
            <Routes>
              <Route
                  path="*"
                  element={<Navigate to="/login" replace={true} />}
              />
              <Route path="/" element={<AuthGuard><Home /></AuthGuard>} />
              <Route path="/about" element={<AuthGuard><About /></AuthGuard>} />
              <Route path="/grid" element={<AuthGuard><GridGame /></AuthGuard>} />
              <Route path="/grid/scoreboard" element={<AuthGuard><ScoreBoard /></AuthGuard>} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
            </Routes>
          </BrowserRouter>
        </ThemeProvider>
      </div>
  );
}

export default App;
