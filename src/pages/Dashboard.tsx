import { useEffect, useState } from "react";
import axios from "axios";

interface Track {
  name: string;
  artists: { name: string }[];
  album: { images: { url: string }[] };
}

const Dashboard = () => {
  const [token, setToken] = useState<string | null>(null);
  const [track, setTrack] = useState<Track | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const BACKEND_URL = "https://music-match-backend.onrender.com"; // Update if needed

  // Grab JWT token from URL or localStorage
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const jwtToken = params.get("token");

    if (jwtToken) {
      setToken(jwtToken);
      localStorage.setItem("jwt", jwtToken);
      window.history.replaceState({}, document.title, "/dashboard"); // Clean URL
    } else {
      const storedToken = localStorage.getItem("jwt");
      if (storedToken) setToken(storedToken);
    }
  }, []);

  // Fetch current track from your backend
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
        if (err.response?.status === 401) {
          setError("Session expired. Please log in again.");
          localStorage.removeItem("jwt");
        } else {
          setError("Failed to fetch track info.");
        }
      })
      .finally(() => setLoading(false));
  }, [token]);

  return (
    <div className="p-10 text-white bg-black min-h-screen">
      <h1 className="text-2xl font-bold mb-6">🎵 Now Playing</h1>

      {loading && <p>Loading...</p>}

      {error && (
        <div>
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
        <div>
          <p className="text-xl">{track.name}</p>
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
    </div>
  );
};

export default Dashboard;
