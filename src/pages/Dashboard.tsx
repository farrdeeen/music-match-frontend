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

  // ✅ Grab access_token from query string (from backend redirect)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const queryToken = params.get("access_token");

    if (queryToken) {
      setToken(queryToken);
      localStorage.setItem("spotify_token", queryToken);
      window.history.replaceState({}, document.title, "/dashboard"); // remove token from URL
    } else {
      const stored = localStorage.getItem("spotify_token");
      if (stored) setToken(stored);
    }
  }, []);

  // ✅ Fetch currently playing track
  useEffect(() => {
    if (!token) return;

    setLoading(true);
    axios
      .get<PlayerResponse>("https://api.spotify.com/v1/me/player", {
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
