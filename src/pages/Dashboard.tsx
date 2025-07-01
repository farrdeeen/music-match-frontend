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

interface CurrentlyPlayingResponse {
  item: TrackItem;
}

const Dashboard = () => {
  const [token, setToken] = useState<string | null>(null);
  const [track, setTrack] = useState<CurrentlyPlayingResponse | null>(null);

  useEffect(() => {
    const hash = window.location.hash;
    const _token = hash
      .split("&")
      .find((el) => el.startsWith("#access_token"))
      ?.split("=")[1];

    if (_token) {
      setToken(_token);
      window.localStorage.setItem("spotify_token", _token);
      window.location.hash = "";
    } else {
      const stored = window.localStorage.getItem("spotify_token");
      if (stored) setToken(stored);
    }
  }, []);

  useEffect(() => {
    if (!token) return;

    axios
      .get("https://api.spotify.com/v1/me/player/currently-playing", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        console.log("Spotify API Response:", res.data);
        setTrack(res.data);
      })
      .catch((err) => {
        console.error("Error fetching track:", err.response?.data || err.message);
      });
  }, [token]);

  return (
    <div className="p-10">
      <h1 className="text-2xl font-bold mb-6">🎵 Now Playing</h1>
      {track?.item ? (
        <div>
          <p className="text-xl">{track.item.name}</p>
          <p className="text-sm text-gray-500">
            by {track.item.artists.map((a) => a.name).join(", ")}
          </p>
          <img
            src={track.item.album.images[0]?.url}
            className="mt-4 w-64"
            alt="Album Cover"
          />
        </div>
      ) : (
        <p>No song is currently playing on your Spotify account.</p>
      )}
    </div>
  );
};

export default Dashboard;
