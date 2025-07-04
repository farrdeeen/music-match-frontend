import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SpotifyLogin from "./components/SpotifyLogin";
import Dashboard from "./pages/Dashboard";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<SpotifyLogin />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </Router>
  );
}

export default App;
