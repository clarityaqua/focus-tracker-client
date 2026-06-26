import { BrowserRouter, Routes, Route, NavLink } from 'react-router';
import Timer from './pages/Timer';
import History from './pages/History';
import Dashboard from './pages/Dashboard';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <nav>
        <div className="nav-logo">Focus Timer</div>
        <NavLink to="/" end>Timer</NavLink>
        <NavLink to="/history">History</NavLink>
        <NavLink to="/dashboard">Dashboard</NavLink>
      </nav>
      <Routes>
        <Route path="/" element={<Timer />} />
        <Route path="/history" element={<History />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;