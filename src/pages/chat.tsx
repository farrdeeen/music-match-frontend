import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

const Chat = () => {
  const { matchId } = useParams<{ matchId: string }>();
  const navigate = useNavigate();
  const [matchName, setMatchName] = useState<string>("");

  useEffect(() => {
    // Retrieve match details from localStorage or fetch from backend later
    const savedMatches = JSON.parse(localStorage.getItem("matches") || "[]");
    const match = savedMatches.find((m: any) => m.spotify_id === matchId);
    if (match) {
      setMatchName(match.display_name);
    } else {
      setMatchName("Unknown User");
    }
  }, [matchId]);

  const handleBack = () => {
    navigate("/matches");
  };

  return (
    <div className="p-6 bg-black text-white min-h-screen flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold text-green-400">💬 Chat with {matchName}</h1>
        <button
          onClick={handleBack}
          className="bg-gray-700 px-3 py-1 rounded hover:bg-gray-600 transition"
        >
          ⬅ Back
        </button>
      </div>

      <div className="flex-1 bg-gray-800 rounded p-4 overflow-y-auto mb-4">
        {/* Placeholder chat messages */}
        <p className="text-gray-400">This is the start of your chat with {matchName}.</p>
      </div>

      <div className="flex space-x-2">
        <input
          type="text"
          placeholder="Type your message…"
          className="flex-1 rounded px-3 py-2 text-black"
        />
        <button className="bg-green-500 px-4 py-2 rounded hover:bg-green-600 transition">
          Send
        </button>
      </div>
    </div>
  );
};

export default Chat;
