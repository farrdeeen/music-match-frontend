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
      .get<PlayerResponse>("https://api.spotify.com/v1/me/player", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        console.log("Status:", res.status);
        console.log("Response:", res.data);
        if (res.data?.item) {
          setTrack(res.data.item);
        } else {
          console.log("No track currently playing.");
          setTrack(null);
        }
      })
      .catch((err) => {
        console.error("API Error:", err.response?.status, err.response?.data || err.message);
      });
  }, [token]);

  return (
    <div className="p-10">
      <h1 className="text-2xl font-bold mb-6">🎵 Now Playing</h1>
      {track ? (
        <div>
          <p className="text-xl">{track.name}</p>
          <p className="text-sm text-gray-500">
            by {track.artists.map((a) => a.name).join(", ")}
          </p>
          <img
            src={track.album.images[0]?.url}
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
