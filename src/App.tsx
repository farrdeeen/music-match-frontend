import { HashRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import SpotifyLogin from "./components/SpotifyLogin";
import Dashboard from "./pages/Dashboard";
import Matches from "./pages/Matches";

function App() {
  console.log("📡 App rendered");

  return (
    <Router>
      <Routes>
        <Route path="/" element={<SpotifyLogin />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/matches" element={<Matches />} />
        {/* Catch-all to redirect any unknown route */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
