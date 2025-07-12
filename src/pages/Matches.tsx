import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

interface Match {
  spotify_id: string;
  display_name: string;
  profile_image: string;
  similarity: number;
  shared_artists: string[];
  top_artists: string[];
}

const Matches = () => {
  const navigate = useNavigate();
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const BACKEND_URL =
    import.meta.env.VITE_BACKEND_URL || "https://music-match-backend.onrender.com";

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

  useEffect(() => {
    const token = localStorage.getItem("jwt");

    if (!token) {
      setError("You are not logged in.");
      setLoading(false);
      return;
    }

    // 🆕 Save spotify_id locally
    const decoded = decodeJWT(token);
    if (decoded?.spotify_id) {
      localStorage.setItem("spotify_id", decoded.spotify_id);
    }

    const fetchMatches = async () => {
      try {
        const res = await axios.get(`${BACKEND_URL}/match-users`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setMatches(res.data.matches);
      } catch (err: any) {
        console.error("❌ Error fetching matches:", err);
        setError("Failed to fetch matches.");
      } finally {
        setLoading(false);
      }
    };

    fetchMatches();
  }, []);

  const handleStartChat = (match: Match) => {
    navigate(`/chat/${match.spotify_id}`, {
      state: {
        spotify_id: match.spotify_id,
        name: match.display_name,
        profile_image: match.profile_image,
        shared_artists: match.shared_artists,
      },
    });
  };

  if (loading) {
    return <p className="text-center mt-10 text-white">Loading your matches…</p>;
  }

  if (error) {
    return <p className="text-center mt-10 text-red-400">{error}</p>;
  }

  return (
    <div className="p-8 bg-black min-h-screen text-white">
      <h1 className="text-3xl font-bold mb-6 text-green-400 animate-pulse">
        🎧 Your Matches
      </h1>

      {matches.length === 0 ? (
        <p className="text-center text-gray-400">
          No matches found yet. Start listening to more music!
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {matches.map((match) => (
            <div
              key={match.spotify_id}
              className="bg-gray-900 p-4 rounded-lg shadow-lg hover:shadow-green-500/50 transition duration-300 ease-in-out transform hover:-translate-y-1"
            >
              <div className="flex items-center space-x-4">
                <img
                  src={match.profile_image || "/default-avatar.png"}
                  alt={match.display_name}
                  className="w-16 h-16 rounded-full border-2 border-green-400"
                />
                <div>
                  <h2 className="text-xl font-semibold">{match.display_name}</h2>
                  <p className="text-green-400">
                    Similarity Score: {match.similarity}
                  </p>
                </div>
              </div>

              {/* Shared Artists */}
              <div className="mt-4">
                <p className="text-gray-400 font-medium">🎵 Shared Artists:</p>
                {match.shared_artists && match.shared_artists.length > 0 ? (
                  <ul className="list-disc list-inside text-sm">
                    {match.shared_artists.map((artist, idx) => (
                      <li key={idx}>{artist}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-500 italic">No shared artists found.</p>
                )}
              </div>

              {/* Start Chat Button */}
              <button
                onClick={() => handleStartChat(match)}
                className="mt-4 w-full bg-green-500 text-black font-medium px-4 py-2 rounded hover:bg-green-400 hover:scale-105 transition duration-300 ease-in-out"
              >
                💬 Start Chat
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Matches;
