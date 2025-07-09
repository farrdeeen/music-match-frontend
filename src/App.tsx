import { Routes, Route } from "react-router-dom";
import SpotifyLogin from "./components/SpotifyLogin";
import Dashboard from "./pages/Dashboard";
import Matches from "./pages/Matches";

function App() {
  console.log("📡 App rendered");

  return (
    <Routes>
      <Route path="/" element={<SpotifyLogin />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/matches" element={<Matches />} />
    </Routes>
  );
}

export default App;
