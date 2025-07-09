import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

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

  useEffect(() => {
    console.log("🎨 Matches page loaded");

    // For now, use dummy data
    setMatches([
      {
        spotify_id: "1",
        display_name: "Alice",
        profile_image: "https://i.pravatar.cc/150?img=1",
        similarity: 75,
        top_artists: ["Drake", "Taylor Swift", "Kanye West"],
      },
      {
        spotify_id: "2",
        display_name: "Bob",
        profile_image: "https://i.pravatar.cc/150?img=2",
        similarity: 65,
        top_artists: ["Eminem", "The Weeknd", "Adele"],
      },
    ]);
    setLoading(false);
  }, []);

  if (loading) return <p className="text-center text-white mt-10">Loading matches…</p>;

  return (
    <div className="p-8 bg-black min-h-screen text-white">
      <h1 className="text-3xl font-bold mb-6 text-green-400">🎧 Your Music Matches</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {matches.map((match) => (
          <div
            key={match.spotify_id}
            className="bg-gray-800 p-4 rounded-lg shadow hover:shadow-xl transition duration-300"
          >
            <div className="flex items-center space-x-4">
              <img
                src={match.profile_image}
                alt={match.display_name}
                className="w-16 h-16 rounded-full border-2 border-green-400"
              />
              <div>
                <h2 className="text-xl font-semibold">{match.display_name}</h2>
                <p className="text-green-400">Similarity: {match.similarity}%</p>
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
