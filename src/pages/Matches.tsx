import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

interface Match {
  spotify_id: string;
  display_name: string;
  profile_image: string;
  similarity: number;
  top_artists: string[];
  shared_artists: string[];
}

const Matches = () => {
  const navigate = useNavigate();
  const [token, setToken] = useState<string | null>(null);
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const BACKEND_URL =
    import.meta.env.VITE_BACKEND_URL || "https://music-match-backend.onrender.com";

  useEffect(() => {
    const storedToken = localStorage.getItem("jwt");
    if (!storedToken) {
      setError("You are not logged in. Please log in first.");
      setLoading(false);
      return;
    }

    setToken(storedToken);

    const fetchMatches = async () => {
      try {
        const res = await axios.get(`${BACKEND_URL}/match-users`, {
          headers: { Authorization: `Bearer ${storedToken}` },
        });
        setMatches(res.data.matches);
        // Save matches locally for chat page lookup
        localStorage.setItem("matches", JSON.stringify(res.data.matches));
      } catch (err: any) {
        setError("Failed to fetch matches. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchMatches();
  }, []);

  if (loading) {
    return <p className="text-center mt-10 text-white">Loading your matches…</p>;
  }

  if (error) {
    return <p className="text-center mt-10 text-red-400">{error}</p>;
  }

  return (
    <div className="p-8 bg-black min-h-screen text-white">
      <h1 className="text-3xl font-bold mb-6 text-green-400">🎧 Your Music Matches</h1>

      {matches.length === 0 ? (
        <p>No matches found yet. Start listening to more music!</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {matches.map((match) => (
            <div
              key={match.spotify_id}
              className="bg-gray-900 p-4 rounded-lg shadow hover:shadow-xl transition duration-300"
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

              <div className="mt-4">
                <p className="text-gray-400 font-medium">Shared Artists:</p>
                <ul className="list-disc list-inside">
                  {match.shared_artists.map((artist, idx) => (
                    <li key={idx}>{artist}</li>
                  ))}
                </ul>
              </div>

              <button
                onClick={() => navigate(`/chat/${match.spotify_id}`)}
                className="mt-4 w-full bg-green-500 text-black px-4 py-2 rounded hover:bg-green-600 transition"
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
