import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

interface Track {
  name: string;
  artists: { name: string }[];
  album: { images: { url: string }[] };
}

const Dashboard = () => {
  const navigate = useNavigate();
  const [token, setToken] = useState<string | null>(null);
  const [track, setTrack] = useState<Track | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const BACKEND_URL = "https://music-match-backend.onrender.com"; // Update if needed

  // 🔥 Decode JWT manually
  const decodeJWT = (token: string) => {
    try {
      const base64Url = token.split(".")[1];
      const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split("")
          .map((c) => `%${("00" + c.charCodeAt(0).toString(16)).slice(-2)}`)
          .join("")
      );
      return JSON.parse(jsonPayload);
    } catch (err) {
      console.error("❌ Failed to decode JWT", err);
      return null;
    }
  };

  // Grab JWT token from URL or localStorage
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const jwtToken = params.get("token");

    if (jwtToken) {
      setToken(jwtToken);
      localStorage.setItem("jwt", jwtToken);

      // 🆕 Save spotify_id
      const decoded = decodeJWT(jwtToken);
      if (decoded?.spotify_id) {
        localStorage.setItem("spotify_id", decoded.spotify_id);
      }

      window.history.replaceState({}, document.title, "/dashboard"); // Clean URL
    } else {
      const storedToken = localStorage.getItem("jwt");
      if (storedToken) setToken(storedToken);
    }
  }, []);

  // Fetch current track from backend
  useEffect(() => {
    if (!token) return;

    setLoading(true);
    axios
      .get(`${BACKEND_URL}/current-track`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        if (res.data?.item) {
          setTrack(res.data.item);
        } else {
          setTrack(null);
        }
      })
      .catch((err) => {
        console.error("❌ Failed to fetch current track:", err);
        if (err.response?.status === 401) {
          setError("Session expired. Please log in again.");
          localStorage.removeItem("jwt");
        } else {
          setError("Failed to fetch track info.");
        }
      })
      .finally(() => setLoading(false));
  }, [token]);

  const handleViewMatches = () => {
    navigate("/matches");
  };

  return (
    <div className="p-10 text-white bg-black min-h-screen">
      <h1 className="text-3xl font-bold text-green-400 mb-6">🎵 Now Playing</h1>

      {loading && <p className="text-gray-300">Loading...</p>}

      {error && (
        <div className="mb-4">
          <p className="text-red-400 mb-4">{error}</p>
          <a
            href="/"
            className="bg-green-500 px-4 py-2 rounded hover:bg-green-600 transition"
          >
            Login Again
          </a>
        </div>
      )}

      {!loading && !error && track ? (
        <div className="mb-6">
          <p className="text-xl font-semibold">{track.name}</p>
          <p className="text-sm text-gray-400">
            by {track.artists.map((a) => a.name).join(", ")}
          </p>
          {track.album.images[0] && (
            <img
              src={track.album.images[0].url}
              alt="Album cover"
              className="mt-4 w-64 rounded-lg"
            />
          )}
        </div>
      ) : (
        !loading &&
        !error && <p>No track is currently playing.</p>
      )}

      {/* 🎧 Button to navigate to Matches */}
      <button
        onClick={handleViewMatches}
        className="mt-6 px-5 py-3 bg-green-500 hover:bg-green-600 text-white rounded-lg transition"
      >
        View Your Matches 🎧
      </button>
    </div>
  );
};

export default Dashboard;
