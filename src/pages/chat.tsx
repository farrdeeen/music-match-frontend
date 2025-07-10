import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";

interface Match {
  spotify_id: string;
  display_name: string;
  profile_image: string;
  shared_artists: string[];
}

const Chat = () => {
  const { spotify_id } = useParams<{ spotify_id: string }>();
  const [match, setMatch] = useState<Match | null>(null);
  const [messages, setMessages] = useState<{ sender: string; text: string }[]>([]);
  const [newMessage, setNewMessage] = useState("");

  useEffect(() => {
    const matchesString = localStorage.getItem("matches");
    if (matchesString) {
      const matches: Match[] = JSON.parse(matchesString);
      const foundMatch = matches.find((m) => m.spotify_id === spotify_id);
      setMatch(foundMatch || null);
    }
  }, [spotify_id]);

  const handleSendMessage = () => {
    if (newMessage.trim() !== "") {
      setMessages((prev) => [...prev, { sender: "You", text: newMessage }]);
      setNewMessage("");
    }
  };

  return (
    <div className="flex flex-col h-screen bg-black text-white">
      {/* Chat Header */}
      <div className="flex items-center p-4 bg-gray-900 border-b border-gray-700">
        {match?.profile_image && (
          <img
            src={match.profile_image}
            alt={match.display_name}
            className="w-12 h-12 rounded-full border-2 border-green-500 mr-4"
          />
        )}
        <div>
          <h2 className="text-xl font-bold">{match?.display_name}</h2>
          <p className="text-gray-400 text-sm">
            Shared Artists: {match?.shared_artists?.join(", ") || "None"}
          </p>
        </div>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {messages.length === 0 ? (
          <p className="text-center text-gray-400">No messages yet. Start the conversation!</p>
        ) : (
          messages.map((msg, index) => (
            <div
              key={index}
              className={`flex ${
                msg.sender === "You" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`rounded-lg px-4 py-2 max-w-xs ${
                  msg.sender === "You"
                    ? "bg-green-500 text-black"
                    : "bg-gray-700 text-white"
                }`}
              >
                <p className="font-semibold">{msg.sender}</p>
                <p>{msg.text}</p>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Chat Input */}
      <div className="p-4 border-t border-gray-700 bg-gray-900 flex">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
          placeholder="Type a message…"
          className="flex-1 p-2 rounded-lg text-black"
        />
        <button
          onClick={handleSendMessage}
          className="ml-2 px-4 py-2 rounded-lg bg-green-500 hover:bg-green-600 text-black font-semibold"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default Chat;
