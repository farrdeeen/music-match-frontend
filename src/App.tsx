import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import SpotifyLogin from "./components/SpotifyLogin";
import Dashboard from "./pages/Dashboard";
import Matches from "./pages/Matches";

function App() {
  return (
    <Router>
      <nav className="bg-gray-900 p-4 text-white flex space-x-4">
        <Link to="/dashboard">Dashboard</Link>
        <Link to="/matches">Matches</Link>
      </nav>
      <Routes>
        <Route path="/" element={<SpotifyLogin />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </Router>
  );
}

export default App;
