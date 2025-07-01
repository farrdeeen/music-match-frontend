import { useEffect, useState } from "react";
import axios from "axios";

interface Artist {
  name: string;
}

interface Album {
  images: { url: string }[];
}

interface TrackItem {
  name: string;
  artists: Artist[];
  album: Album;
}

interface PlayerResponse {
  item?: TrackItem;
}

const Dashboard = () => {
  const [token, setToken] = useState<string | null>(null);
  const [track, setTrack] = useState<TrackItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Extract token from query string or local storage
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const _token = params.get("access_token");

    if (_token) {
      setToken(_token);
      localStorage.setItem("spotify_token", _token);
      window.history.replaceState({}, document.title, "/dashboard"); // clean up URL
    } else {
      const stored = localStorage.getItem("spotify_token");
      if (stored) setToken(stored);
    }
  }, []);

  // Fetch current playing track
  useEffect(() => {
    if (!token) return;

    setLoading(true);
    axios
      .get<PlayerResponse>("https://api.spotify.com/v1/me/player", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        if (res.data?.item) {
          setTrack(res.data.item);
        } else {
          setTrack(null);
        }
      })
      .catch((err) => {
        const status = err.response?.status;
        if (status === 401) {
          setError("Invalid or expired token. Please log in again.");
          localStorage.removeItem("spotify_token");
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
      {error && <p className="text-red-400">{error}</p>}

      {!loading && !error && track ? (
        <div>
          <p className="text-xl">{track.name}</p>
          <p className="text-sm text-gray-400">
            by {track.artists.map((a) => a.name).join(", ")}
          </p>
          <img
            src={track.album.images[0]?.url}
            alt="Album Cover"
            className="mt-4 w-64 rounded-lg"
          />
        </div>
      ) : (
        !loading &&
        !error && (
          <p>No song is currently playing on your Spotify account.</p>
        )
      )}
    </div>
  );
};

export default Dashboard;
