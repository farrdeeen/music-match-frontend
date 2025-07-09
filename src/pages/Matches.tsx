import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

interface Match {
  spotify_id: string;
  display_name: string;
  profile_image: string;
  similarity: number;
  top_artists: string[];
}

const Matches = () => {
  const navigate = useNavigate();
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const BACKEND_URL = "https://music-match-backend.onrender.com"; // Update to your backend URL

  useEffect(() => {
    const fetchMatches = async () => {
      const jwtToken = localStorage.getItem("jwt");

      if (!jwtToken) {
        setError("You are not logged in. Please log in first.");
        setLoading(false);
        return;
      }

      try {
        console.log("📡 Fetching matches from backend...");
        const res = await axios.get(`${BACKEND_URL}/match-users`, {
          headers: { Authorization: `Bearer ${jwtToken}` },
        });
        console.log("✅ Matches response:", res.data);
        setMatches(res.data.matches);
      } catch (err: any) {
        console.error("❌ Failed to fetch matches:", err);
        setError("Failed to load matches. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchMatches();
  }, []);

  if (loading) return <p className="text-center text-white mt-10">Loading matches…</p>;

  if (error)
    return (
      <div className="text-center text-red-400 mt-10">
        <p>{error}</p>
        <button
          onClick={() => navigate("/")}
          className="mt-4 bg-green-500 px-4 py-2 rounded hover:bg-green-600"
        >
          🔑 Go to Login
        </button>
      </div>
    );

  return (
    <div className="p-8 bg-black min-h-screen text-white">
      <h1 className="text-3xl font-bold mb-6 text-green-400">🎧 Your Music Matches</h1>
      {matches.length === 0 ? (
        <p>No matches found yet. Listen to more music to find users with similar taste!</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {matches.map((match) => (
            <div
              key={match.spotify_id}
              className="bg-gray-800 p-4 rounded-lg shadow hover:shadow-xl transition duration-300"
            >
              <div className="flex items-center space-x-4">
                <img
                  src={match.profile_image || "/default-avatar.png"}
                  alt={match.display_name}
                  className="w-16 h-16 rounded-full border-2 border-green-400"
                />
                <div>
                  <h2 className="text-xl font-semibold">{match.display_name}</h2>
                  <p className="text-green-400">Similarity: {match.similarity}</p>
                </div>
              </div>
              <div className="mt-4">
                <p className="text-gray-400 font-medium">Top Artists:</p>
                <ul className="list-disc list-inside">
                  {match.top_artists.map((artist, idx) => (
                    <li key={idx}>{artist}</li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      )}
      <button
        onClick={() => navigate("/dashboard")}
        className="mt-8 bg-green-500 px-4 py-2 rounded hover:bg-green-600 transition"
      >
        ⬅️ Back to Dashboard
      </button>
    </div>
  );
};

export default Matches;
