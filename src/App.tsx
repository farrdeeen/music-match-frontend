import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SpotifyLogin from "./components/SpotifyLogin";
import Dashboard from "./pages/Dashboard";
import Matches from "./pages/Matches";


function App() {
  return (
    
    <Router>
      <Routes>
        <Route path="/" element={<SpotifyLogin />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/matches" element={<Matches />} />
      </Routes>
    </Router>
  );
}
console.log("📡 App rendered");
export default App;
